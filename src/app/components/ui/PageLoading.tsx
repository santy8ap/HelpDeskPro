'use client';

import AnimeLoading from './AnimeLoading';

interface PageLoadingProps {
    message?: string;
}

export default function PageLoading({ message = "Cargando..." }: PageLoadingProps) {
    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="anime-card p-8">
                <AnimeLoading type="thinking" message={message} size="lg" />
            </div>
        </div>
    );
}
