'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { ITicket, TicketStatus, TicketPriority } from '@/app/types';
import ticketService from '@/app/services/ticketService';
import Button from '@/app/components/ui/Button';
import TicketList from '@/app/components/tickets/TicketList';
import TicketFilters from '@/app/components/tickets/TicketFilters';
import Card from '@/app/components/ui/Card';

export default function AgentDashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [tickets, setTickets] = useState<ITicket[]>([]);
    const [filteredTickets, setFilteredTickets] = useState<ITicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState<{
        status: TicketStatus | 'all';
        priority: TicketPriority | 'all';
    }>({
        status: 'all',
        priority: 'all',
    });

    // Estadísticas
    const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        inProgress: tickets.filter(t => t.status === 'in_progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
        closed: tickets.filter(t => t.status === 'closed').length,
        highPriority: tickets.filter(t => t.priority === 'high').length,
    };

    const loadTickets = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await ticketService.getTickets({
                status: filters.status !== 'all' ? filters.status : undefined,
                priority: filters.priority !== 'all' ? filters.priority : undefined,
            });
            setTickets(data);
            setFilteredTickets(data);
        } catch (err: any) {
            setError(err.message || 'Error cargando tickets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTickets();
    }, [filters]);

    const handleFilterChange = (newFilters: { status?: TicketStatus | 'all'; priority?: TicketPriority | 'all' }) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
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
            <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl">👨‍💼</span>
                            <div>
                                <h1 className="text-3xl font-bold">Panel de Agente</h1>
                                <p className="text-blue-100 mt-1">Gestión de Tickets de Soporte</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-blue-200">{user.email}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:bg-blue-800">
                                Cerrar Sesión
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                    <Card>
                        <Card.Body>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                                <p className="text-xs text-gray-500 mt-1">Total Tickets</p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-blue-600">{stats.open}</p>
                                <p className="text-xs text-gray-500 mt-1">Abiertos</p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
                                <p className="text-xs text-gray-500 mt-1">En Progreso</p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
                                <p className="text-xs text-gray-500 mt-1">Resueltos</p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-gray-600">{stats.closed}</p>
                                <p className="text-xs text-gray-500 mt-1">Cerrados</p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-red-600">{stats.highPriority}</p>
                                <p className="text-xs text-gray-500 mt-1">Alta Prioridad</p>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Filters */}
                <div className="mb-6">
                    <Card>
                        <Card.Body>
                            <TicketFilters
                                status={filters.status}
                                priority={filters.priority}
                                onStatusChange={(status) => handleFilterChange({ status: status as TicketStatus | 'all' })}
                                onPriorityChange={(priority) => handleFilterChange({ priority: priority as TicketPriority | 'all' })}
                            />
                        </Card.Body>
                    </Card>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Todos los Tickets
                        {(filters.status !== 'all' || filters.priority !== 'all') && (
                            <span className="ml-2 text-sm font-normal text-gray-500">
                                (Filtrados)
                            </span>
                        )}
                    </h2>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={loadTickets}
                    >
                        🔄 Actualizar
                    </Button>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Tickets List */}
                <TicketList
                    tickets={filteredTickets}
                    basePath="/agent"
                    loading={loading}
                    emptyMessage="No hay tickets que coincidan con los filtros"
                />
            </main>
        </div>
    );
}
