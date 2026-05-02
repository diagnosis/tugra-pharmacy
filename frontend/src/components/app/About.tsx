// src/components/sections/About.tsx
import { useLang } from '@/lib/i18n/LangContext.tsx'
import { Cross, Globe } from '@/lib/icons'

const LANG_ITEMS = [
    { flag: '🇬🇧', code: 'EN', label: 'English' },
    { flag: '🇹🇷', code: 'TR', label: 'Türkçe'  },
    { flag: '🇷🇺', code: 'RU', label: 'Русский'  },
    { flag: '🇩🇪', code: 'DE', label: 'Deutsch'  },
]

export function About() {
    const { t } = useLang()

    return (
        <section id="about" className="bg-white py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left — text */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-[#1a6b4a] mb-3">
                                ✦ {t.nav.about}
                            </p>
                            <h2
                                style={{ fontFamily: "'Playfair Display', serif" }}
                                className="text-3xl md:text-4xl font-bold text-[#0f2d1f] mb-4"
                            >
                                {t.about.title}
                            </h2>
                        </div>
                        <p className="text-[#2d5a47]/75 leading-relaxed">{t.about.p1}</p>
                        <p className="text-[#2d5a47]/75 leading-relaxed">{t.about.p2}</p>
                        <p className="text-[#2d5a47]/75 leading-relaxed">{t.about.p3}</p>

                        {/* Language badges */}
                        <div className="flex flex-wrap gap-3 pt-2">
                            {LANG_ITEMS.map(l => (
                                <div
                                    key={l.code}
                                    className="flex items-center gap-2 bg-[#f0faf6] border border-[#c8e6d4]/60 px-4 py-2 rounded-xl"
                                >
                                    <span className="text-lg">{l.flag}</span>
                                    <div>
                                        <p className="text-xs font-bold text-[#0f2d1f]">{l.code}</p>
                                        <p className="text-[10px] text-[#2d5a47]/60">{l.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — card */}
                    <div className="flex justify-center lg:justify-end">
                        <div className="relative">
                            <div className="
                bg-[#0f2d1f] rounded-3xl p-8 w-full max-w-sm
                shadow-[0_24px_64px_rgba(15,45,31,0.25)]
              ">
                                {/* Logo */}
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-[#1a6b4a] flex items-center justify-center shadow-[0_4px_12px_rgba(26,107,74,0.4)]">
                                        <Cross className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg font-bold text-[#a7d4bc]">
                                            Tuğra
                                        </p>
                                        <p className="text-xs text-white/40">Eczane · Pharmacy · Аптека</p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {[
                                        { value: '4',    label: 'Languages'       },
                                        { value: '12',   label: 'Categories'      },
                                        { value: '08–22',label: 'Open daily'      },
                                        { value: '🏖️',   label: 'Heart of Belek'  },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                            <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-[#4ade80] mb-1">
                                                {stat.value}
                                            </p>
                                            <p className="text-xs text-white/50">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Open indicator */}
                                <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-60" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4ade80]" />
                  </span>
                                    <span className="text-sm font-medium text-[#4ade80]">{t.hero.open}</span>
                                    <span className="ml-auto text-sm font-bold text-white">{t.hero.hours}</span>
                                </div>
                            </div>

                            {/* Floating badge */}
                            <div className="
                absolute -top-4 -right-4
                bg-[#1a6b4a] text-white
                rounded-2xl px-4 py-2.5
                shadow-[0_8px_24px_rgba(26,107,74,0.35)]
                flex items-center gap-2
              ">
                                <Globe className="w-4 h-4" />
                                <span className="text-xs font-semibold">EN · TR · RU · DE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}