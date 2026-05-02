import { createRootRouteWithContext, Outlet, useLocation } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { NotFound } from '@/components/app/NotFound.tsx'
import { Header } from '@/components/app/Header.tsx'
import { Footer } from '@/components/app/Footer.tsx'
import { LangProvider } from '@/lib/i18n/LangContext.tsx'
import {CurrencyProvider} from "@/lib/currency/CurrencyContext.tsx";
import {PharmacyJsonLd} from "@/lib/seo/PharmacyJsonLd.tsx";

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient
}>()({
    component: RootLayout,
    notFoundComponent: NotFound,
})

function RootLayout() {
    const { pathname } = useLocation()
    const isAdmin = pathname.startsWith('/admin')

    return (
        <LangProvider>
            <CurrencyProvider>  {/* 👈 add */}
                <div className="flex flex-col min-h-screen">
                    {!isAdmin && <Header />}
                    <main className="flex-1">
                        <PharmacyJsonLd/>
                        <Outlet />
                    </main>
                    {!isAdmin && <Footer />}
                    <TanStackRouterDevtools />
                </div>
            </CurrencyProvider>
        </LangProvider>
    )
}