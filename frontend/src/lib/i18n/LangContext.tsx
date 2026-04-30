// src/lib/i18n/LangContext.tsx
import { createContext, useContext, useState } from 'react'
import { translations, type Lang, type Translations } from './translations'

interface LangContextType {
    lang: Lang
    t: Translations
    setLang: (l: Lang) => void
}

const LangContext = createContext<LangContextType | null>(null)

export function LangProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Lang>(() => {
        const saved = localStorage.getItem('tugra_lang') as Lang
        if (saved && translations[saved]) return saved
        const browser = navigator.language?.slice(0, 2) as Lang
        if (translations[browser]) return browser
        return 'en'
    })

    const setLang = (l: Lang) => {
        setLangState(l)
        localStorage.setItem('tugra_lang', l)
    }

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