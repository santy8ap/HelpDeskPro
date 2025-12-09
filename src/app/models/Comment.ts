import mongoose, { Schema, Document, Model } from 'mongoose';
import { IComment } from '@/app/types';

export interface ICommentDocument extends Omit<IComment, '_id'>, Document { }

const CommentSchema = new Schema<ICommentDocument>(
    {
        ticketId: {
            type: String,
            required: [true, 'El ticketId es requerido'],
        },
        author: {
            type: String,
            required: [true, 'El autor es requerido'],
        },
        message: {
            type: String,
            required: [true, 'El mensaje es requerido'],
            trim: true,
            minlength: [1, 'El mensaje no puede estar vacío'],
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

// Índice para obtener comentarios por ticket eficientemente
CommentSchema.index({ ticketId: 1, createdAt: 1 });

const Comment: Model<ICommentDocument> = mongoose.models.Comment || mongoose.model<ICommentDocument>('Comment', CommentSchema);

export default Comment;