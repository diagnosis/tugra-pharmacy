import { useEffect } from 'react'
import { useSeoHead } from './useSeoHead'

interface Props {
    page: 'home' | 'products' | 'about' | 'contact'
    canonicalPath: string
}

export function SeoHead({ page, canonicalPath }: Props) {
    const { title, meta, links } = useSeoHead(page, canonicalPath)

    useEffect(() => {
        document.title = title

        meta.forEach(({ name, property, content }: any) => {
            const attr = name ? 'name' : 'property'
            const val  = name ?? property
            let el = document.querySelector(`meta[${attr}="${val}"]`)
            if (!el) {
                el = document.createElement('meta')
                el.setAttribute(attr, val)
                document.head.appendChild(el)
            }
            el.setAttribute('content', content)
        })

        links.forEach(({ rel, href }) => {
            let el = document.querySelector(`link[rel="${rel}"]`)
            if (!el) {
                el = document.createElement('link')
                el.setAttribute('rel', rel)
                document.head.appendChild(el)
            }
            el.setAttribute('href', href)
        })
    }, [title, meta, links])

    return null
}