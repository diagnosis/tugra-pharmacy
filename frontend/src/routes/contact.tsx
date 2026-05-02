// src/routes/contact.tsx
import { createFileRoute } from '@tanstack/react-router'
import { Contact } from '@/components/app/Contact'
import {SeoHead} from "@/lib/seo/SEOHead.tsx";

export const Route = createFileRoute('/contact')({
    component: ContactPage,
})

function ContactPage() {
    return <>
        <SeoHead page="contact" canonicalPath="/contact" />
        <Contact />
    </>
}