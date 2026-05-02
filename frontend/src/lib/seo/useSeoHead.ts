import { useMemo } from 'react'
import { useLang } from '@/lib/i18n/LangContext'
import { translations } from '@/lib/i18n/translations'
import { SITE_URL } from '@/lib/config'

type PageKey = 'home' | 'products' | 'about' | 'contact'

const LANG_TO_LOCALE: Record<string, string> = {
    en: 'en_US',
    tr: 'tr_TR',
    ru: 'ru_RU',
    de: 'de_DE',
}

export function useSeoHead(page: PageKey, canonicalPath: string) {
    const { lang } = useLang()
    const m = translations[lang].meta

    const title = m[`${page}Title` as keyof typeof m]
    const desc  = m[`${page}Desc`  as keyof typeof m]

    const meta = useMemo(() => [
        { name: 'description',         content: desc },
        { name: 'keywords',            content: m.keywords },
        { name: 'robots',              content: 'index, follow' },
        { property: 'og:type',         content: 'website' },
        { property: 'og:title',        content: title },
        { property: 'og:description',  content: desc },
        { property: 'og:url',          content: `${SITE_URL}${canonicalPath}` },
        { property: 'og:locale',       content: LANG_TO_LOCALE[lang] },
        { property: 'og:site_name',    content: 'Tuğra Pharmacy Belek' },
        { name: 'twitter:card',        content: 'summary' },
        { name: 'twitter:title',       content: title },
        { name: 'twitter:description', content: desc },
    ], [title, desc, lang, canonicalPath, m.keywords])

    const links = useMemo(() => [
        { rel: 'canonical', href: `${SITE_URL}${canonicalPath}` },
    ], [canonicalPath])

    return { title, meta, links }
}