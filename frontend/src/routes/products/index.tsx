// src/routes/products/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { Products } from '@/components/app/Products'
import {SeoHead} from "@/lib/seo/SEOHead.tsx";

export const Route = createFileRoute('/products/')({
    validateSearch: (search) => ({
        category: (search.category as string) ?? 'all',
    }),
    component: ProductsPage,
})

function ProductsPage() {

    return <>
        <SeoHead page="products" canonicalPath="/products" />
        <Products />
    </>
}