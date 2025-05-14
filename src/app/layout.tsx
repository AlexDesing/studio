
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard'; // Import AuthGuard

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: 'CasaZen - Una mente sana refleja lo mejor',
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
          <AuthGuard> {/* AuthGuard envuelve a los children aquí */}
            <SidebarProvider defaultOpen={true}>
              {children}
            </SidebarProvider>
            <Toaster />
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
