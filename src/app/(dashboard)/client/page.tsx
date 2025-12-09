'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { ITicket } from '@/app/types';
import ticketService from '@/app/services/ticketService';
import Button from '@/app/components/ui/Button';
import TicketList from '@/app/components/tickets/TicketList';
import TicketForm from '@/app/components/tickets/TicketForm';
import Badge from '@/app/components/ui/Badge';
import Card from '@/app/components/ui/Card';

export default function ClientDashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [tickets, setTickets] = useState<ITicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [error, setError] = useState('');

    // Estadísticas
    const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        inProgress: tickets.filter(t => t.status === 'in_progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
        closed: tickets.filter(t => t.status === 'closed').length,
    };

    // Cargar tickets del usuario
    const loadTickets = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await ticketService.getTickets();
            setTickets(data);
        } catch (err: any) {
            setError(err.message || 'Error cargando tickets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTickets();
    }, []);

    const handleTicketCreated = () => {
        setShowCreateForm(false);
        loadTickets();
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">⏳</div>
                    <p className="text-gray-500">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">🎫</span>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">HelpDeskPro</h1>
                                <p className="text-sm text-gray-500">Panel de Cliente</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={logout}>
                                Cerrar Sesión
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                    <Card>
                        <Card.Body>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                                <p className="text-sm text-gray-500 mt-1">Total</p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-blue-600">{stats.open}</p>
                                <p className="text-sm text-gray-500 mt-1">Abiertos</p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
                                <p className="text-sm text-gray-500 mt-1">En Progreso</p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
                                <p className="text-sm text-gray-500 mt-1">Resueltos</p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-gray-600">{stats.closed}</p>
                                <p className="text-sm text-gray-500 mt-1">Cerrados</p>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Mis Tickets</h2>
                    <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                        {showCreateForm ? '✕ Cancelar' : '+ Crear Ticket'}
                    </Button>
                </div>

                {/* Create Form */}
                {showCreateForm && (
                    <div className="mb-8">
                        <Card>
                            <Card.Header>
                                <h3 className="text-lg font-semibold">Crear Nuevo Ticket</h3>
                            </Card.Header>
                            <Card.Body>
                                <TicketForm
                                    onSubmit={async (data) => {
                                        await ticketService.createTicket(data);
                                        handleTicketCreated();
                                    }}
                                />
                            </Card.Body>
                        </Card>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Tickets List */}
                <TicketList
                    tickets={tickets}
                    basePath="/client"
                    loading={loading}
                    emptyMessage="No tienes tickets creados. ¡Crea tu primer ticket!"
                />
            </main>
        </div>
    );
}
