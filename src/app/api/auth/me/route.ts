import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { getUserFromRequest } from '@/app/lib/auth';
import { ApiResponse } from '@/app/types';

export async function GET(request: NextRequest) {
    try {
        const payload = await getUserFromRequest(request);

        if (!payload) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'No autorizado' },
                { status: 401 }
            );
        }

        await connectDB();

        const user = await User.findById(payload.userId);

        if (!user) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json<ApiResponse>({
            success: true,
            data: {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });

    } catch (error: any) {
        console.error('Error obteniendo usuario:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: error.message || 'Error del servidor' },
            { status: 500 }
        );
    }
}