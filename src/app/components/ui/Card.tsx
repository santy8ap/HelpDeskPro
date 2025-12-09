'use client';

import React from 'react';
import { CardProps } from '@/app/types';

export default function Card({
    children,
    className = '',
    onClick,
}: CardProps) {
    const baseStyles = 'bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden';
    const clickableStyles = onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : '';

    return (
        <div
            className={`${baseStyles} ${clickableStyles} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}

// Sub-componentes para estructura de Card
Card.Header = function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`px-4 py-3 border-b border-gray-200 ${className}`}>
            {children}
        </div>
    );
};

Card.Body = function CardBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`px-4 py-4 ${className}`}>
            {children}
        </div>
    );
};

Card.Footer = function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`px-4 py-3 border-t border-gray-200 bg-gray-50 ${className}`}>
            {children}
        </div>
    );
};