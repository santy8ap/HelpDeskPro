import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { generateToken } from '@/app/lib/auth';
import { ApiResponse, LoginFormData } from '@/app/types';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body: LoginFormData = await request.json();
        const { email, password } = body;

        // Validaciones
        if (!email || !password) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Email y contraseña son requeridos' },
                { status: 400 }
            );
        }

        // Buscar usuario con password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Credenciales inválidas' },
                { status: 401 }
            );
        }

        // Verificar contraseña
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Credenciales inválidas' },
                { status: 401 }
            );
        }

        // Generar token
        const token = generateToken({
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });

        // Respuesta sin password
        const userResponse = {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        const response = NextResponse.json<ApiResponse>(
            {
                success: true,
                data: { user: userResponse, token },
                message: 'Login exitoso',
            },
            { status: 200 }
        );

        // Establecer cookie para el middleware
        response.cookies.set('token', token, {
            httpOnly: false, // Permitir acceso desde cliente si es necesario
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 semana
            path: '/',
        });

        return response;

    } catch (error: any) {
        console.error('Error en login:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: error.message || 'Error en el login' },
            { status: 500 }
        );
    }
}