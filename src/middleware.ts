import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/app/lib/auth';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Rutas públicas que no requieren autenticación
    const publicPaths = ['/login', '/'];

    // Si es ruta pública, permitir acceso
    if (publicPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // Extraer token de las cookies o del header Authorization
    let token = request.cookies.get('token')?.value;

    if (!token) {
        const authHeader = request.headers.get('Authorization');
        if (authHeader?.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }

    // Si no hay token, redirigir a login
    if (!token) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // Verificar token
    const payload = verifyToken(token);

    if (!payload) {
        // Token inválido, redirigir a login
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // Protección de rutas según rol
    if (pathname.startsWith('/client')) {
        if (payload.role !== 'client') {
            // Si es agente intentando acceder a /client, redirigir a /agent
            const url = request.nextUrl.clone();
            url.pathname = '/agent';
            return NextResponse.redirect(url);
        }
    }

    if (pathname.startsWith('/agent')) {
        if (payload.role !== 'agent') {
            // Si es cliente intentando acceder a /agent, redirigir a /client
            const url = request.nextUrl.clone();
            url.pathname = '/client';
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

// Configurar en qué rutas se ejecuta el middleware
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
