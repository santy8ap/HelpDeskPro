import api from './api';
import { LoginFormData, RegisterFormData, AuthResponse, ApiResponse, IUser } from '@/app/types';

export const authService = {
    // Login
    async login(data: LoginFormData): Promise<AuthResponse> {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);

        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.error || 'Error en login');
        }

        return response.data.data;
    },

    // Registro
    async register(data: RegisterFormData): Promise<AuthResponse> {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);

        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.error || 'Error en registro');
        }

        return response.data.data;
    },

    // Obtener usuario actual
    async getMe(): Promise<IUser> {
        const response = await api.get<ApiResponse<IUser>>('/auth/me');

        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.error || 'Error obteniendo usuario');
        }

        return response.data.data;
    },
    // Cerrar sesión
    async logout(): Promise<void> {
        await api.post('/auth/logout');
    },
};

export default authService;