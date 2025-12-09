import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { generateToken } from '@/app/lib/auth';
import { ApiResponse, RegisterFormData } from '@/app/types';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body: RegisterFormData = await request.json();
        const { name, email, password, role } = body;

        // Validaciones
        if (!name || !email || !password) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Todos los campos son requeridos' },
                { status: 400 }
            );
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'El email ya está registrado' },
                { status: 400 }
            );
        }

        // Crear usuario
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'client',
        });

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

        return NextResponse.json<ApiResponse>(
            {
                success: true,
                data: { user: userResponse, token },
                message: 'Usuario registrado exitosamente',
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Error en registro:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: error.message || 'Error al registrar usuario' },
            { status: 500 }
        );
    }
}