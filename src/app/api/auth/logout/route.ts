import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json(
        { success: true, message: 'Sesión cerrada exitosamente' },
        { status: 200 }
    );

    // Eliminar cookie
    response.cookies.set('token', '', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0, // Expirar inmediatamente
        path: '/',
    });

    return response;
}
