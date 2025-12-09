'use client';

import React from 'react';
import { SelectProps } from '@/app/types';

export default function Select({
    label,
    error,
    value,
    onChange,
    options,
    required = false,
    disabled = false,
    name,
}: SelectProps) {
    const selectId = name || label?.toLowerCase().replace(/\s/g, '-');

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <select
                id={selectId}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${error ? 'border-red-500' : 'border-gray-300'
                    }`}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}