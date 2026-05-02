// src/components/app/Footer.tsx
import { useLang } from '@/lib/i18n/LangContext.tsx'
import { Cross, MapPin, Phone, Clock } from '@/lib/icons.ts'

export function Footer() {
    const { t } = useLang()

    return (
        <footer className="bg-[#0f2d1f] text-white">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

                    {/* Brand */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#1a6b4a] flex items-center justify-center shadow-[0_4px_12px_rgba(26,107,74,0.4)]">
                                <Cross className="w-4 h-4 text-white" />
                            </div>
                            <span
                                style={{ fontFamily: "'Playfair Display', serif" }}
                                className="text-xl font-bold text-[#a7d4bc]"
                            >
                Tuğra
              </span>
                        </div>
                        <p className="text-sm text-white/50 leading-relaxed max-w-[200px]">
                            {t.footer.tagline}
                        </p>
                        {/* Open indicator */}
                        <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ade80]" />
              </span>
                            <span className="text-xs text-[#4ade80] font-medium">{t.footer.hours}</span>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-[#4ade80]/70">
                            Belek, Antalya
                        </h4>
                        <div className="flex flex-col gap-2.5 text-sm text-white/55">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                  {t.contact.address}
              </span>
                            <a
                                href={`tel:${t.contact.phone.replace(/\s/g, '')}`}
                                className="flex items-center gap-2 hover:text-[#a7d4bc] transition-colors duration-200"
                            >
                                <Phone className="w-4 h-4 shrink-0" />
                                {t.contact.phone}
                            </a>
                            <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0" />
                                {t.contact.hours}
              </span>
                            <a
                                href="https://maps.app.goo.gl/aF7kWSV46eGwWg298"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:text-[#a7d4bc] transition-colors duration-200 w-fit"
                            >
                                <MapPin className="w-4 h-4 shrink-0" />
                                {t.footer.directions}
                            </a>
                        </div>
                    </div>

                    {/* Languages */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-[#4ade80]/70">
                            EN · TR · RU · DE
                        </h4>
                        <div className="flex flex-col gap-1.5 text-sm text-white/50 leading-relaxed">
                            <span>🇬🇧 We speak your language.</span>
                            <span>🇹🇷 Sizin dilinizi konuşuyoruz.</span>
                            <span>🇷🇺 Говорим по-вашему.</span>
                            <span>🇩🇪 Wir sprechen Ihre Sprache.</span>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-white/25">{t.footer.rights}</p>
                    <a
                        href="/admin/login"
                        className="text-xs text-white/15 hover:text-white/35 transition-colors duration-200"
                    >
                        {t.footer.admin}
                    </a>
                </div>
            </div>
        </footer>
    )
}