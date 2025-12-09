import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Ticket from '@/app/models/Ticket';
import User from '@/app/models/User';
import { getUserFromRequest, isAgent, isClient } from '@/app/lib/auth';
import { sendTicketClosedEmail } from '@/app/lib/mail';
import { ApiResponse, UpdateTicketFormData } from '@/app/types';

interface Params {
    params: Promise<{ id: string }>;
}

// GET - Obtener ticket por ID
export async function GET(request: NextRequest, context: Params) {
    try {
        const { id } = await context.params;
        const payload = await getUserFromRequest(request);

        if (!payload) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'No autorizado' },
                { status: 401 }
            );
        }

        await connectDB();

        const ticket = await Ticket.findById(id)
            .populate('createdBy', 'name email role')
            .populate('assignedTo', 'name email role');

        if (!ticket) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Ticket no encontrado' },
                { status: 404 }
            );
        }

        // Cliente solo puede ver sus propios tickets
        const createdById = typeof ticket.createdBy === 'object' ? ticket.createdBy._id.toString() : ticket.createdBy.toString();
        if (isClient(payload) && createdById !== payload.userId) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'No autorizado para ver este ticket' },
                { status: 403 }
            );
        }

        return NextResponse.json<ApiResponse>({
            success: true,
            data: ticket,
        });

    } catch (error: any) {
        console.error('Error obteniendo ticket:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: error.message || 'Error obteniendo ticket' },
            { status: 500 }
        );
    }
}

// PUT - Actualizar ticket
export async function PUT(request: NextRequest, context: Params) {
    try {
        const { id } = await context.params;
        const payload = await getUserFromRequest(request);

        if (!payload) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'No autorizado' },
                { status: 401 }
            );
        }

        await connectDB();

        const body: UpdateTicketFormData = await request.json();
        const { status, priority, assignedTo } = body;

        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Ticket no encontrado' },
                { status: 404 }
            );
        }

        // Solo agentes pueden actualizar estado/prioridad/asignación
        if (isClient(payload)) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Solo agentes pueden actualizar tickets' },
                { status: 403 }
            );
        }

        // Guardar estado anterior para detectar cierre
        const wasNotClosed = ticket.status !== 'closed';

        // Actualizar campos
        if (status) ticket.status = status;
        if (priority) ticket.priority = priority;
        if (assignedTo !== undefined) {
            ticket.assignedTo = assignedTo || undefined;
        }

        await ticket.save();

        // Obtener ticket poblado
        const updatedTicket = await Ticket.findById(id)
            .populate('createdBy', 'name email')
            .populate('assignedTo', 'name email');

        // Si se cierra el ticket, enviar email
        if (status === 'closed' && wasNotClosed && updatedTicket) {
            const client = await User.findById(ticket.createdBy);
            if (client) {
                sendTicketClosedEmail(updatedTicket.toObject() as any, client.toObject() as any);
            }
        }

        return NextResponse.json<ApiResponse>({
            success: true,
            data: updatedTicket,
            message: 'Ticket actualizado exitosamente',
        });

    } catch (error: any) {
        console.error('Error actualizando ticket:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: error.message || 'Error actualizando ticket' },
            { status: 500 }
        );
    }
}

// DELETE - Eliminar ticket (opcional)
export async function DELETE(request: NextRequest, context: Params) {
    try {
        const { id } = await context.params;
        const payload = await getUserFromRequest(request);

        if (!payload || !isAgent(payload)) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'No autorizado' },
                { status: 401 }
            );
        }

        await connectDB();

        const ticket = await Ticket.findByIdAndDelete(id);

        if (!ticket) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Ticket no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json<ApiResponse>({
            success: true,
            message: 'Ticket eliminado exitosamente',
        });

    } catch (error: any) {
        console.error('Error eliminando ticket:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: error.message || 'Error eliminando ticket' },
            { status: 500 }
        );
    }
}