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

        <div className="min-h-screen bg-transparent">
            {/* Header */}
            <header className="bg-white/30 backdrop-blur-md border-b border-white/20 shadow-sm sticky top-0 z-40 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/50 p-2 rounded-full shadow-inner border border-blue-100">
                                <HiSparkles className="text-yellow-400 text-3xl animate-spin-slow" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black italic bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text drop-shadow-sm flex items-center gap-2">
                                    Panel de Agente
                                </h1>
                                <p className="text-blue-900 mt-1 text-sm font-bold opacity-80 tracking-wide">Gestión de Tickets de Soporte</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block bg-white/40 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/40">
                                <p className="text-sm font-bold text-gray-800">{user.name}</p>
                                <p className="text-xs text-blue-700 font-medium">{user.email}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={logout} className="text-red-500 hover:bg-red-50 border border-white/40 bg-white/40 backdrop-blur-sm hover:text-red-600">
                                <FiLogOut className="mr-2" /> Cerrar Sesión
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-10">
                    <Card className="anime-card border-t-4 border-t-blue-500 group">
                        <Card.Body className="p-4">
                            <div className="text-center group-hover:-translate-y-1 transition-transform duration-300">
                                <p className="text-3xl font-black text-blue-600 drop-shadow-sm">{stats.total}</p>
                                <p className="text-xs font-bold text-blue-800 mt-1 uppercase tracking-widest bg-blue-100/50 rounded-full py-0.5">Total</p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="anime-card border-t-4 border-t-green-500 group">
                        <Card.Body className="p-4">
                            <div className="text-center group-hover:-translate-y-1 transition-transform duration-300">
                                <p className="text-3xl font-black text-green-600 drop-shadow-sm">{stats.open}</p>
                                <p className="text-xs font-bold text-green-800 mt-1 uppercase tracking-widest flex items-center justify-center gap-1 bg-green-100/50 rounded-full py-0.5">
                                    <FiActivity /> Abiertos
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="anime-card border-t-4 border-t-yellow-500 group">
                        <Card.Body className="p-4">
                            <div className="text-center group-hover:-translate-y-1 transition-transform duration-300">
                                <p className="text-3xl font-black text-yellow-600 drop-shadow-sm">{stats.inProgress}</p>
                                <p className="text-xs font-bold text-yellow-800 mt-1 uppercase tracking-widest flex items-center justify-center gap-1 bg-yellow-100/50 rounded-full py-0.5">
                                    <FiClock /> Proceso
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="anime-card border-t-4 border-t-purple-500 group">
                        <Card.Body className="p-4">
                            <div className="text-center group-hover:-translate-y-1 transition-transform duration-300">
                                <p className="text-3xl font-black text-purple-600 drop-shadow-sm">{stats.resolved}</p>
                                <p className="text-xs font-bold text-purple-800 mt-1 uppercase tracking-widest flex items-center justify-center gap-1 bg-purple-100/50 rounded-full py-0.5">
                                    <FiCheckCircle /> Resueltos
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="anime-card border-t-4 border-t-gray-500 group">
                        <Card.Body className="p-4">
                            <div className="text-center group-hover:-translate-y-1 transition-transform duration-300">
                                <p className="text-3xl font-black text-gray-600 drop-shadow-sm">{stats.closed}</p>
                                <p className="text-xs font-bold text-gray-800 mt-1 uppercase tracking-widest flex items-center justify-center gap-1 bg-gray-100/50 rounded-full py-0.5">
                                    <FiArchive /> Cerrados
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="anime-card border-t-4 border-t-red-500 group">
                        <Card.Body className="p-4">
                            <div className="text-center group-hover:-translate-y-1 transition-transform duration-300">
                                <p className="text-3xl font-black text-red-600 drop-shadow-sm">{stats.highPriority}</p>
                                <p className="text-xs font-bold text-red-800 mt-1 uppercase tracking-widest flex items-center justify-center gap-1 bg-red-100/50 rounded-full py-0.5">
                                    <FiAlertCircle /> Alta Prio
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Filters */}
                <div className="mb-8 animate-scale-in">
                    <Card className="anime-card border-2 border-blue-200/50 overflow-visible">
                        <Card.Header className="bg-gradient-to-r from-blue-100/50 to-purple-100/50 border-b border-blue-100 py-4 backdrop-blur-md rounded-t-2xl">
                            <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                                <span className="p-1 bg-white rounded-lg shadow-sm"><FiFilter className="text-blue-500" /></span> Filtros de Búsqueda
                            </h3>
                        </Card.Header>
                        <Card.Body className="bg-white/30 rounded-b-2xl">
                            <TicketFilters
                                status={filters.status}
                                priority={filters.priority}
                                onStatusChange={(status) => handleFilterChange({ status: status as TicketStatus | 'all' })}
                                onPriorityChange={(priority) => handleFilterChange({ priority: priority as TicketPriority | 'all' })}
                            />
                        </Card.Body>
                    </Card>
                </div>

                {/* Header for list */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2 drop-shadow-sm">
                        <span className="text-3xl">📋</span> Todos los Tickets
                        {(filters.status !== 'all' || filters.priority !== 'all') && (
                            <span className="ml-2 text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 rounded-full shadow-md animate-pulse">
                                Filtrados
                            </span>
                        )}
                    </h2>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={loadTickets}
                        className="bg-white/60 hover:bg-white border border-white/60 shadow-md backdrop-blur-sm text-blue-700"
                    >
                        <FiRefreshCw className="mr-2" /> Actualizar
                    </Button>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 bg-red-100/80 border-l-4 border-red-500 rounded-r-xl p-4 animate-fade-in-down shadow-md backdrop-blur-sm">
                        <p className="text-red-800 flex items-center gap-2 font-bold">
                            <FiAlertCircle className="text-red-600 text-xl" /> {error}
                        </p>
                    </div>
                )}

                {/* Tickets List */}
                <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 border border-white/30 shadow-xl min-h-[300px]">
                    <TicketList
                        tickets={filteredTickets}
                        basePath="/agent"
                        loading={false}
                        emptyMessage="No hay tickets que coincidan con los filtros seleccionados"
                    />
                </div>
            </main>
        </div>
    );
}
