'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function HomePage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && user) {
        // Redirigir según rol
        router.push(user.role === 'agent' ? '/agent' : '/client');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce"></div>
        <p className="text-gray-500">Cargando HelpDeskPro...</p>
      </div>
    </div>
  );
}