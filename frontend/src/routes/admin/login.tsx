// src/routes/admin/login.tsx
import {createFileRoute, isRedirect, Link, redirect, useNavigate} from '@tanstack/react-router'
import { useState } from 'react'
import {meQueryOptions, useLogin} from '@/hooks/useAuth'
import { Cross } from 'lucide-react'

export const Route = createFileRoute('/admin/login')({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(meQueryOptions())
      // if we get here, user is authenticated — redirect to dashboard
      throw redirect({ to: '/admin' })
    } catch (err) {
      if (isRedirect(err)) throw err  // let the redirect through
      // not authenticated — stay on login page
    }
  },
  component: AdminLoginPage,
})

function AdminLoginPage() {
  const navigate = useNavigate()
  const login = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const res = await login.mutateAsync({ email, password })
    if (!res.ok) {
      setError(res.error.message)
      return
    }
    navigate({ to: '/admin' })
  }

  return (
      <div className="min-h-screen bg-[#f0faf6] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">

          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#1a6b4a] flex items-center justify-center shadow-[0_8px_24px_rgba(26,107,74,0.3)]">
              <Cross className="w-7 h-7 text-white" />
            </div>
            <div className="text-center">
              <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-[#0f2d1f]">
                Tuğra Admin
              </h1>
              <p className="text-sm text-[#2d5a47]/60 mt-1">Sign in to manage products</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#c8e6d4]/60 shadow-[0_8px_32px_rgba(26,107,74,0.08)] p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#2d5a47] uppercase tracking-wide">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@tugra.com"
                    required
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl border border-[#c8e6d4] bg-[#f0faf6] text-sm text-[#0f2d1f] placeholder:text-[#2d5a47]/30 focus:outline-none focus:border-[#1a6b4a] focus:bg-white transition-all duration-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#2d5a47] uppercase tracking-wide">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#c8e6d4] bg-[#f0faf6] text-sm text-[#0f2d1f] placeholder:text-[#2d5a47]/30 focus:outline-none focus:border-[#1a6b4a] focus:bg-white transition-all duration-200"
                />
              </div>

              {error && (
                  <div className="bg-[#fee2e2] text-[#dc2626] text-sm px-4 py-3 rounded-xl">
                    {error}
                  </div>
              )}

              <button
                  type="submit"
                  disabled={login.isPending}
                  className="w-full bg-[#1a6b4a] text-white py-3 rounded-xl mt-2 text-sm font-semibold shadow-[0_4px_12px_rgba(26,107,74,0.3)] hover:bg-[#165c3f] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {login.isPending ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-[#2d5a47]/40 mt-6">Tuğra Pharmacy Admin Panel</p>
          <div className="text-center mt-3">
            <Link to="/" className="text-xs text-[#2d5a47]/40 hover:text-[#1a6b4a] transition-colors">
              ← Back to website
            </Link>
          </div>
        </div>
      </div>
  )
}