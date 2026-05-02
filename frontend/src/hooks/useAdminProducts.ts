import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {type ProductFilters, productService} from "@/services/productService.ts";
import {adminProductService, type ProductMutationReq} from "@/services/adminProductService.ts";


export const adminProductKeys = {
    all: ['admin', 'products'] as const,
    list: (filters?: ProductFilters & { page?: number }) => ['admin', 'products', 'list', filters] as const,
    detail: (id: string) => ['admin', 'products', id] as const,
}

export function useAdminProducts(filters?: ProductFilters, page = 0) {
    const PAGE_SIZE = 50
    return useQuery({
        queryKey: adminProductKeys.list({ ...filters, page }),
        queryFn: async () => {
            const res = await productService.list({
                limit: PAGE_SIZE,
                offset: page * PAGE_SIZE,
                ...filters,
            })
            if (!res.ok) throw new Error(res.error.message)
            return res.data
        },
        staleTime: 60 * 1000,
        placeholderData: (prev) => prev, // keeps previous page data while loading next
    })
}

export function useCreateProduct() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ data, image }: { data: ProductMutationReq; image?: File }) =>
            adminProductService.create(data, image),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: adminProductKeys.all })
            qc.invalidateQueries({ queryKey: ['products'] })
        },
    })
}

export function useUpdateProduct(id: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ data, image }: { data: ProductMutationReq; image?: File }) =>
            adminProductService.update(id, data, image),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: adminProductKeys.all })
            qc.invalidateQueries({ queryKey: ['products'] })
        },
    })
}

export function useDeleteProduct() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => adminProductService.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: adminProductKeys.all })
            qc.invalidateQueries({ queryKey: ['products'] })
        },
    })
}

export function useToggleFeatured() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, is_featured }: { id: string; is_featured: boolean }) =>
            adminProductService.toggleFeatured(id, is_featured),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: adminProductKeys.all })
            qc.invalidateQueries({ queryKey: ['products'] })
        },
    })
}

export function useUploadImage(id: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (image: File) => adminProductService.uploadImage(id, image),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: adminProductKeys.detail(id) })
            qc.invalidateQueries({ queryKey: adminProductKeys.all })
        },
    })
}

export function useDeleteImage(id: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: () => adminProductService.deleteImage(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: adminProductKeys.detail(id) })
            qc.invalidateQueries({ queryKey: adminProductKeys.all })
        },
    })
}