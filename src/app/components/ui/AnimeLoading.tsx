'use client';

interface AnimeLoadingProps {
    type?: 'thinking' | 'loading' | 'success' | 'error';
    message?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function AnimeLoading({
    type = 'loading',
    message,
    size = 'md'
}: AnimeLoadingProps) {
    const sizeClasses = {
        sm: 'w-16 h-16',
        md: 'w-24 h-24',
        lg: 'w-32 h-32'
    };

    // GIFs de anime para diferentes estados
    const loadingGifs = {
        thinking: 'https://media.tenor.com/1RN6M1vGP7UAAAAC/konata-lucky-star.gif', // Konata pensando
        loading: 'https://media.tenor.com/wpShtFFlPFcAAAAC/anime-loading.gif', // Loading genérico anime
        success: 'https://media.tenor.com/3dNZ0akRgBUAAAAC/anime-happy.gif', // Anime feliz
        error: 'https://media.tenor.com/TXl_dG8YQiQAAAAC/anime-sad.gif' // Anime triste
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3 p-4">
            <div className={`${sizeClasses[size]} relative animate-scale-in`}>
                <img
                    src={loadingGifs[type]}
                    alt="Loading..."
                    className="w-full h-full object-contain rounded-lg"
                />
            </div>
            {message && (
                <p className="text-sm text-gray-600 animate-pulse font-medium">
                    {message}
                </p>
            )}
        </div>
    );
}
