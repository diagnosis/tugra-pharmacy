// src/routes/admin/_authenticated/products/new.tsx
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useCreateProduct } from '@/hooks/useAdminProducts'
import { ProductForm } from '@/components/admin/ProductForm'
import { ArrowLeft } from 'lucide-react'
import type { ProductMutationReq } from '@/services/adminProductService'

export const Route = createFileRoute('/admin/_authenticated/products/new')({
  component: AdminNewProduct,
})

function AdminNewProduct() {
  const navigate = useNavigate()
  const createProduct = useCreateProduct()

  const handleSubmit = async (data: ProductMutationReq, image?: File) => {
    const res = await createProduct.mutateAsync({ data, image })
    if (!res.ok) return
    navigate({ to: '/admin' })
  }

  return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
              to="/admin"
              className="flex items-center gap-1.5 text-sm text-[#2d5a47]/60 hover:text-[#1a6b4a] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-[#0f2d1f]">
            Add New Product
          </h1>
        </div>

        <ProductForm
            onSubmit={handleSubmit}
            loading={createProduct.isPending}
            error={createProduct.isError ? createProduct.error?.message : undefined}
        />
      </div>
  )
}