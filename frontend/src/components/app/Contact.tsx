// src/components/sections/Contact.tsx
import { useLang } from '@/lib/i18n/LangContext.tsx'
import { MapPin, Phone, Clock, ArrowRight } from '@/lib/icons'

export function Contact() {
    const { t } = useLang()

    return (
        <section id="contact" className="bg-[#f0faf6] py-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#1a6b4a] mb-3">
                        ✦ {t.nav.contact}
                    </p>
                    <h2
                        style={{ fontFamily: "'Playfair Display', serif" }}
                        className="text-3xl md:text-4xl font-bold text-[#0f2d1f]"
                    >
                        {t.contact.title}
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

                    {/* Info cards */}
                    <div className="flex flex-col gap-4">
                        {/* Address */}
                        <div className="bg-white rounded-2xl p-6 border border-[#c8e6d4]/60 shadow-[0_2px_12px_rgba(26,107,74,0.06)] flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#1a6b4a]/10 flex items-center justify-center shrink-0">
                                <MapPin className="w-5 h-5 text-[#1a6b4a]" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#2d5a47]/60 mb-1">Address</p>
                                <p className="text-sm font-medium text-[#0f2d1f]">{t.contact.address}</p>
                            </div>
                        </div>

                        {/* Phone */}
                        <a
                            href={`tel:${t.contact.phone.replace(/\s/g, '')}`}
                            className="bg-white rounded-2xl p-6 border border-[#c8e6d4]/60 shadow-[0_2px_12px_rgba(26,107,74,0.06)] flex items-start gap-4 hover:border-[#1a6b4a]/40 hover:shadow-[0_4px_20px_rgba(26,107,74,0.1)] transition-all duration-200 group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-[#1a6b4a]/10 flex items-center justify-center shrink-0 group-hover:bg-[#1a6b4a]/20 transition-colors">
                                <Phone className="w-5 h-5 text-[#1a6b4a]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#2d5a47]/60 mb-1">Phone</p>
                                <p className="text-sm font-medium text-[#0f2d1f]">{t.contact.phone}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#1a6b4a]/30 group-hover:text-[#1a6b4a] group-hover:translate-x-0.5 transition-all duration-200 self-center" />
                        </a>

                        {/* Hours */}
                        <div className="bg-white rounded-2xl p-6 border border-[#c8e6d4]/60 shadow-[0_2px_12px_rgba(26,107,74,0.06)] flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#1a6b4a]/10 flex items-center justify-center shrink-0">
                                <Clock className="w-5 h-5 text-[#1a6b4a]" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#2d5a47]/60 mb-1">Hours</p>
                                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ade80]" />
                  </span>
                                    <p className="text-sm font-medium text-[#0f2d1f]">{t.contact.hours}</p>
                                </div>
                            </div>
                        </div>

                        {/* Directions CTA */}
                        <a
                            href="https://maps.app.goo.gl/aF7kWSV46eGwWg298"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                inline-flex items-center justify-center gap-2
                bg-[#1a6b4a] text-white
                px-6 py-4 rounded-2xl
                text-sm font-semibold
                shadow-[0_4px_16px_rgba(26,107,74,0.35)]
                hover:bg-[#165c3f]
                hover:shadow-[0_8px_24px_rgba(26,107,74,0.45)]
                hover:-translate-y-0.5
                transition-all duration-200
              "
                        >
                            <MapPin className="w-4 h-4" />
                            {t.contact.directions}
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>

                    {/* Map */}
                    <div className="rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(26,107,74,0.12)] border border-[#c8e6d4]/60 h-[420px]">
                        <iframe
                            title="Tuğra Pharmacy Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d134790.5196998029!2d31.104608932678776!3d36.76778552068675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c37b5d74c19f2f%3A0xfe0fd02bfe00983d!2sTu%C4%9Fra%20Eczanesi!5e0!3m2!1sen!2str!4v1777662405866!5m2!1sen!2str"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}