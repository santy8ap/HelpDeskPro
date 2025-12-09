'use client';

export default function AnimeBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Gradiente base */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50"></div>

            {/* Círculos flotantes animados */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl animate-float"></div>
            <div className="absolute top-40 right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-float-delayed"></div>
            <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-float-slow"></div>
            <div className="absolute bottom-40 right-1/3 w-64 h-64 bg-pink-300/20 rounded-full blur-2xl animate-float"></div>

            {/* Partículas pequeñas */}
            <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-pink-400/40 rounded-full animate-sparkle"></div>
            <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-purple-400/40 rounded-full animate-sparkle" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/3 left-1/2 w-5 h-5 bg-blue-400/40 rounded-full animate-sparkle" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-2/3 right-1/2 w-4 h-4 bg-pink-300/40 rounded-full animate-sparkle" style={{ animationDelay: '0.5s' }}></div>

            {/* Efecto de ondas sutiles */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-full h-full">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFB7D5" stopOpacity="0.1" />
                                <stop offset="50%" stopColor="#C3B1E1" stopOpacity="0.1" />
                                <stop offset="100%" stopColor="#A8D8EA" stopOpacity="0.1" />
                            </linearGradient>
                        </defs>
                        <path
                            fill="url(#wave-gradient)"
                            d="M0,160 Q250,200 500,160 T1000,160 L1000,0 L0,0 Z"
                            className="animate-wave"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}
