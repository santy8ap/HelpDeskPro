import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Comment from '@/app/models/Comment';
import Ticket from '@/app/models/Ticket';
import User from '@/app/models/User';
import { getUserFromRequest, isAgent, isClient } from '@/app/lib/auth';
import { sendAgentResponseEmail } from '@/app/lib/mail';
import { ApiResponse, CreateCommentFormData } from '@/app/types';

interface Params {
    params: Promise<{ id: string }>;
}

// GET - Obtener comentarios de un ticket
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

        // Verificar que el ticket existe
        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Ticket no encontrado' },
                { status: 404 }
            );
        }

        // Cliente solo puede ver comentarios de sus tickets
        if (isClient(payload) && ticket.createdBy.toString() !== payload.userId) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'No autorizado' },
                { status: 403 }
            );
        }

        const comments = await Comment.find({ ticketId: id })
            .populate('author', 'name email role')
            .sort({ createdAt: 1 });

        return NextResponse.json<ApiResponse>({
            success: true,
            data: comments,
        });

    } catch (error: any) {
        console.error('Error obteniendo comentarios:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: error.message || 'Error obteniendo comentarios' },
            { status: 500 }
        );
    }
}

// POST - Agregar comentario
export async function POST(request: NextRequest, context: Params) {
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

        const body: CreateCommentFormData = await request.json();
        const { message } = body;

        if (!message || !message.trim()) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'El mensaje es requerido' },
                { status: 400 }
            );
        }

        // Verificar ticket
        const ticket = await Ticket.findById(id)
            .populate('createdBy', 'name email');

        if (!ticket) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Ticket no encontrado' },
                { status: 404 }
            );
        }

        // Cliente solo puede comentar en sus tickets
        const createdById = typeof ticket.createdBy === 'object' ? ticket.createdBy._id.toString() : ticket.createdBy.toString();
        if (isClient(payload) && createdById !== payload.userId) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'No autorizado' },
                { status: 403 }
            );
        }

        // Crear comentario
        const comment = await Comment.create({
            ticketId: id,
            author: payload.userId,
            message: message.trim(),
        });

        const populatedComment = await Comment.findById(comment._id)
            .populate('author', 'name email role');

        // Si es agente respondiendo, cambiar estado y enviar email
        if (isAgent(payload) && ticket.status === 'open') {
            ticket.status = 'in_progress';
            if (!ticket.assignedTo) {
                ticket.assignedTo = payload.userId;
            }
            await ticket.save();
        }

        // Enviar email al cliente si es respuesta de agente
        if (isAgent(payload) && populatedComment) {
            const agent = await User.findById(payload.userId);
            const clientUser = ticket.createdBy as any;
            if (agent && clientUser) {
                sendAgentResponseEmail(
                    ticket.toObject() as any,
                    clientUser as any,
                    populatedComment.toObject() as any,
                    agent.name
                );
            }
        }

        return NextResponse.json<ApiResponse>(
            {
                success: true,
                data: populatedComment,
                message: 'Comentario agregado exitosamente',
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Error agregando comentario:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: error.message || 'Error agregando comentario' },
            { status: 500 }
        );
    }
}