import mongoose, { Schema, Document, Model } from 'mongoose';
import { ITicket, TicketStatus, TicketPriority } from '@/app/types';

export interface ITicketDocument extends Omit<ITicket, '_id'>, Document { }

const TicketSchema = new Schema<ITicketDocument>(
    {
        title: {
            type: String,
            required: [true, 'El título es requerido'],
            trim: true,
            minlength: [5, 'El título debe tener al menos 5 caracteres'],
            maxlength: [100, 'El título no puede exceder 100 caracteres'],
        },
        description: {
            type: String,
            required: [true, 'La descripción es requerida'],
            trim: true,
            minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'El creador es requerido'],
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        status: {
            type: String,
            enum: ['open', 'in_progress', 'resolved', 'closed'] as TicketStatus[],
            default: 'open',
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'] as TicketPriority[],
            default: 'medium',
        },
    },
    {
        timestamps: true,
    }
);

// Índices para búsquedas eficientes
TicketSchema.index({ createdBy: 1 });
TicketSchema.index({ assignedTo: 1 });
TicketSchema.index({ status: 1 });
TicketSchema.index({ priority: 1 });
TicketSchema.index({ createdAt: -1 });

const Ticket: Model<ITicketDocument> = mongoose.models.Ticket || mongoose.model<ITicketDocument>('Ticket', TicketSchema);

export default Ticket;