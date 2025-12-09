import React from 'react';
import VideoBackground from '@/app/components/ui/VideoBackground';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen w-full overflow-hidden font-sans">
            {/* Video de fondo */}
            <VideoBackground videoSrc="/future-trunks-dbz.3840x2160.mp4" />

            {/* Contenedor principal para alinear el contenido a la izquierda */}
            <div className="relative z-10 min-h-screen flex items-center justify-start px-4 sm:px-8 md:px-16 lg:px-24">
                {/* El contenido (Login/Register) se renderizará aquí */}
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
}
