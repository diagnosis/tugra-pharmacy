import { createFileRoute, redirect, Outlet, Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { meQueryOptions, useLogout } from '@/hooks/useAuth.ts'
import { Cross, Package, LogOut } from 'lucide-react'

export const Route = createFileRoute('/admin/_authenticated')({
    beforeLoad: async ({ context }) => {
        try {
            await context.queryClient.ensureQueryData(meQueryOptions())
        } catch {
            throw redirect({ to: '/admin/login' })
        }
    },
    component: AdminLayout,
})

function AdminLayout() {
    const { data: admin } = useQuery(meQueryOptions())
    const logout = useLogout()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout.mutate(undefined, {
            onSuccess: () => navigate({ to: '/admin/login' }),
        })
    }

    return (
        <div className="min-h-screen bg-[#f0faf6] flex flex-col">
            <header className="bg-[#0f2d1f] text-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">

                    <Link to="/admin" className="flex items-center gap-2.5 shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-[#1a6b4a] flex items-center justify-center">
                            <Cross className="w-4 h-4 text-white" />
                        </div>
                        <span style={{ fontFamily: "'Playfair Display', serif" }} className="font-bold text-[#a7d4bc]">
    Tuğra Admin
  </span>
                    </Link>
                    <Link
                        to="/"
                        className="ml-3 text-xs text-white/30 hover:text-white/60 transition-colors hidden sm:block"
                    >
                        ← Website
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            to="/admin"
                            className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
                        >
                            <Package className="w-4 h-4" />
                            Products
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <span className="text-xs text-white/40 hidden sm:block">{admin?.email}</span>
                        <button
                            onClick={handleLogout}
                            disabled={logout.isPending}
                            className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors disabled:opacity-50"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    )
}