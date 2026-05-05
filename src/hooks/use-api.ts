import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Example: Fetch products
export function useProducts() {
    return useQuery({
        queryKey: ['products'],
        queryFn: () => api.getProducts(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

// Example: Fetch single product
export function useProduct(id: string) {
    return useQuery({
        queryKey: ['products', id],
        queryFn: () => api.getProduct(id),
        enabled: !!id, // Only fetch if id exists
    });
}

// Example: Create product
export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => {
            const token = localStorage.getItem('auth_token');
            if (!token) throw new Error('Not authenticated');
            return api.createProduct(data, token);
        },
        onSuccess: () => {
            // Refresh products list after creating new product
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
}

// Example: Update product
export function useUpdateProduct(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => {
            const token = localStorage.getItem('auth_token');
            if (!token) throw new Error('Not authenticated');
            return api.updateProduct(id, data, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['products', id] });
        },
    });
}

// Example: Fetch orders
export function useOrders() {
    return useQuery({
        queryKey: ['orders'],
        queryFn: () => api.getOrders(),
    });
}

// Example: Fetch customers
export function useCustomers() {
    return useQuery({
        queryKey: ['customers'],
        queryFn: () => api.getCustomers(),
    });
}

// Example: Sync Shopify data
export function useSyncShopify() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => {
            const token = localStorage.getItem('auth_token');
            if (!token) throw new Error('Not authenticated');
            return api.syncShopifyData(token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['customers'] });
        },
    });
}
