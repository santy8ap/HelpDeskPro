import jwt from 'jsonwebtoken';
import { IUser } from '@/app/types';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
    throw new Error('Por favor define JWT_SECRET en .env.local');
}

export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}

// Generar token JWT
export function generateToken(user: IUser): string {
    const payload: JwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Verificar token JWT
export function verifyToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
        return null;
    }
}

// Extraer token del header Authorization
export function getTokenFromHeader(request: NextRequest): string | null {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    return authHeader.substring(7);
}

// Obtener usuario del request
export async function getUserFromRequest(request: NextRequest): Promise<JwtPayload | null> {
    const token = getTokenFromHeader(request);

    if (!token) {
        return null;
    }

    return verifyToken(token);
}

// Verificar si es agente
export function isAgent(user: JwtPayload | null): boolean {
    return user?.role === 'agent';
}

// Verificar si es cliente
export function isClient(user: JwtPayload | null): boolean {
    return user?.role === 'client';
}