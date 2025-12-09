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
                    icon: <HiSparkles className="text-yellow-400" />,
                });
            } else {
                await authService.register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                });
                toast.success('¡Cuenta creada exitosamente! Ya puedes iniciar sesión.', {
                    icon: <HiSparkles className="text-yellow-400" />,
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
        <div className="w-full animate-fade-in-right">
            {/* Logo/Header */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 mb-2">
                    <HiSparkles className="text-yellow-400 text-4xl animate-pulse" />
                    <h1 className="text-5xl font-bold text-white drop-shadow-lg tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                        HelpDeskPro
                    </h1>
                </div>
                <p className="text-blue-100 text-lg font-medium drop-shadow-md">
                    {isLogin ? 'Accede a tu panel de control' : 'Únete a la plataforma del futuro'}
                </p>
            </div>

            <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-bold text-blue-100 mb-1.5 flex items-center gap-2">
                                    <FiUser className="text-yellow-400" />
                                    Nombre
                                </label>
                                <Input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required={!isLogin}
                                    placeholder="Tu nombre completo"
                                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400/50"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-blue-100 mb-1.5 flex items-center gap-2">
                                <FiMail className="text-yellow-400" />
                                Correo Electrónico
                            </label>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="tu@email.com"
                                className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400/50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-blue-100 mb-1.5 flex items-center gap-2">
                                <FiLock className="text-yellow-400" />
                                Contraseña
                            </label>
                            <Input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                                className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400/50"
                            />
                        </div>

                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-bold text-blue-100 mb-1.5 flex items-center gap-2">
                                    <FiBriefcase className="text-yellow-400" />
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
                                    className="bg-white/10 border-white/20 text-white focus:border-yellow-400 focus:ring-yellow-400/50 [&>option]:text-gray-900"
                                />
                            </div>
                        )}

                        <Button
                            type="submit"
                            loading={loading}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold text-lg py-3 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] flex items-center justify-center gap-2 border-none"
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
                            className="text-sm text-blue-200 hover:text-white font-medium transition-colors hover:underline"
                        >
                            {isLogin
                                ? '¿No tienes cuenta? Regístrate aquí'
                                : '¿Ya tienes cuenta? Inicia sesión'}
                        </button>
                    </div>

                    {/* Credenciales de prueba */}
                    {isLogin && (
                        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                            <p className="text-xs font-bold text-yellow-200 mb-2 flex items-center gap-1 uppercase tracking-wider">
                                <HiSparkles />
                                Cuentas de Prueba
                            </p>
                            <div className="space-y-2 text-xs text-gray-300">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1">
                                        <FiUser className="text-blue-300" />
                                        Cliente:
                                    </span>
                                    <code className="bg-black/30 px-2 py-1 rounded text-white font-mono">cliente1@test.com</code>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1">
                                        <FiBriefcase className="text-purple-300" />
                                        Agente:
                                    </span>
                                    <code className="bg-black/30 px-2 py-1 rounded text-white font-mono">agente1@helpdesk.com</code>
                                </div>
                                <div className="text-center text-gray-400 text-xs mt-2">
                                    Password: <code className="bg-black/30 px-2 py-0.5 rounded text-white font-mono">123456</code>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-6 text-xs text-white/50">
                <p>Powered by Super Saiyan Technology</p>
            </div>
        </div>
    );
}