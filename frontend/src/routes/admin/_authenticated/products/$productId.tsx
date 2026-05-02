// src/routes/admin/_authenticated/products/$productId.tsx
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useUpdateProduct } from '@/hooks/useAdminProducts'
import { productService } from '@/services/productService'
import { ProductForm } from '@/components/admin/ProductForm'
import { ArrowLeft } from 'lucide-react'
import type { ProductMutationReq } from '@/services/adminProductService'

export const Route = createFileRoute('/admin/_authenticated/products/$productId')({
  component: AdminEditProduct,
})

function AdminEditProduct() {
  const { productId } = Route.useParams() as { productId: string }
  const navigate = useNavigate()
  const updateProduct = useUpdateProduct(productId)

  const { data: product, isLoading } = useQuery({
    queryKey: ['admin', 'products', productId],
    queryFn: async () => {
      const res = await productService.getById(productId)
      if (!res.ok) throw new Error(res.error.message)
      return res.data
    },
  })

  const handleSubmit = async (data: ProductMutationReq, image?: File) => {
    const res = await updateProduct.mutateAsync({ data, image })
    if (!res.ok) return
    navigate({ to: '/admin' })
  }

  if (isLoading) {
    return (
        <div className="max-w-7xl mx-auto px-6 py-8 animate-pulse flex flex-col gap-4">
          <div className="h-8 w-48 bg-[#e8f5ee] rounded" />
          <div className="h-64 bg-[#e8f5ee] rounded-2xl" />
          <div className="h-48 bg-[#e8f5ee] rounded-2xl" />
        </div>
    )
  }

  if (!product) {
    return (
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-[#2d5a47]/60 mb-4">Product not found.</p>
          <Link to="/admin" className="text-sm font-semibold text-[#1a6b4a] hover:underline">
            ← Back to products
          </Link>
        </div>
    )
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
            Edit Product
          </h1>
        </div>

        <ProductForm
            initial={product}
            onSubmit={handleSubmit}
            loading={updateProduct.isPending}
            error={updateProduct.isError ? updateProduct.error?.message : undefined}
        />
      </div>
  )
}