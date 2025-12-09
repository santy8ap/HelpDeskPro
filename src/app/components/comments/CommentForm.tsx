'use client';

import React, { useState } from 'react';
import Button from '@/app/components/ui/Button';

interface CommentFormProps {
    onSubmit: (message: string) => Promise<void>;
    loading?: boolean;
    placeholder?: string;
}

export default function CommentForm({
    onSubmit,
    loading = false,
    placeholder = 'Escribe tu mensaje...',
}: CommentFormProps) {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim()) {
            setError('El mensaje no puede estar vacío');
            return;
        }

        setError('');
        await onSubmit(message);
        setMessage('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={placeholder}
                    rows={3}
                    disabled={loading}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 ${error ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
            </div>
            <div className="flex justify-end">
                <Button type="submit" loading={loading} disabled={loading}>
                    Enviar Comentario
                </Button>
            </div>
        </form>
    );
}