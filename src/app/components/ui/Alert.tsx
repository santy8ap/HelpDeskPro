'use client';

import React from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
    type: AlertType;
    message: string;
    onClose?: () => void;
}

const typeStyles: Record<AlertType, string> = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
};

const icons: Record<AlertType, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
};

export default function Alert({ type, message, onClose }: AlertProps) {
    return (
        <div className={`flex items-center p-4 rounded-lg border ${typeStyles[type]}`}>
            <span className="mr-2 text-lg">{icons[type]}</span>
            <span className="flex-1">{message}</span>
            {onClose && (
                <button
                    onClick={onClose}
                    className="ml-2 text-lg hover:opacity-70"
                >
                    ×
                </button>
            )}
        </div>
    );
}