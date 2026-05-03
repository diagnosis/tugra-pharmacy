// src/routes/products/$productId.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { useProduct } from '@/hooks/useProducts'
import { useLang } from '@/lib/i18n/LangContext.tsx'
import { categoryIcons } from '@/lib/icons'
import { ArrowLeft, CheckCircle, XCircle, MapPin } from '@/lib/icons'
import type { Product } from '@/services/productService'
import {useCurrency} from "@/lib/currency/CurrencyContext.tsx";

type CategoryKey = keyof typeof categoryIcons

export const Route = createFileRoute('/products/$productId')({
    component: ProductDetailPage,
})

function ProductDetailPage() {
    const { productId } = Route.useParams()
    const { lang, t } = useLang()
    const { format } = useCurrency()
    const { data: product, isLoading, isError } = useProduct(productId)

    const getName = (p: Product) => p.name[lang] || p.name['en'] || ''
    const getDesc = (p: Product) => p.description[lang] || p.description['en'] || ''

    if (isLoading) return <ProductDetailLoading />
    if (isError || !product) return <ProductDetailError t={t} />

    const cat = categoryIcons[product.category as CategoryKey]

    return (
        <div className="min-h-screen bg-[#f0faf6]">
            <div className="max-w-5xl mx-auto px-6 py-10">

                {/* Back */}
                <Link
                    to="/products"
                    search={{category:'all'}}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#2d5a47] hover:text-[#1a6b4a] transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t.products.all}
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                    {/* Image */}
                    <div
                        className="rounded-3xl overflow-hidden h-80 md:h-auto flex items-center justify-center border border-[#c8e6d4]/60 shadow-[0_8px_32px_rgba(26,107,74,0.10)]"
                        style={{ backgroundColor: cat?.bg ?? '#f0faf6' }}
                    >
                        {product.image_url ? (
                            <img
                                src={product.image_url}
                                alt={getName(product)}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="opacity-20">
                                {cat && <cat.icon className="w-28 h-28" style={{ color: cat.color }} />}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-5">

                        {/* Category */}
                        {cat && (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: cat.bg }}>
                                    <cat.icon className="w-4 h-4" style={{ color: cat.color }} />
                                </div>
                                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: cat.color }}>
                  {t.categories[product.category as keyof typeof t.categories]}
                </span>
                            </div>
                        )}

                        {/* Name */}
                        <h1
                            style={{ fontFamily: "'Playfair Display', serif" }}
                            className="text-3xl font-bold text-[#0f2d1f] leading-tight"
                        >
                            {getName(product)}
                        </h1>

                        {/* Stock */}
                        <div className={`
              inline-flex items-center gap-2 w-fit
              px-3 py-1.5 rounded-xl text-sm font-semibold
              ${product.in_stock ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#fee2e2] text-[#dc2626]'}
            `}>
                            {product.in_stock
                                ? <CheckCircle className="w-4 h-4" />
                                : <XCircle className="w-4 h-4" />
                            }
                            {product.in_stock ? t.products.inStock : t.products.outOfStock}
                        </div>

                        {/* Description */}
                        <p className="text-[#2d5a47]/75 leading-relaxed text-base">
                            {getDesc(product)}
                        </p>

                        {/* Price */}
                        <div className="pt-4 border-t border-[#c8e6d4]/60">
                            {product.price != null
                                ? (
                                    <div>
                                        <p className="text-xs text-[#2d5a47]/50 mb-1">Price</p>
                                        <p className="text-3xl font-bold text-[#1a6b4a]">{format(product.price!)}</p>
                                    </div>
                                )
                                : <p className="text-sm text-[#2d5a47]/60 italic">{t.products.askInStore}</p>
                            }
                        </div>

                        {/* Visit store CTA */}
                        <a
                            href="https://maps.google.com/?q=Belek,Antalya,Turkey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                inline-flex items-center justify-center gap-2
                bg-[#1a6b4a] text-white
                px-6 py-4 rounded-2xl mt-2
                text-sm font-semibold
                shadow-[0_4px_16px_rgba(26,107,74,0.35)]
                hover:bg-[#165c3f] hover:-translate-y-0.5
                transition-all duration-200
              "
                        >
                            <MapPin className="w-4 h-4" />
                            {t.contact.directions}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ProductDetailLoading() {
    return (
        <div className="min-h-screen bg-[#f0faf6]">
            <div className="max-w-5xl mx-auto px-6 py-10">
                <div className="h-6 w-24 bg-[#e8f5ee] rounded animate-pulse mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="rounded-3xl h-80 bg-[#e8f5ee] animate-pulse" />
                    <div className="flex flex-col gap-4">
                        <div className="h-4 w-24 bg-[#e8f5ee] rounded animate-pulse" />
                        <div className="h-8 w-3/4 bg-[#e8f5ee] rounded animate-pulse" />
                        <div className="h-6 w-28 bg-[#e8f5ee] rounded animate-pulse" />
                        <div className="h-20 bg-[#e8f5ee] rounded animate-pulse" />
                        <div className="h-10 w-32 bg-[#e8f5ee] rounded animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function ProductDetailError({ t }: { t: any }) {
    return (
        <div className="min-h-screen bg-[#f0faf6] flex items-center justify-center">
            <div className="text-center">
                <p className="text-[#2d5a47]/60 mb-4">Product not found.</p>
                <Link to="/products" search={{category:'all'}} className="text-sm font-semibold text-[#1a6b4a] hover:underline">
                    ← {t.products.all}
                </Link>
            </div>
        </div>
    )
}