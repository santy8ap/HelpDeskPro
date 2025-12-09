'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { ITicket } from '@/app/types';
import ticketService from '@/app/services/ticketService';
import Button from '@/app/components/ui/Button';
import TicketList from '@/app/components/tickets/TicketList';
import TicketForm from '@/app/components/tickets/TicketForm';
import Card from '@/app/components/ui/Card';
import PageLoading from '@/app/components/ui/PageLoading';
import { FiLogOut, FiPlus, FiX, FiActivity, FiCheckCircle, FiClock, FiArchive } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

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

    if (!user || loading) {
        return <PageLoading message="Cargando tu panel..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <HiSparkles className="text-pink-500 text-2xl animate-pulse" />
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
                                    HelpDeskPro
                                </h1>
                                <p className="text-xs text-gray-500 font-medium">Panel de Cliente</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-800">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={logout} className="text-red-500 hover:bg-red-50">
                                <FiLogOut className="mr-2" /> Salir
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <Card className="card-shadow border-t-4 border-t-blue-400">
                        <Card.Body className="p-4">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                                <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">Total</p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="card-shadow border-t-4 border-t-green-400">
                        <Card.Body className="p-4">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-green-600">{stats.open}</p>
                                <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider flex items-center justify-center gap-1">
                                    <FiActivity /> Abiertos
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="card-shadow border-t-4 border-t-yellow-400">
                        <Card.Body className="p-4">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
                                <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider flex items-center justify-center gap-1">
                                    <FiClock /> En Proceso
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="card-shadow border-t-4 border-t-purple-400">
                        <Card.Body className="p-4">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-purple-600">{stats.resolved}</p>
                                <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider flex items-center justify-center gap-1">
                                    <FiCheckCircle /> Resueltos
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="card-shadow border-t-4 border-t-gray-400">
                        <Card.Body className="p-4">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-gray-600">{stats.closed}</p>
                                <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider flex items-center justify-center gap-1">
                                    <FiArchive /> Cerrados
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-2xl">🎫</span> Mis Tickets
                    </h2>
                    <Button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className={showCreateForm ? "bg-red-500 hover:bg-red-600 text-white" : "btn-primary"}
                    >
                        {showCreateForm ? (
                            <><FiX className="mr-2" /> Cancelar</>
                        ) : (
                            <><FiPlus className="mr-2" /> Crear Ticket</>
                        )}
                    </Button>
                </div>

                {/* Create Form */}
                {showCreateForm && (
                    <div className="mb-8 animate-scale-in">
                        <Card className="anime-card border-2 border-pink-100">
                            <Card.Header className="bg-gradient-to-r from-pink-50 to-purple-50 border-b border-pink-100">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    ✨ Crear Nuevo Ticket
                                </h3>
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
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in-down">
                        <p className="text-red-800 flex items-center gap-2">
                            <FiX className="text-red-500" /> {error}
                        </p>
                    </div>
                )}

                {/* Tickets List */}
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-2">
                    <TicketList
                        tickets={tickets}
                        basePath="/client"
                        loading={false} // Loading handled by PageLoading
                        emptyMessage="No tienes tickets creados. ¡Crea tu primer ticket para comenzar!"
                    />
                </div>
            </main>
        </div>
    );
}
