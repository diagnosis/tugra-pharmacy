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
    const browser = navigator.language?.slice(0, 2) as Lang
    return translations[browser] ? browser : 'en'
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