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


        <div className="min-h-screen bg-transparent font-sans">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-white/40 sticky top-0 z-40 shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/50 p-2 rounded-full shadow-inner ring-2 ring-pink-100">
                                <HiSparkles className="text-pink-500 text-2xl animate-spin-slow" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black italic bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-transparent bg-clip-text drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
                                    HelpDeskPro
                                </h1>
                                <p className="text-xs text-indigo-900 font-bold tracking-widest bg-white/30 px-2 rounded-full inline-block mt-0.5">PANEL DE CLIENTE</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block bg-white/60 px-4 py-1.5 rounded-2xl backdrop-blur-md border border-white/50 shadow-sm transition-all hover:bg-white/80">
                                <p className="text-sm font-bold text-gray-800">{user.name}</p>
                                <p className="text-xs text-indigo-700 font-medium">{user.email}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={logout} className="bg-white/60 hover:bg-red-50 text-red-500 hover:text-red-600 border border-white/50 shadow-sm backdrop-blur-md transition-all hover:scale-105">
                                <FiLogOut className="mr-2" /> Salir
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                    <Card className="anime-card bg-white/80 border-t-4 border-t-blue-500 group hover:shadow-blue-200/50">
                        <Card.Body className="p-4">
                            <div className="text-center group-hover:-translate-y-1 transition-transform duration-300">
                                <p className="text-4xl font-black text-blue-600 drop-shadow-sm">{stats.total}</p>
                                <p className="text-xs font-extrabold text-blue-900 mt-2 uppercase tracking-widest bg-blue-100 rounded-lg py-1 shadow-sm">Total</p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="anime-card bg-white/80 border-t-4 border-t-green-500 group hover:shadow-green-200/50">
                        <Card.Body className="p-4">
                            <div className="text-center group-hover:-translate-y-1 transition-transform duration-300">
                                <p className="text-4xl font-black text-green-600 drop-shadow-sm">{stats.open}</p>
                                <p className="text-xs font-extrabold text-green-900 mt-2 uppercase tracking-widest flex items-center justify-center gap-1 bg-green-100 rounded-lg py-1 shadow-sm">
                                    <FiActivity /> Abiertos
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="anime-card bg-white/80 border-t-4 border-t-yellow-400 group hover:shadow-yellow-200/50">
                        <Card.Body className="p-4">
                            <div className="text-center group-hover:-translate-y-1 transition-transform duration-300">
                                <p className="text-4xl font-black text-yellow-600 drop-shadow-sm">{stats.inProgress}</p>
                                <p className="text-xs font-extrabold text-yellow-800 mt-2 uppercase tracking-widest flex items-center justify-center gap-1 bg-yellow-100 rounded-lg py-1 shadow-sm">
                                    <FiClock /> En Proceso
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="anime-card bg-white/80 border-t-4 border-t-purple-500 group hover:shadow-purple-200/50">
                        <Card.Body className="p-4">
                            <div className="text-center group-hover:-translate-y-1 transition-transform duration-300">
                                <p className="text-4xl font-black text-purple-600 drop-shadow-sm">{stats.resolved}</p>
                                <p className="text-xs font-extrabold text-purple-900 mt-2 uppercase tracking-widest flex items-center justify-center gap-1 bg-purple-100 rounded-lg py-1 shadow-sm">
                                    <FiCheckCircle /> Resueltos
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="anime-card bg-white/80 border-t-4 border-t-gray-500 group hover:shadow-gray-200/50">
                        <Card.Body className="p-4">
                            <div className="text-center group-hover:-translate-y-1 transition-transform duration-300">
                                <p className="text-4xl font-black text-gray-700 drop-shadow-sm">{stats.closed}</p>
                                <p className="text-xs font-extrabold text-gray-900 mt-2 uppercase tracking-widest flex items-center justify-center gap-1 bg-gray-200 rounded-lg py-1 shadow-sm">
                                    <FiArchive /> Cerrados
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mb-8">
                    <div className="bg-white/60 backdrop-blur-md px-6 py-2 rounded-2xl shadow-sm border border-white/50">
                        <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3 drop-shadow-sm">
                            <span className="bg-gradient-to-r from-gray-800 to-gray-600 text-transparent bg-clip-text">Mis Tickets</span>
                        </h2>
                    </div>

                    <Button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className={showCreateForm ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transform hover:scale-105 transition-all" : "btn-primary shadow-lg shadow-pink-500/20 transform hover:scale-105 transition-all"}
                    >
                        {showCreateForm ? (
                            <><FiX className="mr-2" /> Cancelar</>
                        ) : (
                            <><FiPlus className="mr-2 text-xl" /> Crear Ticket</>
                        )}
                    </Button>
                </div>

                {/* Create Form */}
                {showCreateForm && (
                    <div className="mb-10 animate-scale-in">
                        <Card className="anime-card bg-white/90 border-2 border-pink-200 shadow-2xl overflow-visible backdrop-blur-xl">
                            <Card.Header className="bg-gradient-to-r from-pink-100 to-purple-100 border-b border-pink-200 rounded-t-2xl p-4">
                                <h3 className="text-xl font-bold text-pink-800 flex items-center gap-2">
                                    ✨ Crear Nuevo Ticket
                                </h3>
                            </Card.Header>
                            <Card.Body className="p-6">
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
                    <div className="mb-6 bg-red-100/90 border-l-4 border-red-500 rounded-r-xl p-4 animate-fade-in-down shadow-lg backdrop-blur-md">
                        <p className="text-red-900 flex items-center gap-2 font-bold">
                            <FiX className="text-red-600 text-xl" /> {error}
                        </p>
                    </div>
                )}

                {/* Tickets List */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-2xl min-h-[300px] transition-all duration-500 hover:bg-white/75">
                    <TicketList
                        tickets={tickets}
                        basePath="/client"
                        loading={false}
                        emptyMessage="No tienes tickets creados. ¡Crea tu primer ticket para comenzar!"
                    />
                </div>
            </main>
        </div>
    );
}
