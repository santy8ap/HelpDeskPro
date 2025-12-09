export type UserRole = 'client' | 'agent';

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type TicketPriority = 'low' | 'medium' | 'high';


// INTERFACES DE ENTIDADES


export interface IUser {
    _id: string;
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

export interface ITicket {
    _id: string;
    title: string;
    description: string;
    createdBy: string | IUser;
    assignedTo?: string | IUser;
    status: TicketStatus;
    priority: TicketPriority;
    createdAt: Date;
    updatedAt: Date;
}

export interface IComment {
    _id: string;
    ticketId: string;
    author: string | IUser;
    message: string;
    createdAt: Date;
}


// INTERFACES DE FORMULARIOS


export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface CreateTicketFormData {
    title: string;
    description: string;
    priority: TicketPriority;
}

export interface UpdateTicketFormData {
    status?: TicketStatus;
    priority?: TicketPriority;
    assignedTo?: string;
}

export interface CreateCommentFormData {
    message: string;
}


// INTERFACES DE RESPUESTA API


export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface AuthResponse {
    user: IUser;
    token: string;
}


// CONTEXTO


export interface AuthContextType {
    user: IUser | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

// INTERFACES DE COMPONENTES UI


export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
    children: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
    className?: string;
}

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export interface InputProps {
    label?: string;
    error?: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    disabled?: boolean;
    name?: string;
}

export interface SelectProps {
    label?: string;
    error?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
    required?: boolean;
    disabled?: boolean;
    name?: string;
}


// FILTROS

export interface TicketFilters {
    status?: TicketStatus;
    priority?: TicketPriority;
    createdBy?: string;
    assignedTo?: string;
}