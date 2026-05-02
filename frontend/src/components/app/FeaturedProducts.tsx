// src/components/sections/FeaturedProducts.tsx
import { Link } from '@tanstack/react-router'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { useLang } from '@/lib/i18n/LangContext.tsx'
import { useProducts } from '@/hooks/useProducts'
import { categoryIcons } from '@/lib/icons'
import { ArrowRight, CheckCircle, XCircle } from '@/lib/icons'
import type { Product } from '@/services/productService'
import {useCurrency} from "@/lib/currency/CurrencyContext.tsx";

type CategoryKey = keyof typeof categoryIcons

export function FeaturedProducts() {
    const { lang, t } = useLang()
    const { data, isLoading } = useProducts({ is_featured: true, limit: 12 })
    const products = data?.products ?? []

    const getName = (p: Product) => p.name[lang] || p.name['en'] || ''
    const getDesc = (p: Product) => p.description[lang] || p.description['en'] || ''

    if (!isLoading && products.length === 0) return null

    return (
        <section className="bg-[#f0faf6] py-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex items-end justify-between mb-10 gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#1a6b4a] mb-2">
                            ✦ Featured
                        </p>
                        <h2
                            style={{ fontFamily: "'Playfair Display', serif" }}
                            className="text-3xl md:text-4xl font-bold text-[#0f2d1f]"
                        >
                            {t.products.title}
                        </h2>
                    </div>
                    <Link
                        to="/products"
                        className="hidden sm:inline-flex items-center gap-2 shrink-0 text-sm font-semibold text-[#1a6b4a] hover:gap-3 transition-all duration-200"
                    >
                        {t.products.all}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Swiper */}
                {isLoading ? (
                    <FeaturedLoading />
                ) : (
                    <>
                        <Swiper
                            modules={[Autoplay, Pagination]}
                            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                            pagination={{ clickable: true }}
                            slidesPerView={1}
                            spaceBetween={20}
                            loop={products.length > 4}
                            breakpoints={{
                                640:  { slidesPerView: 2 },
                                1024: { slidesPerView: 4 },
                            }}
                            className="!pb-10"
                        >
                            {products.map(p => (
                                <SwiperSlide key={p.id}>
                                    <FeaturedCard
                                        product={p}
                                        getName={getName}
                                        getDesc={getDesc}
                                        t={t}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Mobile view all */}
                        <div className="mt-4 text-center sm:hidden">
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 bg-[#1a6b4a] text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-[0_4px_12px_rgba(26,107,74,0.3)] hover:bg-[#165c3f] transition-all duration-200"
                            >
                                {t.products.all}
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}

function FeaturedCard({
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
        hover:shadow-[0_12px_40px_rgba(26,107,74,0.14)]
        hover:-translate-y-1.5 hover:border-[#b8ddc8]
        transition-all duration-300 overflow-hidden flex flex-col
      "
        >
            {/* Image */}
            <div
                className="relative h-44 flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: cat?.bg ?? '#f0faf6' }}
            >
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={getName(product)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="opacity-25">
                        {cat && <cat.icon className="w-16 h-16" style={{ color: cat.color }} />}
                    </div>
                )}

                {/* Stock badge */}
                <div className={`
          absolute top-3 right-3 flex items-center gap-1
          px-2 py-1 rounded-lg text-[10px] font-semibold backdrop-blur-sm
          ${product.in_stock ? 'bg-[#dcfce7]/90 text-[#16a34a]' : 'bg-[#fee2e2]/90 text-[#dc2626]'}
        `}>
                    {product.in_stock
                        ? <CheckCircle className="w-3 h-3" />
                        : <XCircle className="w-3 h-3" />
                    }
                    {product.in_stock ? t.products.inStock : t.products.outOfStock}
                </div>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col gap-2 flex-1">
                {cat && (
                    <div className="flex items-center gap-1.5">
                        <cat.icon className="w-3 h-3" style={{ color: cat.color }} />
                        <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: cat.color }}>
              {t.categories[product.category as CategoryKey]}
            </span>
                    </div>
                )}
                <h3 className="text-sm font-semibold text-[#0f2d1f] leading-snug line-clamp-2 group-hover:text-[#1a6b4a] transition-colors duration-200">
                    {getName(product)}
                </h3>
                <p className="text-xs text-[#2d5a47]/60 leading-relaxed line-clamp-2 flex-1">
                    {getDesc(product)}
                </p>
                <div className="pt-2 border-t border-[#f0faf6] mt-auto flex items-center justify-between">
                    {product.price != null
                        ? <span className="text-base font-bold text-[#1a6b4a]">{format(product.price!)}</span>
                        : <span className="text-xs text-[#2d5a47]/50 italic">{t.products.askInStore}</span>
                    }
                    <ArrowRight className="w-4 h-4 text-[#1a6b4a]/40 group-hover:text-[#1a6b4a] group-hover:translate-x-0.5 transition-all duration-200" />
                </div>
            </div>
        </Link>
    )
}

function FeaturedLoading() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-[#e8f5ee] overflow-hidden animate-pulse">
                    <div className="h-44 bg-[#e8f5ee]" />
                    <div className="p-4 flex flex-col gap-3">
                        <div className="h-3 bg-[#e8f5ee] rounded w-1/3" />
                        <div className="h-4 bg-[#e8f5ee] rounded w-3/4" />
                        <div className="h-3 bg-[#e8f5ee] rounded w-full" />
                        <div className="h-5 bg-[#e8f5ee] rounded w-1/4 mt-2" />
                    </div>
                </div>
            ))}
        </div>
    )
}