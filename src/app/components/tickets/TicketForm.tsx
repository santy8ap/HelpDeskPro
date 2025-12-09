'use client';

import React, { useState } from 'react';
import { CreateTicketFormData, TicketPriority } from '@/app/types';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';

interface TicketFormProps {
    onSubmit: (data: CreateTicketFormData) => Promise<void>;
    loading?: boolean;
}

export default function TicketForm({ onSubmit, loading = false }: TicketFormProps) {
    const [formData, setFormData] = useState<CreateTicketFormData>({
        title: '',
        description: '',
        priority: 'medium',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const priorityOptions = [
        { value: 'low', label: 'Baja' },
        { value: 'medium', label: 'Media' },
        { value: 'high', label: 'Alta' },
    ];

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'El título es requerido';
        } else if (formData.title.length < 5) {
            newErrors.title = 'El título debe tener al menos 5 caracteres';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'La descripción es requerida';
        } else if (formData.description.length < 10) {
            newErrors.description = 'La descripción debe tener al menos 10 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        await onSubmit(formData);

        // Limpiar formulario después de enviar
        setFormData({ title: '', description: '', priority: 'medium' });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Título"
                placeholder="Describe brevemente tu problema"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                error={errors.title}
                required
            />

            <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                    placeholder="Describe tu problema en detalle..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
            </div>

            <Select
                label="Prioridad"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TicketPriority })}
                options={priorityOptions}
            />

            <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="w-full"
            >
                Crear Ticket
            </Button>
        </form>
    );
}