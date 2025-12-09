import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Ticket from '@/app/models/Ticket';
import Comment from '@/app/models/Comment';
import User from '@/app/models/User';
import { sendReminderEmail } from '@/app/lib/mail';
import { ApiResponse } from '@/app/types';

// Esta ruta debe ser llamada por un cron job externo (Vercel Cron)
export async function GET(request: NextRequest) {
    try {
        // Verificar clave secreta para seguridad
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get('secret');

        if (secret !== process.env.CRON_SECRET) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'No autorizado' },
                { status: 401 }
            );
        }

        await connectDB();

        // Buscar tickets sin respuesta en las últimas 24 horas
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        // Tickets abiertos o en progreso sin comentarios recientes
        const ticketsToCheck = await Ticket.find({
            status: { $in: ['open', 'in_progress'] },
            createdAt: { $lte: twentyFourHoursAgo },
        }).populate('assignedTo', 'name email');

        let remindersent = 0;

        for (const ticket of ticketsToCheck) {
            // Verificar si tiene comentarios de agente
            const lastAgentComment = await Comment.findOne({
                ticketId: ticket._id.toString(),
            }).populate('author', 'role').sort({ createdAt: -1 });

            // Si no hay comentarios o el último no es de agente en 24h
            const needsReminder = !lastAgentComment ||
                (lastAgentComment.author as any).role !== 'agent' ||
                lastAgentComment.createdAt < twentyFourHoursAgo;

            if (needsReminder) {
                // Obtener agentes para enviar recordatorio
                const agents = await User.find({ role: 'agent' });

                for (const agent of agents) {
                    await sendReminderEmail(ticket.toObject() as any, agent.toObject() as any);
                    remindersent++;
                }
            }
        }

        return NextResponse.json<ApiResponse>({
            success: true,
            message: `${remindersent} recordatorios enviados`,
        });

    } catch (error: any) {
        console.error('Error en cron de recordatorios:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}