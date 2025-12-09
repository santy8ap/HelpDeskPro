'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import authService from '@/app/services/authService';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiUser, FiBriefcase, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'client' as 'client' | 'agent',
    });
    const [loading, setLoading] = useState(false);

    const { login, isAuthenticated, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated && user) {
            router.push(user.role === 'agent' ? '/agent' : '/client');
        }
    }, [isAuthenticated, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                toast.success('¡Bienvenido de vuelta!', {
                    icon: <HiSparkles className="text-pink-500" />,
                });
            } else {
                await authService.register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                });
                toast.success('¡Cuenta creada exitosamente! Ya puedes iniciar sesión.', {
                    icon: <HiSparkles className="text-pink-500" />,
                });
                setIsLogin(true);
                setFormData({ name: '', email: '', password: '', role: 'client' });
            }
        } catch (err: any) {
            toast.error(err.message || 'Error. Por favor intenta de nuevo.');
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
        <div className="min-h-screen flex items-center justify-center px-4 py-12 sakura-pattern relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="w-full max-w-md animate-fade-in-down relative z-10">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-transparent bg-clip-text">
                        <HiSparkles className="text-pink-400 text-3xl" />
                        <h1 className="text-5xl font-bold">
                            HelpDeskPro
                        </h1>
                    </div>
                    <p className="text-gray-600 text-sm mt-2">
                        {isLogin ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
                    </p>
                </div>

                <Card className="anime-card animate-scale-in">
                    <Card.Body>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                        <FiUser className="text-pink-500" />
                                        Nombre
                                    </label>
                                    <Input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required={!isLogin}
                                        placeholder="Tu nombre completo"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                    <FiMail className="text-pink-500" />
                                    Correo Electrónico
                                </label>
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="tu@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                    <FiLock className="text-pink-500" />
                                    Contraseña
                                </label>
                                <Input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                />
                            </div>

                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                                        <FiBriefcase className="text-pink-500" />
                                        Rol
                                    </label>
                                    <Select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        options={[
                                            { value: 'client', label: 'Cliente' },
                                            { value: 'agent', label: 'Agente de Soporte' },
                                        ]}
                                    />
                                </div>
                            )}

                            <Button
                                type="submit"
                                loading={loading}
                                disabled={loading}
                                className="w-full btn-primary font-semibold text-base flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    'Procesando...'
                                ) : isLogin ? (
                                    <>
                                        <FiLogIn /> Iniciar Sesión
                                    </>
                                ) : (
                                    <>
                                        <FiUserPlus /> Crear Cuenta
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                }}
                                className="text-sm text-purple-500 hover:text-purple-600 font-medium transition-colors"
                            >
                                {isLogin
                                    ? '¿No tienes cuenta? Regístrate aquí'
                                    : '¿Ya tienes cuenta? Inicia sesión'}
                            </button>
                        </div>

                        {/* Credenciales de prueba */}
                        {isLogin && (
                            <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200/50">
                                <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                    <HiSparkles className="text-pink-500" />
                                    Cuentas de Prueba
                                </p>
                                <div className="space-y-2 text-xs text-gray-600">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1">
                                            <FiUser className="text-pink-400" />
                                            Cliente:
                                        </span>
                                        <code className="bg-white/70 px-2 py-1 rounded">cliente1@test.com</code>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1">
                                            <FiBriefcase className="text-purple-400" />
                                            Agente:
                                        </span>
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

                {/* Footer */}
                <div className="text-center mt-6 text-sm text-gray-500">
                    <p>Made with love by HelpDeskPro Team</p>
                </div>
            </div>
        </div>
    );
}