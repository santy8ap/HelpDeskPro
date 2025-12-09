import React from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full relative font-sans">
            {/* Imagen de fondo fija */}
            <div className="fixed inset-0 -z-10">
                <img
                    src="/dragonz.jpg"
                    alt="Anime Clouds Background"
                    className="w-full h-full object-cover"
                />
                {/* Overlay sutil para mejorar la legibilidad del contenido */}
                <div className="absolute inset-0 bg-white/10"></div>
            </div>

            {/* Contenido del dashboard */}
            <div className="relative z-10">
                {children}

                {/* Mascota flotante */}
                <div className="fixed bottom-4 right-4 z-50 hidden xl:block animate-bounce-slow hover:animate-pulse cursor-help group">
                    <div className="relative">
                        <img
                            src="https://media1.tenor.com/m/2ZuUWp5LDfIAAAAC/konata-lucky-star.gif"
                            alt="Mascot"
                            className="w-24 h-24 object-contain drop-shadow-xl"
                        />
                        <div className="absolute -top-12 -left-32 bg-white/90 backdrop-blur px-3 py-2 rounded-xl rounded-br-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs text-gray-700 font-bold border border-pink-200">
                            ¿Necesitas ayuda? ¡Crea un ticket!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
