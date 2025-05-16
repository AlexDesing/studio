
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
// SidebarProvider is removed from here, will be in /app/app/layout.tsx
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: 'MovaZen - Una mente sana refleja lo mejor',
  description: 'Tu asistente personal para la gestión del hogar, el bienestar y el amor propio.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${nunito.variable} antialiased font-sans`}>
        <AuthProvider>
          <AuthGuard> {/* AuthGuard wraps children here at the root level */}
            {children}
          </AuthGuard>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
