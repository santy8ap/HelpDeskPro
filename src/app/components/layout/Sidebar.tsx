'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

interface NavItem {
    href: string;
    label: string;
    icon: string;
}

export default function Sidebar() {
    const { user } = useAuth();
    const pathname = usePathname();

    const clientNavItems: NavItem[] = [
        { href: '/client', label: 'Mis Tickets', icon: '📋' },
        { href: '/client/new', label: 'Nuevo Ticket', icon: '+' },
    ];

    const agentNavItems: NavItem[] = [
        { href: '/agent', label: 'Todos los Tickets', icon: '📋' },
        { href: '/agent/stats', label: 'Estadísticas', icon: '📊' },
    ];

    const navItems = user?.role === 'agent' ? agentNavItems : clientNavItems;

    return (
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-4rem)]">
            <nav className="p-4">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive
                                        ? 'bg-primary-50 text-primary-700 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}