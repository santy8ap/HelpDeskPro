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
import PageLoading from '@/app/components/ui/PageLoading';
import { FiArrowLeft, FiMessageSquare, FiInfo, FiCalendar, FiUser, FiClock, FiAlertCircle } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

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
        return <PageLoading message="Cargando detalles del ticket..." />;
    }

    if (error || !ticket) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <div className="text-center max-w-md animate-fade-in-down">
                    <div className="text-6xl mb-4 animate-bounce">😕</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Algo salió mal</h2>
                    <p className="text-gray-500 mb-6">{error || 'No pudimos encontrar el ticket que buscas.'}</p>
                    <Button onClick={() => router.push('/client')} className="btn-primary">
                        <FiArrowLeft className="mr-2" /> Volver al Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    const createdBy = typeof ticket.createdBy === 'object' ? ticket.createdBy : null;
    const assignedTo = ticket.assignedTo && typeof ticket.assignedTo === 'object' ? ticket.assignedTo : null;

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" onClick={() => router.push('/client')} className="hover:bg-pink-50 text-pink-500">
                                <FiArrowLeft className="mr-1" /> Volver
                            </Button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    Ticket #{ticket._id.slice(-6)}
                                </h1>
                                <p className="text-sm text-gray-500">Detalles del ticket</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Ticket Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Main Info */}
                        <Card className="card-shadow border-t-4 border-t-pink-400">
                            <Card.Header className="bg-gradient-to-r from-pink-50/50 to-purple-50/50">
                                <div className="flex items-start justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900 flex-1 flex items-center gap-2">
                                        <HiSparkles className="text-pink-400" />
                                        {ticket.title}
                                    </h2>
                                    <div className="flex flex-col sm:flex-row gap-2 ml-4">
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
                                    <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-2">
                                        <FiInfo className="text-blue-500" /> Descripción
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {ticket.description}
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Comments Section */}
                        <Card className="card-shadow">
                            <Card.Header className="bg-white border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <FiMessageSquare className="text-purple-500" />
                                    Conversación <span className="bg-purple-100 text-purple-600 text-xs px-2 py-0.5 rounded-full">{comments.length}</span>
                                </h3>
                            </Card.Header>
                            <Card.Body className="bg-gray-50/30">
                                <CommentList comments={comments} currentUserId={user?._id} />
                            </Card.Body>
                        </Card>

                        {/* Add Comment */}
                        {ticket.status !== 'closed' && (
                            <Card className="anime-card border-2 border-blue-100">
                                <Card.Header className="bg-blue-50/50 border-b border-blue-100">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        ✨ Agregar Comentario
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
                        <Card className="card-shadow sticky top-24">
                            <Card.Header className="bg-gray-50 border-b border-gray-100">
                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                    <FiInfo /> Información
                                </h3>
                            </Card.Header>
                            <Card.Body>
                                <dl className="space-y-4">
                                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                        <dt className="text-xs text-gray-500 font-medium">Estado</dt>
                                        <dd>
                                            <Badge variant={getStatusVariant(ticket.status)}>
                                                {getStatusLabel(ticket.status)}
                                            </Badge>
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                        <dt className="text-xs text-gray-500 font-medium">Prioridad</dt>
                                        <dd>
                                            <Badge variant={getPriorityVariant(ticket.priority)}>
                                                {getPriorityLabel(ticket.priority)}
                                            </Badge>
                                        </dd>
                                    </div>
                                    <div className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                        <dt className="text-xs text-gray-500 font-medium flex items-center gap-1 mb-1">
                                            <FiUser /> Creado por
                                        </dt>
                                        <dd className="text-sm text-gray-900 font-medium">
                                            {createdBy?.name || 'Usuario'}
                                        </dd>
                                    </div>
                                    {assignedTo && (
                                        <div className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                            <dt className="text-xs text-gray-500 font-medium flex items-center gap-1 mb-1">
                                                <FiUser className="text-blue-500" /> Asignado a
                                            </dt>
                                            <dd className="text-sm text-gray-900 font-medium flex items-center gap-1">
                                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                                {assignedTo.name}
                                            </dd>
                                        </div>
                                    )}
                                    <div className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                        <dt className="text-xs text-gray-500 font-medium flex items-center gap-1 mb-1">
                                            <FiCalendar /> Fecha de creación
                                        </dt>
                                        <dd className="text-sm text-gray-900">
                                            {new Date(ticket.createdAt).toLocaleString('es-ES')}
                                        </dd>
                                    </div>
                                    <div className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                        <dt className="text-xs text-gray-500 font-medium flex items-center gap-1 mb-1">
                                            <FiClock /> Última actualización
                                        </dt>
                                        <dd className="text-sm text-gray-900">
                                            {new Date(ticket.updatedAt).toLocaleString('es-ES')}
                                        </dd>
                                    </div>
                                </dl>
                            </Card.Body>
                            <div className="p-4 bg-blue-50/50 border-t border-blue-100 rounded-b-xl">
                                <div className="text-center">
                                    <p className="text-sm text-blue-800 font-medium mb-1 flex items-center justify-center gap-1">
                                        <HiSparkles className="text-yellow-500" /> Estamos para ayudarte
                                    </p>
                                    <p className="text-xs text-blue-600">
                                        Te notificaremos por email cuando haya actualizaciones.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
