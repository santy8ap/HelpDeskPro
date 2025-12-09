import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from '@/app/types';

// Crear instancia de Axios
const api: AxiosInstance = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiResponse>) => {
        const message = error.response?.data?.error || 'Error de conexión';

        // Si es 401, limpiar sesión
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Opcional: redirigir a login
                // window.location.href = '/login';
            }
        }

        return Promise.reject(new Error(message));
    }
);

export default api;