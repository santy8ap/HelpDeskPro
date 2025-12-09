import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Permitir archivos estáticos y recursos de Next.js explícitamente
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') // Archivos con extensión (imágenes, videos, css, etc.)
    ) {
        return NextResponse.next();
    }

    // 2. Rutas públicas
    const publicPaths = ['/login', '/register', '/'];
    if (publicPaths.includes(pathname)) {
        return NextResponse.next();
    }

    // 3. Verificar Token
    const token = request.cookies.get('token')?.value;

    if (!token) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // 4. Decodificar rol del token (sin verificar firma para compatibilidad con Edge)
    try {
        // El payload es la segunda parte del JWT
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        const role = payload.role;

        // Protección de rutas según rol
        if (pathname.startsWith('/client') && role !== 'client') {
            const url = request.nextUrl.clone();
            url.pathname = '/agent';
            return NextResponse.redirect(url);
        }

        if (pathname.startsWith('/agent') && role !== 'agent') {
            const url = request.nextUrl.clone();
            url.pathname = '/client';
            return NextResponse.redirect(url);
        }

        return NextResponse.next();
    } catch (error) {
        // Si el token no es válido, redirigir a login
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }
}

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
