// src/components/sections/Hero.tsx
import { useLang } from '@/lib/i18n/LangContext.tsx'
import { Cross, MapPin, ArrowRight } from '@/lib/icons.ts'
import { Sun } from 'lucide-react'
import { featureIcons, categoryIcons } from '@/lib/icons.ts'
import { Link } from '@tanstack/react-router'

const CATEGORY_KEYS = ['medications', 'vitamins', 'suncare', 'skincare', 'haircare', 'baby', 'firstaid', 'devices'] as const

export function Hero() {
    const { t } = useLang()

    return (
        <section
            id="home"
            className="relative overflow-hidden bg-gradient-to-br from-[#f0faf6] via-[#e8f5ee] to-[#f5f9f0]"
        >
            {/* Background decorative circles */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#1a6b4a]/5" />
                <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-[#0e7490]/5" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#1a6b4a]/3" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left — text content */}
                    <div className="flex flex-col gap-6">

                        {/* Badges */}
                        <div className="flex items-center gap-2 w-fit flex-wrap">
              <span className="
                flex items-center gap-1.5
                bg-[#1a6b4a]/10 text-[#1a6b4a]
                px-3 py-1.5 rounded-full
                text-xs font-semibold tracking-wide
                border border-[#1a6b4a]/15
              ">
                <MapPin className="w-3 h-3" />
                  {t.hero.badge}
              </span>
                            {/* Open pill */}
                            <span className="flex items-center gap-1.5 bg-white/80 border border-[#c8e6d4]/60 px-3 py-1.5 rounded-full text-xs font-medium text-[#1a6b4a]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#4ade80]" />
                </span>
                                {t.hero.open} {t.hero.hours}
              </span>
                        </div>

                        {/* Title */}
                        <div>
                            <h1
                                style={{ fontFamily: "'Playfair Display', serif" }}
                                className="text-5xl md:text-6xl font-bold text-[#0f2d1f] leading-[1.1] mb-3"
                            >
                                {t.hero.title}
                            </h1>
                            <p className="text-lg text-[#1a6b4a] font-medium">
                                {t.hero.subtitle}
                            </p>
                        </div>

                        {/* Description */}
                        <p className="text-[#2d5a47]/80 text-base leading-relaxed max-w-md">
                            {t.hero.description}
                        </p>

                        {/* CTAs */}
                        <div className="flex items-center gap-4 flex-wrap">
                            <Link
                                to="/products"
                                className="
    inline-flex items-center gap-2
    bg-[#1a6b4a] text-white
    px-6 py-3.5 rounded-xl
    text-sm font-semibold
    shadow-[0_4px_16px_rgba(26,107,74,0.35)]
    hover:bg-[#165c3f]
    hover:shadow-[0_8px_24px_rgba(26,107,74,0.45)]
    hover:-translate-y-0.5
    transition-all duration-200
  "
                            >
                                {t.hero.cta}
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <a
                                href="https://maps.app.goo.gl/aF7kWSV46eGwWg298"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
    inline-flex items-center gap-2
    bg-white/80 text-[#1a6b4a]
    px-6 py-3.5 rounded-xl
    text-sm font-semibold
    border border-[#c8e6d4]
    hover:bg-white hover:border-[#1a6b4a]/30
    transition-all duration-200
  "
                            >
                                <MapPin className="w-4 h-4" />
                                {t.contact.directions}
                            </a>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            {t.features.map((f) => {
                                const Icon = featureIcons[f.key]
                                return (
                                    <div
                                        key={f.key}
                                        className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-[#c8e6d4]/50"
                                    >
                                        {Icon && <Icon className="w-5 h-5 text-[#1a6b4a] shrink-0" />}
                                        <div>
                                            <p className="text-xs font-semibold text-[#0f2d1f]">{f.title}</p>
                                            <p className="text-xs text-[#2d5a47]/60">{f.desc}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Right — visual card */}
                    <div className="hidden lg:flex items-center justify-center">
                        <div className="relative">

                            {/* Main card */}
                            <div className="
                bg-white rounded-3xl
                shadow-[0_24px_64px_rgba(26,107,74,0.12)]
                border border-[#c8e6d4]/60
                p-8 w-[340px]
              ">
                                {/* Logo area */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-[#1a6b4a] flex items-center justify-center shadow-[0_4px_12px_rgba(26,107,74,0.3)]">
                                        <Cross className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg font-bold text-[#0f2d1f]">
                                            Tuğra
                                        </p>
                                        <p className="text-xs text-[#2d5a47]/60">Eczane · Pharmacy</p>
                                    </div>
                                </div>

                                {/* Category icons grid */}
                                <div className="grid grid-cols-4 gap-2 mb-6">
                                    {CATEGORY_KEYS.map((key) => {
                                        const cat = categoryIcons[key]
                                        return (
                                            <div
                                                key={key}
                                                className="relative group aspect-square rounded-xl flex items-center justify-center transition-all duration-200 cursor-default hover:scale-105"
                                                style={{ backgroundColor: cat?.bg }}
                                            >
                                                {cat && <cat.icon className="w-5 h-5" style={{ color: cat.color }} />}

                                                {/* Tooltip */}
                                                <div className="
        absolute -top-8 left-1/2 -translate-x-1/2
        bg-[#0f2d1f] text-white
        text-[10px] font-medium whitespace-nowrap
        px-2 py-1 rounded-lg
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        pointer-events-none z-10
      ">
                                                    {t.categories[key]}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Lang badges */}
                                <div className="flex gap-2 flex-wrap mb-5">
                                    {['🇬🇧 EN', '🇹🇷 TR', '🇷🇺 RU', '🇩🇪 DE'].map(l => (
                                        <span
                                            key={l}
                                            className="text-xs font-semibold bg-[#1a6b4a]/8 text-[#1a6b4a] px-2.5 py-1 rounded-lg border border-[#1a6b4a]/15"
                                        >
                      {l}
                    </span>
                                    ))}
                                </div>

                                {/* Hours */}
                                <div className="flex items-center justify-between bg-[#f0faf6] rounded-xl px-4 py-3 border border-[#c8e6d4]/40">
                                    <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-60" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ade80]" />
                    </span>
                                        <span className="text-xs font-medium text-[#1a6b4a]">{t.hero.open}</span>
                                    </div>
                                    <span className="text-xs font-bold text-[#0f2d1f]">{t.hero.hours}</span>
                                </div>
                            </div>

                            {/* Floating pill — top right */}
                            <div className="
                absolute -top-4 -right-4
                bg-white rounded-2xl px-4 py-2.5
                shadow-[0_8px_24px_rgba(26,107,74,0.12)]
                border border-[#c8e6d4]/60
                flex items-center gap-2
              ">
                                <MapPin className="w-4 h-4 text-[#1a6b4a]" />
                                <span className="text-xs font-semibold text-[#0f2d1f]">Belek, Antalya</span>
                            </div>

                            {/* Floating pill — bottom left */}
                            <div className="
                absolute -bottom-4 -left-4
                bg-[#1a6b4a] rounded-2xl px-4 py-2.5
                shadow-[0_8px_24px_rgba(26,107,74,0.3)]
                flex items-center gap-2
              ">
                                <Sun className="w-4 h-4 text-white" />
                                <span className="text-xs font-semibold text-white">SPF 50+</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}