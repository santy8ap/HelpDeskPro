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
                setSuccess('✨ ¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
                setIsLogin(true);
            }
        } catch (err: any) {
            setError(err.message || '❌ Error. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 sakura-pattern">
            <div className="w-full max-w-md animate-fade-in-down">
                {/* Logo/Header con estilo anime */}
                <div className="text-center mb-8">
                    <div className="inline-block bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-transparent bg-clip-text">
                        <h1 className="text-5xl font-bold mb-2">
                            🌸 HelpDeskPro
                        </h1>
                    </div>
                    <p className="text-gray-600 text-sm">
                        {isLogin ? '✨ Bienvenido de vuelta ✨' : '💫 Crea tu cuenta 💫'}
                    </p>
                </div>

                <Card className="anime-card animate-scale-in">
                    <Card.Body>
                        {error && (
                            <div className="mb-4 animate-fade-in-down">
                                <Alert variant="error" message={error} />
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 animate-fade-in-down">
                                <Alert variant="success" message={success} />
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <Input
                                    label="👤 Nombre"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required={!isLogin}
                                    placeholder="Tu nombre"
                                />
                            )}

                            <Input
                                label="📧 Correo Electrónico"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="tu@email.com"
                            />

                            <Input
                                label="🔒 Contraseña"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                            />

                            {!isLogin && (
                                <Select
                                    label="👔 Rol"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    options={[
                                        { value: 'client', label: '👤 Cliente' },
                                        { value: 'agent', label: '🎧 Agente de Soporte' },
                                    ]}
                                />
                            )}

                            <Button
                                type="submit"
                                loading={loading}
                                disabled={loading}
                                className="w-full btn-primary font-semibold text-base"
                            >
                                {loading ? '⏳ Procesando...' : isLogin ? '🚀 Iniciar Sesión' : '✨ Crear Cuenta'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError('');
                                    setSuccess('');
                                }}
                                className="text-sm text-purple-500 hover:text-purple-600 font-medium transition-colors"
                            >
                                {isLogin
                                    ? '¿No tienes cuenta? 💫 Regístrate aquí'
                                    : '¿Ya tienes cuenta? 🌸 Inicia sesión'}
                            </button>
                        </div>

                        {/* Credenciales de prueba con estilo kawaii */}
                        {isLogin && (
                            <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200/50">
                                <p className="text-xs font-semibold text-gray-700 mb-2">
                                    🎀 Cuentas de Prueba:
                                </p>
                                <div className="space-y-2 text-xs text-gray-600">
                                    <div className="flex items-center justify-between">
                                        <span>👤 Cliente:</span>
                                        <code className="bg-white/70 px-2 py-1 rounded">cliente1@test.com</code>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>🎧 Agente:</span>
                                        <code className="bg-white/70 px-2 py-1 rounded">agente1@helpdesk.com</code>
                                    </div>
                                    <div className="text-center text-gray-500 text-xs mt-1">
                                        Password: <code className="bg-white/70 px-2 py-0.5 rounded">123456</code>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card.Body>
                </Card>

                {/* Footer kawaii */}
                <div className="text-center mt-6 text-sm text-gray-500">
                    <p>Made with 💖 by HelpDeskPro Team</p>
                </div>
            </div>
        </div>
    );
}