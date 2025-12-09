'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { ITicket, IComment } from '@/app/types';
import ticketService from '@/app/services/ticketService';
import commentService from '@/app/services/commentService';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import Badge, { getStatusVariant, getPriorityVariant, getStatusLabel, getPriorityLabel } from '@/app/components/ui/Badge';
import CommentList from '@/app/components/comments/CommentList';
import CommentForm from '@/app/components/comments/CommentForm';

export default function ClientTicketDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const ticketId = params.id as string;

    const [ticket, setTicket] = useState<ITicket | null>(null);
    const [comments, setComments] = useState<IComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadTicket = async () => {
        try {
            setLoading(true);
            setError('');
            const ticketData = await ticketService.getTicketById(ticketId);
            setTicket(ticketData);
        } catch (err: any) {
            setError(err.message || 'Error cargando ticket');
        } finally {
            setLoading(false);
        }
    };

    const loadComments = async () => {
        try {
            const commentsData = await commentService.getComments(ticketId);
            setComments(commentsData);
        } catch (err: any) {
            console.error('Error cargando comentarios:', err);
        }
    };

    useEffect(() => {
        loadTicket();
        loadComments();
    }, [ticketId]);

    const handleCommentAdded = () => {
        loadComments();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-6xl mb-4">⏳</div>
                    <p className="text-gray-500">Cargando ticket...</p>
                </div>
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-500 mb-4">{error || 'Ticket no encontrado'}</p>
                    <Button onClick={() => router.push('/client')}>
                        Volver al Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    const createdBy = typeof ticket.createdBy === 'object' ? ticket.createdBy : null;
    const assignedTo = ticket.assignedTo && typeof ticket.assignedTo === 'object' ? ticket.assignedTo : null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" onClick={() => router.push('/client')}>
                                ← Volver
                            </Button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    Ticket #{ticket._id.slice(-6)}
                                </h1>
                                <p className="text-sm text-gray-500">Detalles del ticket</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Ticket Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Main Info */}
                        <Card>
                            <Card.Header>
                                <div className="flex items-start justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900 flex-1">
                                        {ticket.title}
                                    </h2>
                                    <div className="flex gap-2 ml-4">
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
                                <div className="prose max-w-none">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Descripción:</h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Comments Section */}
                        <Card>
                            <Card.Header>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Conversación ({comments.length})
                                </h3>
                            </Card.Header>
                            <Card.Body>
                                <CommentList comments={comments} currentUserId={user?._id} />
                            </Card.Body>
                        </Card>

                        {/* Add Comment */}
                        {ticket.status !== 'closed' && (
                            <Card>
                                <Card.Header>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Agregar Comentario
                                    </h3>
                                </Card.Header>
                                <Card.Body>
                                    <CommentForm
                                        onSubmit={async (message) => {
                                            await commentService.addComment(ticketId, { message });
                                            handleCommentAdded();
                                        }}
                                    />
                                </Card.Body>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Info */}
                        <Card>
                            <Card.Header>
                                <h3 className="text-sm font-semibold text-gray-900">Información</h3>
                            </Card.Header>
                            <Card.Body>
                                <dl className="space-y-3">
                                    <div>
                                        <dt className="text-xs text-gray-500">Estado</dt>
                                        <dd className="mt-1">
                                            <Badge variant={getStatusVariant(ticket.status)}>
                                                {getStatusLabel(ticket.status)}
                                            </Badge>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-gray-500">Prioridad</dt>
                                        <dd className="mt-1">
                                            <Badge variant={getPriorityVariant(ticket.priority)}>
                                                {getPriorityLabel(ticket.priority)}
                                            </Badge>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-gray-500">Creado por</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {createdBy?.name || 'Usuario'}
                                        </dd>
                                    </div>
                                    {assignedTo && (
                                        <div>
                                            <dt className="text-xs text-gray-500">Asignado a</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                👨‍💼 {assignedTo.name}
                                            </dd>
                                        </div>
                                    )}
                                    <div>
                                        <dt className="text-xs text-gray-500">Fecha de creación</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {new Date(ticket.createdAt).toLocaleString('es-ES')}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-gray-500">Última actualización</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {new Date(ticket.updatedAt).toLocaleString('es-ES')}
                                        </dd>
                                    </div>
                                </dl>
                            </Card.Body>
                        </Card>

                        {/* Help */}
                        <Card>
                            <Card.Body>
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Un agente revisará tu ticket pronto.
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Te notificaremos por email cuando haya actualizaciones.
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
