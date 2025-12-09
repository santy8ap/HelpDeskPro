'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ITicket } from '@/app/types';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import Badge, {
    getStatusVariant,
    getPriorityVariant,
    getStatusLabel,
    getPriorityLabel
} from '@/app/components/ui/Badge';

interface TicketCardProps {
    ticket: ITicket;
    basePath: string; // '/client' o '/agent'
}

export default function TicketCard({ ticket, basePath }: TicketCardProps) {
    const router = useRouter();

    const createdBy = typeof ticket.createdBy === 'object'
        ? ticket.createdBy.name
        : 'Usuario';

    const formattedDate = new Date(ticket.createdAt).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <Card.Body>
                <div className="flex flex-col gap-3">
                    {/* Header con badges */}
                    <div className="flex items-start justify-between">
                        <div className="flex gap-2">
                            <Badge variant={getStatusVariant(ticket.status)}>
                                {getStatusLabel(ticket.status)}
                            </Badge>
                            <Badge variant={getPriorityVariant(ticket.priority)}>
                                {getPriorityLabel(ticket.priority)}
                            </Badge>
                        </div>
                        <span className="text-xs text-gray-500">
                            #{ticket._id.slice(-6)}
                        </span>
                    </div>

                    {/* Título */}
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {ticket.title}
                    </h3>

                    {/* Descripción */}
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {ticket.description}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Por: {createdBy}</span>
                        <span>{formattedDate}</span>
                    </div>
                </div>
            </Card.Body>

            <Card.Footer className="flex justify-end">
                <Button
                    size="sm"
                    onClick={() => router.push(`${basePath}/tickets/${ticket._id}`)}
                >
                    Ver Detalle
                </Button>
            </Card.Footer>
        </Card>
    );
}