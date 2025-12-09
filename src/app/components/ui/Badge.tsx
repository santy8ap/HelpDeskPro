'use client';

import React from 'react';
import { BadgeProps, BadgeVariant } from '@/app/types';

const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
};

export default function Badge({
    children,
    variant = 'default',
    className = '',
}: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
        >
            {children}
        </span>
    );
}

// Helpers para mapear estados y prioridades a variantes
export function getStatusVariant(status: string): BadgeVariant {
    const map: Record<string, BadgeVariant> = {
        open: 'info',
        in_progress: 'warning',
        resolved: 'success',
        closed: 'default',
    };
    return map[status] || 'default';
}

export function getPriorityVariant(priority: string): BadgeVariant {
    const map: Record<string, BadgeVariant> = {
        low: 'default',
        medium: 'warning',
        high: 'danger',
    };
    return map[priority] || 'default';
}

export function getStatusLabel(status: string): string {
    const map: Record<string, string> = {
        open: 'Abierto',
        in_progress: 'En Progreso',
        resolved: 'Resuelto',
        closed: 'Cerrado',
    };
    return map[status] || status;
}

export function getPriorityLabel(priority: string): string {
    const map: Record<string, string> = {
        low: 'Baja',
        medium: 'Media',
        high: 'Alta',
    };
    return map[priority] || priority;
}