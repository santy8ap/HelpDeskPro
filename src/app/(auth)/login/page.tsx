'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import Alert from '@/app/components/ui/Alert';
import authService from '@/app/services/authService';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'client' as 'client' | 'agent',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { login, isAuthenticated, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated && user) {
            router.push(user.role === 'agent' ? '/agent' : '/client');
        }
    }, [isAuthenticated, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await authService.register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                });
                setSuccess('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
                setIsLogin(true);
                setFormData({ ...formData, name: '', password: '' });
            }
        } catch (err: any) {
            setError(err.message || 'Error en la operación');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <span className="text-5xl">🎫</span>
                    <h1 className="text-3xl font-bold text-gray-900 mt-2">HelpDeskPro</h1>
                    <p className="text-gray-500 mt-2">Sistema de Gestión de Tickets</p>
                </div>

                <Card>
                    <Card.Header>
                        <div className="flex border-b">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-2 text-center font-medium transition-colors ${isLogin
                                    ? 'text-primary-600 border-b-2 border-primary-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-2 text-center font-medium transition-colors ${!isLogin
                                    ? 'text-primary-600 border-b-2 border-primary-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Registrarse
                            </button>
                        </div>
                    </Card.Header>

                    <Card.Body>
                        {error && (
                            <div className="mb-4">
                                <Alert type="error" message={error} onClose={() => setError('')} />
                            </div>
                        )}

                        {success && (
                            <div className="mb-4">
                                <Alert type="success" message={success} onClose={() => setSuccess('')} />
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <Input
                                    label="Nombre"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Tu nombre completo"
                                    required={!isLogin}
                                />
                            )}

                            <Input
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="tu@email.com"
                                required
                            />

                            <Input
                                label="Contraseña"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                required
                            />

                            {!isLogin && (
                                <Select
                                    label="Tipo de Usuario"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'client' | 'agent' })}
                                    options={[
                                        { value: 'client', label: 'Cliente (Crear tickets)' },
                                        { value: 'agent', label: 'Agente (Atender tickets)' },
                                    ]}
                                />
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                loading={loading}
                            >
                                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                            </Button>
                        </form>
                    </Card.Body>
                </Card>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>
                        {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                            {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}