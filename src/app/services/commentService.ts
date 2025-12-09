import api from './api';
import { ApiResponse, IComment, CreateCommentFormData } from '@/app/types';

export const commentService = {
    // Obtener comentarios de un ticket
    async getComments(ticketId: string): Promise<IComment[]> {
        const response = await api.get<ApiResponse<IComment[]>>(`/tickets/${ticketId}/comments`);

        if (!response.data.success) {
            throw new Error(response.data.error || 'Error obteniendo comentarios');
        }

        return response.data.data || [];
    },

    // Agregar comentario
    async addComment(ticketId: string, data: CreateCommentFormData): Promise<IComment> {
        const response = await api.post<ApiResponse<IComment>>(
            `/tickets/${ticketId}/comments`,
            data
        );

        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.error || 'Error agregando comentario');
        }

        return response.data.data;
    },
};

export default commentService;