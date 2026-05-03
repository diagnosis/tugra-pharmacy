// src/components/sections/Products.tsx
import { useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import { Link } from '@tanstack/react-router'
import { useLang } from '@/lib/i18n/LangContext.tsx'
import { useProducts } from '@/hooks/useProducts.ts'
import { categoryIcons } from '@/lib/icons.ts'
import { Search, X, CheckCircle, XCircle, ArrowLeft, ArrowRight } from '@/lib/icons.ts'
import type { Product } from '@/services/productService.ts'
import {useCurrency} from "@/lib/currency/CurrencyContext.tsx";
import { useSearch } from '@tanstack/react-router'

const CATEGORY_KEYS = [
    'medications', 'vitamins', 'suncare', 'skincare', 'haircare',
    'baby', 'firstaid', 'devices', 'dental', 'eyecare', 'natural', 'other',
] as const

type CategoryKey = typeof CATEGORY_KEYS[number]

const PAGE_SIZE = 12

export function Products() {
    const { lang, t } = useLang()
    const [search, setSearch] = useState('')
    const [debouncedSearch] = useDebounceValue(search, 350)
    const [page, setPage] = useState(0)
    const { category: initialCategory } = useSearch({ from: '/products/' })
    const [activeCategory, setActiveCategory] = useState<CategoryKey | 'all'>(
        (initialCategory as CategoryKey | 'all') ?? 'all'
    )

    const handleCategoryChange = (cat: CategoryKey | 'all') => {
        setActiveCategory(cat)
        setPage(0)
    }

    const handleSearchChange = (val: string) => {
        setSearch(val)
        setPage(0)
    }

    const { data, isLoading, isError } = useProducts({
        category: activeCategory === 'all' ? undefined : activeCategory,
        search: debouncedSearch || undefined,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
    })

    const products = data?.products ?? []
    const total = data?.total ?? 0
    const totalPages = Math.ceil(total / PAGE_SIZE)
    const hasPrev = page > 0
    const hasNext = page < totalPages - 1

    const getName = (p: Product) => p.name[lang] || p.name['en'] || ''
    const getDesc = (p: Product) => p.description[lang] || p.description['en'] || ''

    return (
        <section className="bg-white py-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-10">
                    <h2
                        style={{ fontFamily: "'Playfair Display', serif" }}
                        className="text-4xl md:text-5xl font-bold text-[#0f2d1f] mb-3"
                    >
                        {t.products.title}
                    </h2>
                    <p className="text-[#2d5a47]/70 text-base">{t.products.subtitle}</p>
                </div>

                {/* Search + Category */}
                <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-10">

                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2d5a47]/40" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => handleSearchChange(e.target.value)}
                            placeholder={t.products.searchPlaceholder}
                            className="
                w-full pl-11 pr-10 py-3 rounded-xl
                border border-[#c8e6d4] bg-[#f0faf6]
                text-sm text-[#0f2d1f] placeholder:text-[#2d5a47]/40
                focus:outline-none focus:border-[#1a6b4a] focus:bg-white
                transition-all duration-200
              "
                        />
                        {search && (
                            <button
                                onClick={() => handleSearchChange('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2d5a47]/40 hover:text-[#1a6b4a] transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Category dropdown */}
                    <select
                        value={activeCategory}
                        onChange={e => handleCategoryChange(e.target.value as CategoryKey | 'all')}
                        className="
              px-4 py-3 rounded-xl
              border border-[#c8e6d4] bg-[#f0faf6]
              text-sm font-medium text-[#0f2d1f]
              focus:outline-none focus:border-[#1a6b4a] focus:bg-white
              transition-all duration-200 cursor-pointer
              sm:w-48
            "
                    >
                        <option value="all">{t.categories.all}</option>
                        {CATEGORY_KEYS.map(key => (
                            <option key={key} value={key}>{t.categories[key]}</option>
                        ))}
                    </select>
                </div>

                {/* States */}
                {isLoading && <ProductsLoading />}
                {isError && <ProductsError />}

                {/* Grid */}
                {!isLoading && !isError && (
                    products.length === 0
                        ? <ProductsEmpty search={search} />
                        : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                    {products.map(p => (
                                        <ProductCard
                                            key={p.id}
                                            product={p}
                                            getName={getName}
                                            getDesc={getDesc}
                                            t={t}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-4 mt-12">
                                        <button
                                            onClick={() => setPage(p => p - 1)}
                                            disabled={!hasPrev}
                                            className={`
                        flex items-center gap-2 px-5 py-2.5 rounded-xl
                        text-sm font-semibold border transition-all duration-200
                        ${hasPrev
                                                ? 'bg-white text-[#1a6b4a] border-[#c8e6d4] hover:border-[#1a6b4a] hover:bg-[#f0faf6] cursor-pointer'
                                                : 'bg-white text-[#2d5a47]/30 border-[#e8f5ee] cursor-not-allowed'
                                            }
                      `}
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Prev
                                        </button>

                                        <span className="text-sm text-[#2d5a47]/60 px-2">
                      Page{' '}
                                            <strong className="text-[#0f2d1f]">{page + 1}</strong>
                                            {' '}of{' '}
                                            <strong className="text-[#0f2d1f]">{totalPages}</strong>
                      <span className="ml-2 text-xs text-[#2d5a47]/40">({total} products)</span>
                    </span>

                                        <button
                                            onClick={() => setPage(p => p + 1)}
                                            disabled={!hasNext}
                                            className={`
                        flex items-center gap-2 px-5 py-2.5 rounded-xl
                        text-sm font-semibold border transition-all duration-200
                        ${hasNext
                                                ? 'bg-white text-[#1a6b4a] border-[#c8e6d4] hover:border-[#1a6b4a] hover:bg-[#f0faf6] cursor-pointer'
                                                : 'bg-white text-[#2d5a47]/30 border-[#e8f5ee] cursor-not-allowed'
                                            }
                      `}
                                        >
                                            Next
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )
                )}
            </div>
        </section>
    )
}

function ProductCard({
                         product, getName, getDesc, t,
                     }: {
    product: Product
    getName: (p: Product) => string
    getDesc: (p: Product) => string
    t: any
}) {
    const cat = categoryIcons[product.category as CategoryKey]
    const { format } = useCurrency()
    return (
        <Link
            to="/products/$productId"
            params={{ productId: product.id }}
            className="
        group bg-white rounded-2xl border border-[#e8f5ee]
        shadow-[0_2px_12px_rgba(26,107,74,0.06)]
        hover:shadow-[0_8px_32px_rgba(26,107,74,0.12)]
        hover:-translate-y-1 hover:border-[#c8e6d4]
        transition-all duration-300 overflow-hidden flex flex-col
      "
        >
            <div className="relative h-44 bg-[#f0faf6] flex items-center justify-center overflow-hidden">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={getName(product)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: cat?.bg }}
                    >
                        {cat && <cat.icon className="w-10 h-10" style={{ color: cat.color }} />}
                    </div>
                )}
                <div className={`
          absolute top-3 right-3 flex items-center gap-1
          px-2 py-1 rounded-lg text-[10px] font-semibold
          ${product.in_stock ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#fee2e2] text-[#dc2626]'}
        `}>
                    {product.in_stock
                        ? <CheckCircle className="w-3 h-3" />
                        : <XCircle className="w-3 h-3" />
                    }
                    {product.in_stock ? t.products.inStock : t.products.outOfStock}
                </div>
            </div>

            <div className="p-4 flex flex-col gap-2 flex-1">
                {cat && (
                    <div className="flex items-center gap-1.5">
                        <cat.icon className="w-3 h-3" style={{ color: cat.color }} />
                        <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: cat.color }}>
              {t.categories[product.category as CategoryKey]}
            </span>
                    </div>
                )}
                <h3 className="text-sm font-semibold text-[#0f2d1f] leading-snug line-clamp-2 group-hover:text-[#1a6b4a] transition-colors">
                    {getName(product)}
                </h3>
                <p className="text-xs text-[#2d5a47]/60 leading-relaxed line-clamp-2 flex-1">
                    {getDesc(product)}
                </p>
                <div className="pt-2 border-t border-[#f0faf6] mt-auto">
                    {product.price != null
                        ? <span className="text-base font-bold text-[#1a6b4a]">{format(product.price!)}</span>
                        : <span className="text-xs text-[#2d5a47]/50 italic">{t.products.askInStore}</span>
                    }
                </div>
            </div>
        </Link>
    )
}

function ProductsLoading() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-[#e8f5ee] overflow-hidden animate-pulse">
                    <div className="h-44 bg-[#f0faf6]" />
                    <div className="p-4 flex flex-col gap-3">
                        <div className="h-3 bg-[#f0faf6] rounded w-1/3" />
                        <div className="h-4 bg-[#f0faf6] rounded w-3/4" />
                        <div className="h-3 bg-[#f0faf6] rounded w-full" />
                        <div className="h-3 bg-[#f0faf6] rounded w-2/3" />
                        <div className="h-5 bg-[#f0faf6] rounded w-1/4 mt-2" />
                    </div>
                </div>
            ))}
        </div>
    )
}

function ProductsError() {
    return (
        <div className="text-center py-20 text-[#2d5a47]/60">
            <p className="text-base">Failed to load products. Please try again.</p>
        </div>
    )
}

function ProductsEmpty({ search }: { search: string }) {
    return (
        <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-[#f0faf6] flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-[#1a6b4a]/30" />
            </div>
            <p className="text-[#2d5a47]/60 text-sm">
                {search ? `No products found for "${search}"` : 'No products in this category yet.'}
            </p>
        </div>
    )
}