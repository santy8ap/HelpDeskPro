'use client';

import React from 'react';
import { ITicket, IUser } from '@/app/types';
import Card from '@/app/components/ui/Card';
import Badge, {
    getStatusVariant,
    getPriorityVariant,
    getStatusLabel,
    getPriorityLabel
} from '@/app/components/ui/Badge';

interface TicketDetailProps {
    ticket: ITicket;
}

export default function TicketDetail({ ticket }: TicketDetailProps) {
    const createdBy = ticket.createdBy as IUser;
    const assignedTo = ticket.assignedTo as IUser | undefined;

    const formattedCreatedAt = new Date(ticket.createdAt).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const formattedUpdatedAt = new Date(ticket.updatedAt).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <Card>
            <Card.Header>
                <div className="flex items-start justify-between">
                    <div>
                        <span className="text-sm text-gray-500">Ticket #{ticket._id.slice(-6)}</span>
                        <h1 className="text-xl font-bold text-gray-900 mt-1">{ticket.title}</h1>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant={getStatusVariant(ticket.status)}>
                            {getStatusLabel(ticket.status)}
                        </Badge>
                        <Badge variant={getPriorityVariant(ticket.priority)}>
                            {getPriorityLabel(ticket.priority)}
                        </Badge>
                    </div>
                </div>
            </Card.Header>

            <Card.Body>
                <div className="space-y-4">
                    {/* Descripción */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Descripción</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                    </div>

                    {/* Info del ticket */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Creado por</h3>
                            <p className="text-gray-700">{createdBy?.name || 'N/A'}</p>
                            <p className="text-sm text-gray-500">{createdBy?.email}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Asignado a</h3>
                            <p className="text-gray-700">{assignedTo?.name || 'Sin asignar'}</p>
                            {assignedTo?.email && (
                                <p className="text-sm text-gray-500">{assignedTo.email}</p>
                            )}
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Creado</h3>
                            <p className="text-gray-700">{formattedCreatedAt}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Última actualización</h3>
                            <p className="text-gray-700">{formattedUpdatedAt}</p>
                        </div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}