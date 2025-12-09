'use client';

import React from 'react';
import { InputProps } from '@/app/types';

export default function Input({
    label,
    error,
    type = 'text',
    placeholder,
    value,
    onChange,
    required = false,
    disabled = false,
    name,
    className,
}: InputProps) {
    const inputId = name || label?.toLowerCase().replace(/\s/g, '-');

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                id={inputId}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${error ? 'border-red-500' : 'border-gray-300'} ${className || ''}`}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}