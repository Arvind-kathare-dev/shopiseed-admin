const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

type RequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    headers?: Record<string, string>;
    token?: string;
};

export async function apiCall<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const { method = 'GET', body, headers = {}, token } = options;

    const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
    };

    // Add authorization token if provided
    if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method,
            headers: requestHeaders,
            body: body ? JSON.stringify(body) : undefined,
            credentials: 'include', // Send cookies if needed
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(error.message || `API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API Error [${method} ${endpoint}]:`, error);
        throw error;
    }
}

// API endpoint helpers
export const api = {
    // Auth endpoints
    login: (email: string, password: string) =>
        apiCall('/api/auth/login', {
            method: 'POST',
            body: { email, password },
        }),
    signup: (email: string, password: string, name?: string) =>
        apiCall('/api/auth/signup', {
            method: 'POST',
            body: { email, password, name },
        }),
    logout: (token: string) =>
        apiCall('/api/auth/logout', {
            method: 'POST',
            token,
        }),
    forgotPassword: (email: string) =>
        apiCall('/api/auth/forgot-password', {
            method: 'POST',
            body: { email },
        }),
    verifyOtp: (email: string, otp: string) =>
        apiCall('/api/auth/verify-otp', {
            method: 'POST',
            body: { email, otp },
        }),
    resetPassword: (data: { email: string; otp: string; password: string; confirmPassword: string }) =>
        apiCall('/api/auth/reset-password', {
            method: 'POST',
            body: data,
        }),
    getCurrentUser: (token: string) =>
        apiCall('/api/auth/me', { token }),

    // Product endpoints
    getProducts: () => apiCall('/api/products'),
    getProduct: (id: string) => apiCall(`/api/products/${id}`),
    createProduct: (data: any, token: string) =>
        apiCall('/api/products', { method: 'POST', body: data, token }),
    updateProduct: (id: string, data: any, token: string) =>
        apiCall(`/api/products/${id}`, { method: 'PUT', body: data, token }),
    deleteProduct: (id: string, token: string) =>
        apiCall(`/api/products/${id}`, { method: 'DELETE', token }),

    // Order endpoints
    getOrders: () => apiCall('/api/orders'),
    getOrder: (id: string) => apiCall(`/api/orders/${id}`),

    // Customer endpoints
    getCustomers: () => apiCall('/api/customers'),
    getCustomer: (id: string) => apiCall(`/api/customers/${id}`),

    // User endpoints
    getUsers: (token: string) => apiCall('/api/users', { token }),
    createUser: (data: any, token: string) => apiCall('/api/users', { method: 'POST', body: data, token }),
    updateUser: (id: string, data: any, token: string) => apiCall(`/api/users/${id}`, { method: 'PUT', body: data, token }),
    deleteUser: (id: string, token: string) => apiCall(`/api/users/${id}`, { method: 'DELETE', token }),

    // Onboarding/Lead endpoints
    getOnboardingLeads: (token: string) => 
        apiCall('/api/contact', { token }),

    // Shopify-specific endpoints
    syncShopifyData: (token: string) =>
        apiCall('/api/shopify/sync', { method: 'POST', token }),
    getShopifyStatus: (token: string) =>
        apiCall('/api/shopify/status', { token }),
};
