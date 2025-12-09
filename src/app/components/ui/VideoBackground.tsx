'use client';

export default function VideoBackground({ videoSrc = "/future-trunks-dbz.3840x2160.mp4" }: { videoSrc?: string }) {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Video de fondo */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-30"
            >
                <source src={videoSrc} type="video/mp4" />
            </video>

            {/* Overlay con gradiente para mejorar legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50/80 via-purple-50/80 to-blue-50/80"></div>
        </div>
    );
}
