'use client';

export default function VideoBackground({ videoSrc = "/future-trunks-dbz.3840x2160.mp4" }: { videoSrc?: string }) {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
            {/* Video de fondo */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                key={videoSrc} // Forzar recarga si cambia el src
            >
                <source src={videoSrc} type="video/mp4" />
                Tu navegador no soporta el elemento de video.
            </video>

            {/* Overlay sutil para mejorar contraste sin ocultar el video */}
            <div className="absolute inset-0 bg-black/20"></div>
        </div>
    );
}
