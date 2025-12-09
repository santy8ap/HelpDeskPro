'use client';

import React from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Button from '@/app/components/ui/Button';
import Badge from '@/app/components/ui/Badge';

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <span className="text-2xl"></span>
                        <span className="text-xl font-bold text-primary-600">HelpDeskPro</span>
                    </div>

                    {/* User info */}
                    {isAuthenticated && user && (
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                            <Badge variant={user.role === 'agent' ? 'info' : 'default'}>
                                {user.role === 'agent' ? 'Agente' : 'Cliente'}
                            </Badge>
                            <Button variant="ghost" size="sm" onClick={logout}>
                                Cerrar Sesión
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}