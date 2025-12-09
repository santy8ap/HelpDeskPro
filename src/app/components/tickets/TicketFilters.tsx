'use client';

import React from 'react';
import { TicketStatus, TicketPriority } from '@/app/types';
import Select from '@/app/components/ui/Select';

interface TicketFiltersProps {
    status: string;
    priority: string;
    onStatusChange: (status: string) => void;
    onPriorityChange: (priority: string) => void;
}

export default function TicketFilters({
    status,
    priority,
    onStatusChange,
    onPriorityChange,
}: TicketFiltersProps) {
    const statusOptions = [
        { value: 'all', label: 'Todos los estados' },
        { value: 'open', label: 'Abierto' },
        { value: 'in_progress', label: 'En Progreso' },
        { value: 'resolved', label: 'Resuelto' },
        { value: 'closed', label: 'Cerrado' },
    ];

    const priorityOptions = [
        { value: 'all', label: 'Todas las prioridades' },
        { value: 'low', label: 'Baja' },
        { value: 'medium', label: 'Media' },
        { value: 'high', label: 'Alta' },
    ];

    return (
        <div className="flex flex-wrap gap-4 mb-6">
            <div className="w-48">
                <Select
                    label="Estado"
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value)}
                    options={statusOptions}
                />
            </div>
            <div className="w-48">
                <Select
                    label="Prioridad"
                    value={priority}
                    onChange={(e) => onPriorityChange(e.target.value)}
                    options={priorityOptions}
                />
            </div>
        </div>
    );
}