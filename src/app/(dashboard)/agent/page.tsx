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
import PageLoading from '@/app/components/ui/PageLoading';
import { FiLogOut, FiRefreshCw, FiActivity, FiCheckCircle, FiClock, FiArchive, FiAlertCircle, FiFilter } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

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

    if (!user || loading) {
        return <PageLoading message="Cargando panel de agente..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <HiSparkles className="text-yellow-300 text-3xl animate-spin-slow" />
                            <div>
                                <h1 className="text-3xl font-bold flex items-center gap-2">
                                    Panel de Agente
                                </h1>
                                <p className="text-blue-100 mt-1 text-sm font-medium opacity-90">Gestión de Tickets de Soporte</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold">{user.name}</p>
                                <p className="text-xs text-blue-100 opacity-80">{user.email}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:bg-white/20 border border-white/30">
                                <FiLogOut className="mr-2" /> Cerrar Sesión
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                    <Card className="card-shadow border-t-4 border-t-blue-500 transform hover:-translate-y-1 transition-all">
                        <Card.Body className="p-4">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                                <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider">Total</p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="card-shadow border-t-4 border-t-green-500 transform hover:-translate-y-1 transition-all">
                        <Card.Body className="p-4">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-green-600">{stats.open}</p>
                                <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider flex items-center justify-center gap-1">
                                    <FiActivity /> Abiertos
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="card-shadow border-t-4 border-t-yellow-500 transform hover:-translate-y-1 transition-all">
                        <Card.Body className="p-4">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
                                <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider flex items-center justify-center gap-1">
                                    <FiClock /> Proceso
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="card-shadow border-t-4 border-t-purple-500 transform hover:-translate-y-1 transition-all">
                        <Card.Body className="p-4">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-purple-600">{stats.resolved}</p>
                                <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider flex items-center justify-center gap-1">
                                    <FiCheckCircle /> Resueltos
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="card-shadow border-t-4 border-t-gray-500 transform hover:-translate-y-1 transition-all">
                        <Card.Body className="p-4">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-gray-600">{stats.closed}</p>
                                <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider flex items-center justify-center gap-1">
                                    <FiArchive /> Cerrados
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="card-shadow border-t-4 border-t-red-500 transform hover:-translate-y-1 transition-all">
                        <Card.Body className="p-4">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-red-600">{stats.highPriority}</p>
                                <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider flex items-center justify-center gap-1">
                                    <FiAlertCircle /> Alta Prio
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Filters */}
                <div className="mb-6 animate-scale-in">
                    <Card className="anime-card border-2 border-blue-100">
                        <Card.Header className="bg-blue-50/50 border-b border-blue-100 py-3">
                            <h3 className="text-sm font-bold text-blue-800 flex items-center gap-2">
                                <FiFilter /> Filtros de Búsqueda
                            </h3>
                        </Card.Header>
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
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-2xl">📋</span> Todos los Tickets
                        {(filters.status !== 'all' || filters.priority !== 'all') && (
                            <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                (Filtrados)
                            </span>
                        )}
                    </h2>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={loadTickets}
                        className="bg-white hover:bg-gray-50 border border-gray-200 shadow-sm"
                    >
                        <FiRefreshCw className="mr-2" /> Actualizar
                    </Button>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in-down">
                        <p className="text-red-800 flex items-center gap-2">
                            <FiAlertCircle className="text-red-500" /> {error}
                        </p>
                    </div>
                )}

                {/* Tickets List */}
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-2">
                    <TicketList
                        tickets={filteredTickets}
                        basePath="/agent"
                        loading={false} // Loading handled by PageLoading
                        emptyMessage="No hay tickets que coincidan con los filtros seleccionados"
                    />
                </div>
            </main>
        </div>
    );
}
