'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContextType, IUser } from '@/app/types';
import authService from '@/app/services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<IUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Cargar sesión al iniciar
    useEffect(() => {
        const initAuth = async () => {
            try {
                const savedToken = localStorage.getItem('token');
                const savedUser = localStorage.getItem('user');

                if (savedToken && savedUser) {
                    setToken(savedToken);
                    setUser(JSON.parse(savedUser));

                    // Verificar token con el servidor
                    try {
                        const currentUser = await authService.getMe();
                        setUser(currentUser);
                        localStorage.setItem('user', JSON.stringify(currentUser));
                    } catch (error) {
                        // Token inválido, limpiar
                        logout();
                    }
                }
            } catch (error) {
                console.error('Error inicializando auth:', error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // Login
    const login = useCallback(async (email: string, password: string) => {
        setLoading(true);
        try {
            const response = await authService.login({ email, password });

            setUser(response.user);
            setToken(response.token);

            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            // Redirigir según rol
            if (response.user.role === 'agent') {
                router.push('/agent');
            } else {
                router.push('/client');
            }
        } finally {
            setLoading(false);
        }
    }, [router]);

    // Logout
    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    }, [router]);

    const value: AuthContextType = {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!user && !!token,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }

    return context;
}

export default AuthContext;