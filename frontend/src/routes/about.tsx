// src/routes/about.tsx
import { createFileRoute } from '@tanstack/react-router'
import { About } from '@/components/app/About'
import {SeoHead} from "@/lib/seo/SEOHead.tsx";

export const Route = createFileRoute('/about')({
    component: AboutPage,
})

function AboutPage() {
    return <>
        <SeoHead page="about" canonicalPath="/about" />
        <About />
    </>
}
