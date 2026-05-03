// src/lib/i18n/LangContext.tsx
import { createContext, useContext, type ReactNode } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { translations, type Lang, type Translations } from './translations'

interface LangContextType {
    lang: Lang
    t: Translations
    setLang: (l: Lang) => void
}

const LangContext = createContext<LangContextType | null>(null)

function detectBrowserLang(): Lang {
    const stored = localStorage.getItem('tugra_lang') // underscore, matches useLocalStorage key
    if (stored) return JSON.parse(stored) as Lang     // useLocalStorage stores as JSON string

    const browserLang = navigator.language?.slice(0, 2).toLowerCase()
    const supported: Lang[] = ['en', 'tr', 'ru', 'de']
    if (supported.includes(browserLang as Lang)) return browserLang as Lang

    return 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useLocalStorage<Lang>('tugra_lang', detectBrowserLang())

    return (
        <LangContext.Provider value={{ lang, t: translations[lang], setLang }}>
            {children}
        </LangContext.Provider>
    )
}

export function useLang() {
    const ctx = useContext(LangContext)
    if (!ctx) throw new Error('useLang must be used within LangProvider')
    return ctx
}