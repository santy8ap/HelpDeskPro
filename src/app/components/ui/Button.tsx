'use client';

import React from 'react';
import { ButtonProps, ButtonVariant, ButtonSize } from '@/app/types';

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg border border-transparent',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-md hover:shadow-lg border border-transparent',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md hover:shadow-lg border border-transparent',
    ghost: 'bg-transparent hover:bg-white/10 text-gray-700 hover:text-gray-900',
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs uppercase tracking-wider font-bold',
    md: 'px-5 py-2.5 text-sm font-semibold',
    lg: 'px-8 py-3.5 text-base font-bold',
};

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    type = 'button',
    onClick,
    className = '',
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed';

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        >
            {loading && (
                <img
                    src="https://media.tenor.com/wpShtFFlPFcAAAAC/anime-loading.gif"
                    alt="Loading..."
                    className="w-5 h-5 mr-2 rounded"
                />
            )}
            {children}
        </button>
    );
}