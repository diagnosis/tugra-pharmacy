// src/routes/__root.tsx
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'



import {TanStackRouterDevtools} from "@tanstack/react-router-devtools";
import {NotFound} from "@/components/app/NotFound.tsx";
import {Header} from "@/components/app/Header.tsx";
import {Footer} from "@/components/app/Footer.tsx";
import {useState} from "react";
import {LangProvider} from "@/lib/i18n/LangContext.tsx";

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient
}>()({
    component: RootLayout,
    notFoundComponent: NotFound,
})


function RootLayout() {
    const [lang, setLang] = useState<string>(() => {
        // persist language choice
        const saved = localStorage.getItem('tugra_lang')
        if (saved) return saved
        const browser = navigator.language?.slice(0, 2)
        if (['tr', 'ru', 'de'].includes(browser)) return browser
        return 'en'
    })

    const handleLangChange = (newLang: string) => {
        setLang(newLang)
        localStorage.setItem('tugra_lang', newLang)
    }
    return (
        <LangProvider>
        <div className="flex flex-col min-h-screen">
            <Header lang={lang} onLangChange={handleLangChange} />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer lang={lang} />
            <TanStackRouterDevtools />
        </div>
        </LangProvider>
    )
}