import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { getUserFromRequest, isAgent } from '@/app/lib/auth';
import { ApiResponse } from '@/app/types';

export const dynamic = 'force-dynamic';

// GET - Listar agentes (para asignación)
export async function GET(request: NextRequest) {
    try {
        const payload = await getUserFromRequest(request);

        if (!payload || !isAgent(payload)) {
            return NextResponse.json<ApiResponse>(
                { success: false, error: 'No autorizado' },
                { status: 401 }
            );
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role') || 'agent';

        const users = await User.find({ role })
            .select('name email role')
            .sort({ name: 1 });

        return NextResponse.json<ApiResponse>({
            success: true,
            data: users,
        });

    } catch (error: any) {
        console.error('Error listando usuarios:', error);
        return NextResponse.json<ApiResponse>(
            { success: false, error: error.message || 'Error listando usuarios' },
            { status: 500 }
        );
    }
}