import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Ticket from '@/app/models/Ticket';
import User from '@/app/models/User';
import { getUserFromRequest, isAgent, isClient } from '@/app/lib/auth';
import { sendTicketCreatedEmail } from '@/app/lib/mail';
import { ApiResponse, CreateTicketFormData, TicketFilters } from '@/app/types';

// GET - Listar tickets
export async function GET(request: NextRequest) {
    try {
        const payload = await getUserFromRequest(request);

        if (!payload) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'No autorizado' },
                { status: 401 }
            );
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const priority = searchParams.get('priority');

        // Construir filtro
        const filter: any = {};

        // Cliente solo ve sus tickets
        if (isClient(payload)) {
            filter.createdBy = payload.userId;
        }

        // Filtros opcionales
        if (status && status !== 'all') {
            filter.status = status;
        }
        if (priority && priority !== 'all') {
            filter.priority = priority;
        }

        const tickets = await Ticket.find(filter)
            .populate('createdBy', 'name email')
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 });

        return NextResponse.json<ApiResponse>({
            success: true,
            data: tickets,
        });

    } catch (error: any) {
        console.error('Error listando tickets:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: error.message || 'Error listando tickets' },
            { status: 500 }
        );
    }
}

// POST - Crear ticket
export async function POST(request: NextRequest) {
    try {
        const payload = await getUserFromRequest(request);

        if (!payload) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'No autorizado' },
                { status: 401 }
            );
        }

        await connectDB();

        const body: CreateTicketFormData = await request.json();
        const { title, description, priority } = body;

        // Validaciones
        if (!title || !description) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Título y descripción son requeridos' },
                { status: 400 }
            );
        }

        // Crear ticket
        const ticket = await Ticket.create({
            title,
            description,
            priority: priority || 'medium',
            createdBy: payload.userId,
            status: 'open',
        });

        // Obtener ticket poblado
        const populatedTicket = await Ticket.findById(ticket._id)
            .populate('createdBy', 'name email');

        // Enviar email de confirmación
        const user = await User.findById(payload.userId);
        if (user && populatedTicket) {
            sendTicketCreatedEmail(populatedTicket.toObject() as any, user.toObject() as any);
        }

        return NextResponse.json<ApiResponse>(
            {
                success: true,
                data: populatedTicket,
                message: 'Ticket creado exitosamente',
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Error creando ticket:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: error.message || 'Error creando ticket' },
            { status: 500 }
        );
    }
}