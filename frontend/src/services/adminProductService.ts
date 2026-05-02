// src/services/adminProductService.ts
import { apiClient } from "@/lib/apiClient.ts"
import type { Product } from "@/services/productService.ts"

export interface ProductMutationReq {
    name: Record<string, string>
    description: Record<string, string>
    category: string
    price: number | null
    in_stock: boolean
    is_featured: boolean
}

export const adminProductService = {
    async create(data: ProductMutationReq, image?: File) {
        const form = new FormData()
        form.append('data', JSON.stringify(data))
        if (image) form.append('image', image)
        return apiClient.postForm<Product>('/api/admin/products', form)
    },

    async update(id: string, data: ProductMutationReq, image?: File) {
        const form = new FormData()
        form.append('data', JSON.stringify(data))
        if (image) form.append('image', image)
        return apiClient.putForm<Product>(`/api/admin/products/${id}`, form)
    },

    async delete(id: string) {
        return apiClient.del(`/api/admin/products/${id}`)
    },

    async toggleFeatured(id: string, is_featured: boolean) {
        return apiClient.patch(`/api/admin/products/${id}/featured`, { is_featured })
    },

    async uploadImage(id: string, image: File) {
        const form = new FormData()
        form.append('image', image)
        return apiClient.postForm(`/api/admin/products/${id}/image`, form)
    },

    async deleteImage(id: string) {
        return apiClient.del(`/api/admin/products/${id}/image`)
    },
}