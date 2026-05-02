// src/routes/admin/_authenticated/index.tsx
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import { useAdminProducts, useDeleteProduct, useToggleFeatured } from '@/hooks/useAdminProducts'
import { categoryIcons } from '@/lib/icons'
import { Plus, Pencil, Trash2, Star, StarOff, CheckCircle, XCircle, Search, X } from 'lucide-react'

type CategoryKey = keyof typeof categoryIcons

const CATEGORY_KEYS = [
  'medications', 'vitamins', 'suncare', 'skincare', 'haircare',
  'baby', 'firstaid', 'devices', 'dental', 'eyecare', 'natural', 'other',
] as const

const PAGE_SIZE = 50

export const Route = createFileRoute('/admin/_authenticated/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const navigate = useNavigate()
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounceValue(search, 350)
  const [category, setCategory] = useState<string | undefined>(undefined)
  const [inStock, setInStock] = useState<boolean | undefined>(undefined)
  const [isFeatured, setIsFeatured] = useState<boolean | undefined>(undefined)

  const handleSearchChange = (val: string) => { setSearch(val); setPage(0) }
  const handleCategoryChange = (val: string) => { setCategory(val || undefined); setPage(0) }
  const handleInStockChange = (val: boolean | undefined) => { setInStock(val); setPage(0) }
  const handleIsFeaturedChange = (val: boolean | undefined) => { setIsFeatured(val); setPage(0) }
  const clearFilters = () => {
    setSearch('')
    setCategory(undefined)
    setInStock(undefined)
    setIsFeatured(undefined)
    setPage(0)
  }

  const { data, isLoading } = useAdminProducts({
    search: debouncedSearch || undefined,
    category,
    in_stock: inStock,
    is_featured: isFeatured,
  }, page)

  const deleteMutation = useDeleteProduct()
  const toggleFeatured = useToggleFeatured()

  const products = data?.products ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const hasPrev = page > 0
  const hasNext = page < totalPages - 1
  const hasFilters = search || category || inStock !== undefined || isFeatured !== undefined

  const handleDeleteConfirm = async () => {
    if (!confirmId) return
    await deleteMutation.mutateAsync(confirmId)
    setConfirmId(null)
  }
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top:0, behavior: 'smooth' })
  }

  return (
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-[#0f2d1f]">
              Products
            </h1>
            <p className="text-sm text-[#2d5a47]/60 mt-0.5">{total} total products</p>
          </div>
          <Link
              to="/admin/products/new"
              className="inline-flex items-center gap-2 bg-[#1a6b4a] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-[0_4px_12px_rgba(26,107,74,0.3)] hover:bg-[#165c3f] transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 mb-6">

          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2d5a47]/40" />
            <input
                type="text"
                value={search}
                onChange={e => handleSearchChange(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-[#c8e6d4] bg-white text-sm text-[#0f2d1f] placeholder:text-[#2d5a47]/30 focus:outline-none focus:border-[#1a6b4a] transition-all"
            />
            {search && (
                <button onClick={() => handleSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2d5a47]/40 hover:text-[#1a6b4a]">
                  <X className="w-3.5 h-3.5" />
                </button>
            )}
          </div>
          {/* Filter chips */}
          <div className="flex flex-wrap gap-2">

            {/* Category */}
            <select
                value={category ?? ''}
                onChange={e => handleCategoryChange(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-[#c8e6d4] bg-white text-xs font-semibold text-[#2d5a47] focus:outline-none focus:border-[#1a6b4a] transition-all"
            >
              <option value="">All Categories</option>
              {CATEGORY_KEYS.map(c => (
                  <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Stock */}
            {([
              { label: 'All Stock',     value: undefined },
              { label: 'In Stock',      value: true      },
              { label: 'Out of Stock',  value: false     },
            ] as const).map(opt => (
                <button
                    key={String(opt.value)}
                    onClick={() => handleInStockChange(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        inStock === opt.value
                            ? 'bg-[#1a6b4a] text-white border-[#1a6b4a]'
                            : 'bg-white text-[#2d5a47] border-[#c8e6d4] hover:bg-[#f0faf6]'
                    }`}
                >
                  {opt.label}
                </button>
            ))}

            {/* Featured */}
            {([
              { label: 'All',          value: undefined },
              { label: '⭐ Featured',  value: true      },
              { label: 'Not Featured', value: false     },
            ] as const).map(opt => (
                <button
                    key={String(opt.value)}
                    onClick={() => handleIsFeaturedChange(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        isFeatured === opt.value
                            ? 'bg-[#1a6b4a] text-white border-[#1a6b4a]'
                            : 'bg-white text-[#2d5a47] border-[#c8e6d4] hover:bg-[#f0faf6]'
                    }`}
                >
                  {opt.label}
                </button>
            ))}

            {/* Clear */}
            {hasFilters && (
                <button
                    onClick={clearFilters}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#fee2e2] text-[#dc2626] bg-white hover:bg-[#fee2e2] transition-all"
                >
                  Clear filters
                </button>
            )}
          </div>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 mb-4">
              <p className="text-sm text-[#2d5a47]/60">
                Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total} products
              </p>
              <div className="flex items-center gap-2">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={!hasPrev}
                    className="px-4 py-2 rounded-xl text-sm font-semibold border border-[#c8e6d4] text-[#1a6b4a] hover:bg-[#f0faf6] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  ← Prev
                </button>
                <span className="text-sm text-[#2d5a47]/60 px-2">
              Page <strong className="text-[#0f2d1f]">{page + 1}</strong> of <strong className="text-[#0f2d1f]">{totalPages}</strong>
            </span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={!hasNext}
                    className="px-4 py-2 rounded-xl text-sm font-semibold border border-[#c8e6d4] text-[#1a6b4a] hover:bg-[#f0faf6] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </div>
            </div>
        )}
        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#e8f5ee] shadow-[0_2px_12px_rgba(26,107,74,0.06)] overflow-hidden">
          {isLoading ? (
              <div className="p-12 text-center text-[#2d5a47]/40 text-sm">Loading products…</div>
          ) : products.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-[#2d5a47]/40 text-sm mb-3">
                  {hasFilters ? 'No products match your filters.' : 'No products yet'}
                </p>
                {!hasFilters && (
                    <Link to="/admin/products/new" className="text-sm font-semibold text-[#1a6b4a] hover:underline">
                      Add your first product →
                    </Link>
                )}
              </div>
          ) : (
              <table className="w-full">
                <thead>
                <tr className="border-b border-[#e8f5ee]">
                  <th className="text-left text-xs font-semibold text-[#2d5a47]/50 uppercase tracking-wide px-6 py-4">Product</th>
                  <th className="text-left text-xs font-semibold text-[#2d5a47]/50 uppercase tracking-wide px-4 py-4 hidden md:table-cell">Category</th>
                  <th className="text-left text-xs font-semibold text-[#2d5a47]/50 uppercase tracking-wide px-4 py-4 hidden sm:table-cell">Price</th>
                  <th className="text-left text-xs font-semibold text-[#2d5a47]/50 uppercase tracking-wide px-4 py-4">Stock</th>
                  <th className="text-left text-xs font-semibold text-[#2d5a47]/50 uppercase tracking-wide px-4 py-4 hidden lg:table-cell">Featured</th>
                  <th className="px-4 py-4 w-24" />
                </tr>
                </thead>
                <tbody className="divide-y divide-[#f0faf6]">
                {products.map(p => {
                  const cat = categoryIcons[p.category as CategoryKey]
                  return (
                      <tr key={p.id} className="hover:bg-[#f9fffe] transition-colors">

                        {/* Name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: cat?.bg ?? '#f0faf6' }}
                            >
                              {p.image_url
                                  ? <img src={p.image_url} className="w-10 h-10 rounded-xl object-cover" alt={p.name['en']} />
                                  : cat && <cat.icon className="w-5 h-5" style={{ color: cat.color }} />
                              }
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#0f2d1f] line-clamp-1">{p.name['en']}</p>
                              <p className="text-xs text-[#2d5a47]/50 line-clamp-1">{p.name['tr']}</p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-4 hidden md:table-cell">
                          {cat && (
                              <span
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg"
                                  style={{ backgroundColor: cat.bg, color: cat.color }}
                              >
                          <cat.icon className="w-3 h-3" />
                                {p.category}
                        </span>
                          )}
                        </td>

                        {/* Price */}
                        <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="text-sm font-semibold text-[#0f2d1f]">
                        {p.price != null ? `₺${p.price}` : '—'}
                      </span>
                        </td>

                        {/* Stock */}
                        <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                          p.in_stock ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#fee2e2] text-[#dc2626]'
                      }`}>
                        {p.in_stock
                            ? <CheckCircle className="w-3 h-3" />
                            : <XCircle className="w-3 h-3" />
                        }
                        {p.in_stock ? 'In Stock' : 'Out'}
                      </span>
                        </td>

                        {/* Featured toggle */}
                        <td className="px-4 py-4 hidden lg:table-cell">
                          <button
                              onClick={() => toggleFeatured.mutate({ id: p.id, is_featured: !p.is_featured })}
                              disabled={toggleFeatured.isPending}
                              className={`p-1.5 rounded-lg transition-colors ${
                                  p.is_featured
                                      ? 'text-[#f59e0b] bg-[#fffbeb] hover:bg-[#fef3c7]'
                                      : 'text-[#2d5a47]/30 hover:text-[#f59e0b] hover:bg-[#fffbeb]'
                              }`}
                              title={p.is_featured ? 'Remove from featured' : 'Add to featured'}
                          >
                            {p.is_featured
                                ? <Star className="w-4 h-4 fill-current" />
                                : <StarOff className="w-4 h-4" />
                            }
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                                onClick={() => navigate({ to: '/admin/products/$productId', params: { productId: p.id } })}
                                className="p-1.5 rounded-lg text-[#2d5a47]/50 hover:text-[#1a6b4a] hover:bg-[#f0faf6] transition-colors"
                                title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setConfirmId(p.id)}
                                className="p-1.5 rounded-lg text-[#2d5a47]/50 hover:text-[#dc2626] hover:bg-[#fee2e2] transition-colors"
                                title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                  )
                })}
                </tbody>
              </table>
          )}
        </div>



        {/* Delete confirm dialog */}
        {confirmId && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
              <div className="bg-white rounded-2xl border border-[#e8f5ee] shadow-xl p-6 w-full max-w-sm">
                <h3 className="text-base font-semibold text-[#0f2d1f] mb-2">Delete product?</h3>
                <p className="text-sm text-[#2d5a47]/60 mb-6">
                  "{products.find(p => p.id === confirmId)?.name['en']}" will be permanently deleted.
                </p>
                <div className="flex gap-3">
                  <button
                      onClick={() => setConfirmId(null)}
                      className="flex-1 px-4 py-2.5 text-sm text-[#2d5a47] border border-[#c8e6d4] rounded-xl hover:bg-[#f0faf6] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={handleDeleteConfirm}
                      disabled={deleteMutation.isPending}
                      className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-[#dc2626] rounded-xl hover:bg-[#b91c1c] transition-colors disabled:opacity-50"
                  >
                    {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  )
}