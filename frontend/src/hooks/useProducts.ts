import { useQuery } from "@tanstack/react-query"
import { productService, type ProductFilters } from "@/services/productService.ts"

export const productKeys = {
    all: ['products'] as const,
    list: (filters?: ProductFilters) => ['products', 'list', filters] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
}

export function useProducts(filters?: ProductFilters) {
    return useQuery({
        queryKey: productKeys.list(filters),
        queryFn: async () => {
            const res = await productService.list(filters)
            if (!res.ok) throw new Error(res.error.message)
            return res.data
        },
        staleTime: 60 * 1000,
    })
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: async () => {
            const res = await productService.getById(id)
            if (!res.ok) throw new Error(res.error.message)
            return res.data
        },
        staleTime: 60 * 1000,
        enabled: !!id,
    })
}