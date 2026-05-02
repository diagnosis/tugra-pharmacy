// src/components/app/Header.tsx
import { useState, useEffect } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { useLang } from '@/lib/i18n/LangContext.tsx'
import { type Lang } from '@/lib/i18n/translations.ts'
import { Cross, Menu, X } from '@/lib/icons.ts'
import {type Currency, useCurrency} from "@/lib/currency/CurrencyContext.tsx";

const LANGS = [
    { code: 'en', flag: '🇬🇧', label: 'EN' },
    { code: 'tr', flag: '🇹🇷', label: 'TR' },
    { code: 'ru', flag: '🇷🇺', label: 'RU' },
    { code: 'de', flag: '🇩🇪', label: 'DE' },
]
const CURRENCIES: { code: Currency; label: string }[] = [
    { code: 'TRY', label: '₺' },
    { code: 'EUR', label: '€' },
    { code: 'USD', label: '$' },
]

const NAV_LINKS = [
    { key: 'home',     to: '/'         },
    { key: 'products', to: '/products' },
    { key: 'about',    to: '/about'    },
    { key: 'contact',  to: '/contact'  },
] as const

export function Header() {
    const { lang, setLang, t } = useLang()
    const { currency, setCurrency } = useCurrency()
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const { pathname } = useLocation()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 48)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [menuOpen])

    // close menu on route change
    useEffect(() => { setMenuOpen(false) }, [pathname])

    const isActive = (to: string) =>
        to === '/' ? pathname === '/' : pathname.startsWith(to)

    return (
        <>
            <header
                className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled
                    ? 'bg-[#f0faf6]/95 backdrop-blur-md shadow-[0_2px_24px_rgba(26,107,74,0.08)]'
                    : 'bg-transparent'
                }
        `}
            >
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between gap-6">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
                            <div className="
                w-9 h-9 rounded-xl bg-[#1a6b4a] text-white
                flex items-center justify-center
                shadow-[0_4px_12px_rgba(26,107,74,0.3)]
                group-hover:shadow-[0_4px_20px_rgba(26,107,74,0.45)]
                group-hover:bg-[#165c3f]
                transition-all duration-300
              ">
                                <Cross className="w-4 h-4" />
                            </div>
                            <span
                                style={{ fontFamily: "'Playfair Display', serif" }}
                                className="text-xl font-bold text-[#0f2d1f] tracking-tight"
                            >
                Tuğra
              </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            {NAV_LINKS.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`
                    text-sm font-medium transition-colors duration-200 relative
                    after:absolute after:bottom-[-3px] after:left-0 after:right-0
                    after:h-[1.5px] after:bg-[#1a6b4a] after:rounded-full
                    after:transition-transform after:duration-200 after:origin-left
                    ${isActive(link.to)
                                        ? 'text-[#1a6b4a] after:scale-x-100'
                                        : 'text-[#2d5a47] hover:text-[#1a6b4a] after:scale-x-0 hover:after:scale-x-100'
                                    }
                  `}
                                >
                                    {t.nav[link.key]}
                                </Link>
                            ))}
                        </nav>

                        {/* Right: lang switcher + burger */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 bg-white/60 backdrop-blur-sm rounded-xl p-1 border border-[#c8e6d4]/60">
                                {CURRENCIES.map(c => (
                                    <button
                                        key={c.code}
                                        onClick={() => setCurrency(c.code)}
                                        className={`
        px-2 py-1 rounded-lg text-xs font-semibold
        transition-all duration-200 cursor-pointer
        ${currency === c.code
                                            ? 'bg-[#1a6b4a] text-white shadow-[0_2px_8px_rgba(26,107,74,0.3)]'
                                            : 'text-[#2d5a47] hover:bg-[#d1f0e0]/60'
                                        }
      `}
                                    >
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-1 bg-white/60 backdrop-blur-sm rounded-xl p-1 border border-[#c8e6d4]/60">
                                {LANGS.map(l => (
                                    <button
                                        key={l.code}
                                        onClick={() => setLang(l.code as Lang)}
                                        className={`
                      flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold
                      transition-all duration-200 cursor-pointer
                      ${lang === l.code
                                            ? 'bg-[#1a6b4a] text-white shadow-[0_2px_8px_rgba(26,107,74,0.3)]'
                                            : 'text-[#2d5a47] hover:bg-[#d1f0e0]/60'
                                        }
                    `}
                                        aria-label={`Switch to ${l.label}`}
                                    >
                                        <span>{l.flag}</span>
                                        <span className="hidden sm:inline">{l.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Mobile burger */}
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="md:hidden p-2 rounded-lg hover:bg-[#d1f0e0]/60 transition-colors text-[#1a6b4a]"
                                aria-label="Toggle menu"
                            >
                                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`
          md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}
          bg-[#f0faf6]/98 backdrop-blur-md border-t border-[#c8e6d4]/60
        `}>
                    <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
                        {NAV_LINKS.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`
                  text-base font-medium px-4 py-3 rounded-xl
                  transition-colors duration-200
                  ${isActive(link.to)
                                    ? 'bg-[#1a6b4a]/10 text-[#1a6b4a] font-semibold'
                                    : 'text-[#1a6b4a] hover:bg-[#d1f0e0]/50'
                                }
                `}
                            >
                                {t.nav[link.key]}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Spacer */}
            <div className="h-[73px]" />
        </>
    )
}