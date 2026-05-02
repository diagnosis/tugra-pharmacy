// src/components/admin/ProductForm.tsx
import {useState, useRef, useEffect} from 'react'
import { categoryIcons } from '@/lib/icons'
import { Upload, X, CheckCircle } from 'lucide-react'
import type { Product } from '@/services/productService'
import type { ProductMutationReq } from '@/services/adminProductService'

const LANGS = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'tr', label: 'Türkçe',  flag: '🇹🇷' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
]

const CATEGORIES = Object.keys(categoryIcons) as (keyof typeof categoryIcons)[]

interface ProductFormProps {
    initial?: Product
    onSubmit: (data: ProductMutationReq, image?: File) => Promise<void>
    loading: boolean
    error?: string
}

export function ProductForm({ initial, onSubmit, loading, error }: ProductFormProps) {
    const [activeLang, setActiveLang] = useState('en')
    const [name, setName] = useState<Record<string, string>>(
        initial?.name ?? { en: '', tr: '', ru: '', de: '' }
    )
    const [description, setDescription] = useState<Record<string, string>>(
        initial?.description ?? { en: '', tr: '', ru: '', de: '' }
    )
    const [category, setCategory] = useState(initial?.category ?? 'medications')
    const [price, setPrice] = useState<string>(initial?.price != null ? String(initial.price) : '')
    const [inStock, setInStock] = useState(initial?.in_stock ?? true)
    const [isFeatured, setIsFeatured] = useState(initial?.is_featured ?? false)
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>(initial?.image_url ?? '')
    const fileRef = useRef<HTMLInputElement>(null)

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setImage(file)
        setImagePreview(URL.createObjectURL(file))
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log('is_featured value on submit:', isFeatured)
        await onSubmit({
            name,
            description,
            category,
            price: price ? parseFloat(price) : null,
            in_stock: inStock,
            is_featured: isFeatured,
        }, image ?? undefined)
    }



    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl">

            {error && (
                <div className="bg-[#fee2e2] text-[#dc2626] text-sm px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}

            {/* Name & Description */}
            <div className="bg-white rounded-2xl border border-[#e8f5ee] p-6">
                <h3 className="text-sm font-semibold text-[#0f2d1f] mb-4">Name & Description</h3>

                {/* Lang tabs */}
                <div className="flex gap-2 mb-5">
                    {LANGS.map(l => (
                        <button
                            key={l.code}
                            type="button"
                            onClick={() => setActiveLang(l.code)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                                activeLang === l.code
                                    ? 'bg-[#1a6b4a] text-white border-[#1a6b4a]'
                                    : 'bg-white text-[#2d5a47] border-[#c8e6d4] hover:bg-[#f0faf6]'
                            }`}
                        >
                            {l.flag} {l.label}
                        </button>
                    ))}
                </div>

                {LANGS.map(l => (
                    <div key={l.code} className={l.code === activeLang ? 'flex flex-col gap-3' : 'hidden'}>
                        <div>
                            <label className="text-xs font-semibold text-[#2d5a47]/60 uppercase tracking-wide mb-1.5 block">
                                Name ({l.label}) {l.code === 'en' && '*'}
                            </label>
                            <input
                                type="text"
                                value={name[l.code] ?? ''}
                                onChange={e => setName(n => ({ ...n, [l.code]: e.target.value }))}
                                placeholder={`Product name in ${l.label}`}
                                required={l.code === 'en'}
                                className="w-full px-4 py-2.5 rounded-xl border border-[#c8e6d4] bg-[#f0faf6] text-sm text-[#0f2d1f] focus:outline-none focus:border-[#1a6b4a] focus:bg-white transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-[#2d5a47]/60 uppercase tracking-wide mb-1.5 block">
                                Description ({l.label}) {l.code === 'en' && '*'}
                            </label>
                            <textarea
                                value={description[l.code] ?? ''}
                                onChange={e => setDescription(d => ({ ...d, [l.code]: e.target.value }))}
                                placeholder={`Description in ${l.label}`}
                                required={l.code === 'en'}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-xl border border-[#c8e6d4] bg-[#f0faf6] text-sm text-[#0f2d1f] focus:outline-none focus:border-[#1a6b4a] focus:bg-white transition-all resize-none"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl border border-[#e8f5ee] p-6">
                <h3 className="text-sm font-semibold text-[#0f2d1f] mb-4">Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* Category */}
                    <div>
                        <label className="text-xs font-semibold text-[#2d5a47]/60 uppercase tracking-wide mb-1.5 block">
                            Category *
                        </label>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-[#c8e6d4] bg-[#f0faf6] text-sm text-[#0f2d1f] focus:outline-none focus:border-[#1a6b4a] focus:bg-white transition-all"
                        >
                            {CATEGORIES.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price */}
                    <div>
                        <label className="text-xs font-semibold text-[#2d5a47]/60 uppercase tracking-wide mb-1.5 block">
                            Price (₺)
                        </label>
                        <input
                            type="number"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2.5 rounded-xl border border-[#c8e6d4] bg-[#f0faf6] text-sm text-[#0f2d1f] focus:outline-none focus:border-[#1a6b4a] focus:bg-white transition-all"
                        />
                    </div>

                    {/* Stock */}
                    <div>
                        <label className="text-xs font-semibold text-[#2d5a47]/60 uppercase tracking-wide mb-1.5 block">
                            Stock Status
                        </label>
                        <div className="flex gap-2">
                            {[true, false].map(val => (
                                <button
                                    key={String(val)}
                                    type="button"
                                    onClick={() => setInStock(val)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                                        inStock === val
                                            ? val
                                                ? 'bg-[#dcfce7] text-[#16a34a] border-[#16a34a]/30'
                                                : 'bg-[#fee2e2] text-[#dc2626] border-[#dc2626]/30'
                                            : 'bg-white text-[#2d5a47]/50 border-[#c8e6d4] hover:bg-[#f0faf6]'
                                    }`}
                                >
                                    {val ? <CheckCircle className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                                    {val ? 'In Stock' : 'Out of Stock'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Featured */}
                    <div>
                        <label className="text-xs font-semibold text-[#2d5a47]/60 uppercase tracking-wide mb-1.5 block">
                            Featured on Homepage
                        </label>
                        <div className="flex gap-2">
                            {[true, false].map(val => (
                                <button
                                    key={String(val)}
                                    type="button"
                                    onClick={() => setIsFeatured(val)}
                                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                                        isFeatured === val
                                            ? val
                                                ? 'bg-[#fffbeb] text-[#f59e0b] border-[#f59e0b]/30'
                                                : 'bg-[#f0faf6] text-[#2d5a47] border-[#c8e6d4]'
                                            : 'bg-white text-[#2d5a47]/50 border-[#c8e6d4] hover:bg-[#f0faf6]'
                                    }`}
                                >
                                    {val ? '⭐ Featured' : 'Not Featured'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Image */}
            <div className="bg-white rounded-2xl border border-[#e8f5ee] p-6">
                <h3 className="text-sm font-semibold text-[#0f2d1f] mb-4">Product Image</h3>
                <div
                    onClick={() => fileRef.current?.click()}
                    className="relative border-2 border-dashed border-[#c8e6d4] rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#1a6b4a] hover:bg-[#f0faf6] transition-all duration-200 overflow-hidden"
                    style={{ minHeight: imagePreview ? 'auto' : '160px' }}
                >
                    {imagePreview ? (
                        <div className="relative w-full">
                            <img src={imagePreview} className="w-full max-h-64 object-cover rounded-xl" alt="Preview" />
                            <button
                                type="button"
                                onClick={e => { e.stopPropagation(); setImage(null); setImagePreview('') }}
                                className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white"
                            >
                                <X className="w-3.5 h-3.5 text-[#dc2626]" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 p-8">
                            <div className="w-12 h-12 rounded-xl bg-[#f0faf6] flex items-center justify-center">
                                <Upload className="w-5 h-5 text-[#1a6b4a]/50" />
                            </div>
                            <p className="text-sm text-[#2d5a47]/60">Click to upload image</p>
                            <p className="text-xs text-[#2d5a47]/40">JPG, PNG, WebP — max 10MB</p>
                        </div>
                    )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={loading}
                className="bg-[#1a6b4a] text-white px-8 py-3.5 rounded-xl text-sm font-semibold shadow-[0_4px_12px_rgba(26,107,74,0.3)] hover:bg-[#165c3f] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed self-start"
            >
                {loading ? 'Saving…' : initial ? 'Save Changes' : 'Create Product'}
            </button>
        </form>
    )
}