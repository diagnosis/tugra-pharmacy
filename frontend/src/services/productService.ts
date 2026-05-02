// src/services/productService.ts

import { apiClient } from '@/lib/apiClient'

export interface Product {
    id: string
    name: Record<string, string>
    description: Record<string, string>
    category: string
    price: number | null
    in_stock: boolean
    is_featured: boolean
    image_url: string
    created_at: string
    updated_at: string
}

export interface ProductFilters {
    category?: string
    in_stock?: boolean
    search?: string
    is_featured?: boolean  // 👈 lowercase, consistent
    limit?: number
    offset?: number
}

export interface ProductListResponse {
    products: Product[]
    total: number
    limit: number
    offset: number
}


export const productService = {
    async list(filters?: ProductFilters) {
        const params = new URLSearchParams()
        if (filters?.category) params.set('category', filters.category)
        if (filters?.search) params.set('search', filters.search)
        if (filters?.in_stock !== undefined) params.set('in_stock', String(filters.in_stock))
        if (filters?.is_featured !== undefined) params.set('is_featured', String(filters.is_featured))
        if (filters?.limit) params.set('limit', String(filters.limit))
        if (filters?.offset !== undefined) params.set('offset', String(filters.offset))
        const query = params.toString()
        return apiClient.get<ProductListResponse>(`/api/products${query ? `?${query}` : ''}`)
    },

    async getById(id: string) {
        return apiClient.get<Product>(`/api/products/${id}`)
    },
}