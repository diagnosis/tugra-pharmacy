// src/components/app/NotFound.tsx
import { ArrowLeft, Pill } from '@/lib/icons.ts'
import { useLang } from '@/lib/i18n/LangContext.tsx'

const NOT_FOUND_TEXT = {
    en: { title: 'Page Not Found', desc: "The page you're looking for doesn't exist.", back: 'Back to Home' },
    tr: { title: 'Sayfa Bulunamadı', desc: 'Aradığınız sayfa mevcut değil.', back: 'Ana Sayfaya Dön' },
    ru: { title: 'Страница не найдена', desc: 'Запрашиваемая страница не существует.', back: 'На главную' },
    de: { title: 'Seite nicht gefunden', desc: 'Die gesuchte Seite existiert nicht.', back: 'Zur Startseite' },
}

export function NotFound() {
    let lang = 'en'
    try {
        const ctx = useLang()
        lang = ctx.lang
    } catch {}

    const t = NOT_FOUND_TEXT[lang as keyof typeof NOT_FOUND_TEXT] ?? NOT_FOUND_TEXT.en

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 bg-[#f0faf6]">
            <div className="text-center max-w-md">

                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl bg-[#1a6b4a]/10 flex items-center justify-center mx-auto mb-6">
                    <Pill className="w-9 h-9 text-[#1a6b4a]" />
                </div>

                {/* 404 */}
                <p
                    style={{ fontFamily: "'Playfair Display', serif" }}
                    className="text-8xl font-bold text-[#1a6b4a]/20 leading-none mb-4"
                >
                    404
                </p>

                <h1
                    style={{ fontFamily: "'Playfair Display', serif" }}
                    className="text-2xl font-bold text-[#0f2d1f] mb-3"
                >
                    {t.title}
                </h1>

                <p className="text-[#2d5a47]/70 text-sm mb-8">
                    {t.desc}
                </p>

                <a
                    href="/"
                    className="
            inline-flex items-center gap-2
            bg-[#1a6b4a] text-white
            px-6 py-3 rounded-xl
            text-sm font-semibold
            shadow-[0_4px_12px_rgba(26,107,74,0.3)]
            hover:bg-[#165c3f]
            hover:shadow-[0_4px_20px_rgba(26,107,74,0.45)]
            transition-all duration-200
          "
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t.back}
                </a>
            </div>
        </div>
    )
}