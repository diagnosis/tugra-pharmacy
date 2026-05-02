// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '@/components/app/Hero'
import { FeaturedProducts } from '@/components/app/FeaturedProducts'
import {SeoHead} from "@/lib/seo/SEOHead.tsx";

export const Route = createFileRoute('/')({
    component: HomePage,
})

function HomePage() {
    return (
        <>
            <SeoHead page="home" canonicalPath="/"/>
            <Hero />
            <FeaturedProducts />
        </>
    )
}

