'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { ITicket, IComment, IUser, TicketStatus, TicketPriority } from '@/app/types';
import ticketService from '@/app/services/ticketService';
import commentService from '@/app/services/commentService';
import api from '@/app/services/api';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import Select from '@/app/components/ui/Select';
import Badge, { getStatusVariant, getPriorityVariant, getStatusLabel, getPriorityLabel } from '@/app/components/ui/Badge';
import CommentList from '@/app/components/comments/CommentList';
import CommentForm from '@/app/components/comments/CommentForm';
import Alert from '@/app/components/ui/Alert';

export default function AgentTicketDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const ticketId = params.id as string;

    const [ticket, setTicket] = useState<ITicket | null>(null);
    const [comments, setComments] = useState<IComment[]>([]);
    const [agents, setAgents] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        status: '' as TicketStatus,
        priority: '' as TicketPriority,
        assignedTo: '',
    });

    const loadTicket = async () => {
        try {
            setLoading(true);
            setError('');
            const ticketData = await ticketService.getTicketById(ticketId);
            setTicket(ticketData);
            setFormData({
                status: ticketData.status,
                priority: ticketData.priority,
                assignedTo: typeof ticketData.assignedTo === 'object'
                    ? ticketData.assignedTo._id
                    : ticketData.assignedTo || '',
            });
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

    const loadAgents = async () => {
        try {
            const response = await api.get('/users?role=agent');
            setAgents(response.data.data || []);
        } catch (err) {
            console.error('Error cargando agentes:', err);
        }
    };

    useEffect(() => {
        loadTicket();
        loadComments();
        loadAgents();
    }, [ticketId]);

    const handleUpdate = async () => {
        try {
            setUpdating(true);
            setError('');
            setSuccess('');

            await ticketService.updateTicket(ticketId, {
                status: formData.status,
                priority: formData.priority,
                assignedTo: formData.assignedTo || undefined,
            });

            setSuccess('Ticket actualizado exitosamente');
            setEditMode(false);
            await loadTicket();
        } catch (err: any) {
            setError(err.message || 'Error actualizando ticket');
        } finally {
            setUpdating(false);
        }
    };

    const handleCloseTicket = async () => {
        if (!confirm('¿Estás seguro de cerrar este ticket?')) return;

        try {
            setUpdating(true);
            await ticketService.updateTicket(ticketId, { status: 'closed' });
            setSuccess('Ticket cerrado exitosamente');
            await loadTicket();
        } catch (err: any) {
            setError(err.message || 'Error cerrando ticket');
        } finally {
            setUpdating(false);
        }
    };

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

    if (error && !ticket) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <Button onClick={() => router.push('/agent')}>
                        Volver al Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    if (!ticket) return null;

    const createdBy = typeof ticket.createdBy === 'object' ? ticket.createdBy : null;
    const assignedTo = ticket.assignedTo && typeof ticket.assignedTo === 'object' ? ticket.assignedTo : null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push('/agent')}
                                className="text-white hover:bg-blue-800"
                            >
                                ← Volver
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold">
                                    Ticket #{ticket._id.slice(-6)}
                                </h1>
                                <p className="text-sm text-blue-100">Gestión de ticket</p>
                            </div>
                        </div>
                        {ticket.status !== 'closed' && (
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={handleCloseTicket}
                                loading={updating}
                            >
                                Cerrar Ticket
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Alerts */}
                {success && (
                    <div className="mb-4">
                        <Alert type="success" message={success} onClose={() => setSuccess('')} />
                    </div>
                )}
                {error && ticket && (
                    <div className="mb-4">
                        <Alert type="error" message={error} onClose={() => setError('')} />
                    </div>
                )}

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

                        {/* Add Response */}
                        {ticket.status !== 'closed' && (
                            <Card>
                                <Card.Header>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Responder al Cliente
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
                        {/* Edit Ticket */}
                        <Card>
                            <Card.Header>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-gray-900">Gestionar Ticket</h3>
                                    {!editMode && ticket.status !== 'closed' && (
                                        <Button size="sm" variant="ghost" onClick={() => setEditMode(true)}>
                                            ✏️ Editar
                                        </Button>
                                    )}
                                </div>
                            </Card.Header>
                            <Card.Body>
                                {editMode ? (
                                    <div className="space-y-4">
                                        <Select
                                            label="Estado"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as TicketStatus })}
                                            options={[
                                                { value: 'open', label: 'Abierto' },
                                                { value: 'in_progress', label: 'En Progreso' },
                                                { value: 'resolved', label: 'Resuelto' },
                                                { value: 'closed', label: 'Cerrado' },
                                            ]}
                                        />
                                        <Select
                                            label="Prioridad"
                                            value={formData.priority}
                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value as TicketPriority })}
                                            options={[
                                                { value: 'low', label: 'Baja' },
                                                { value: 'medium', label: 'Media' },
                                                { value: 'high', label: 'Alta' },
                                            ]}
                                        />
                                        <Select
                                            label="Asignar a Agente"
                                            value={formData.assignedTo}
                                            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                                            options={[
                                                { value: '', label: 'Sin asignar' },
                                                ...agents.map(agent => ({ value: agent._id, label: agent.name }))
                                            ]}
                                        />
                                        <div className="flex gap-2">
                                            <Button onClick={handleUpdate} loading={updating} size="sm">
                                                Guardar
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => {
                                                    setEditMode(false);
                                                    setFormData({
                                                        status: ticket.status,
                                                        priority: ticket.priority,
                                                        assignedTo: typeof ticket.assignedTo === 'object'
                                                            ? ticket.assignedTo._id
                                                            : ticket.assignedTo || '',
                                                    });
                                                }}
                                            >
                                                Cancelar
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
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
                                            <dt className="text-xs text-gray-500">Asignado a</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {assignedTo ? `👨‍💼 ${assignedTo.name}` : 'Sin asignar'}
                                            </dd>
                                        </div>
                                    </dl>
                                )}
                            </Card.Body>
                        </Card>

                        {/* Client Info */}
                        <Card>
                            <Card.Header>
                                <h3 className="text-sm font-semibold text-gray-900">Información del Cliente</h3>
                            </Card.Header>
                            <Card.Body>
                                <dl className="space-y-3">
                                    <div>
                                        <dt className="text-xs text-gray-500">Nombre</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {createdBy?.name || 'Usuario'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-gray-500">Email</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {createdBy?.email || 'N/A'}
                                        </dd>
                                    </div>
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
                    </div>
                </div>
            </main>
        </div>
    );
}
