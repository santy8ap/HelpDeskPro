'use client';

import { useEffect, useState } from 'react';
import AnimeLoading from '@/app/components/ui/AnimeLoading';

export default function Template({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simular tiempo de carga mínimo de 2 segundos
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md transition-all duration-500">
                <div className="animate-bounce-slow">
                    <AnimeLoading
                        type="loading"
                        size="lg"
                        message="Cargando..."
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up">
            {children}
        </div>
    );
}
