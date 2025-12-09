import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '@/app/context/AuthContext';
import { ToastContainer } from 'react-toastify';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HelpDeskPro - Sistema de Tickets',
  description: 'Sistema de gestión de tickets de soporte técnico',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastClassName="!bg-white/90 !backdrop-blur-sm !border !border-pink-200/50 !rounded-xl !shadow-lg"
            progressClassName="!bg-gradient-to-r !from-pink-400 !to-purple-400"
          />
        </AuthProvider>
      </body>
    </html>
  );
}