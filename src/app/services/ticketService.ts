import api from './api';
import {
    ApiResponse,
    ITicket,
    CreateTicketFormData,
    UpdateTicketFormData,
    TicketFilters
} from '@/app/types';

export const ticketService = {
    // Listar tickets
    async getTickets(filters?: TicketFilters): Promise<ITicket[]> {
        const params = new URLSearchParams();

        if (filters?.status) params.append('status', filters.status);
        if (filters?.priority) params.append('priority', filters.priority);

        const response = await api.get<ApiResponse<ITicket[]>>(`/tickets?${params}`);

        if (!response.data.success) {
            throw new Error(response.data.error || 'Error obteniendo tickets');
        }

        return response.data.data || [];
    },

    // Obtener ticket por ID
    async getTicketById(id: string): Promise<ITicket> {
        const response = await api.get<ApiResponse<ITicket>>(`/tickets/${id}`);

        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.error || 'Error obteniendo ticket');
        }

        return response.data.data;
    },

    // Crear ticket
    async createTicket(data: CreateTicketFormData): Promise<ITicket> {
        const response = await api.post<ApiResponse<ITicket>>('/tickets', data);

        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.error || 'Error creando ticket');
        }

        return response.data.data;
    },

    // Actualizar ticket
    async updateTicket(id: string, data: UpdateTicketFormData): Promise<ITicket> {
        const response = await api.put<ApiResponse<ITicket>>(`/tickets/${id}`, data);

        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.error || 'Error actualizando ticket');
        }

        return response.data.data;
    },

    // Eliminar ticket
    async deleteTicket(id: string): Promise<void> {
        const response = await api.delete<ApiResponse>(`/tickets/${id}`);

        if (!response.data.success) {
            throw new Error(response.data.error || 'Error eliminando ticket');
        }
    },
};

export default ticketService;