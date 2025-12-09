import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Rutas públicas que no requieren autenticación
    const publicPaths = ['/login', '/'];

    // Si es una ruta exactamente igual a "/" o "/login", permitir acceso
    if (pathname === '/' || pathname === '/login') {
        return NextResponse.next();
    }

    // Rutas de API - dejar que manejen su propia autenticación
    if (pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    // Extraer token de las cookies
    const token = request.cookies.get('token')?.value;

    // Si no hay token, redirigir a login
    if (!token) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // Verificar token con manejo de errores robusto
    try {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            console.error('JWT_SECRET no está configurado');
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }

        const payload = jwt.verify(token, secret) as { role: string };

        // Protección de rutas según rol
        if (pathname.startsWith('/client')) {
            if (payload.role !== 'client') {
                const url = request.nextUrl.clone();
                url.pathname = '/agent';
                return NextResponse.redirect(url);
            }
        }

        if (pathname.startsWith('/agent')) {
            if (payload.role !== 'agent') {
                const url = request.nextUrl.clone();
                url.pathname = '/client';
                return NextResponse.redirect(url);
            }
        }

        return NextResponse.next();
    } catch (error) {
        // Token inválido o expirado, redirigir a login
        console.error('Error verificando token:', error);
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }
}

// Configurar en qué rutas se ejecuta el middleware
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes - manejan su propia auth)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
