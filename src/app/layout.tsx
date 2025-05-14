import type { Metadata } from 'next';
import { Nunito } from 'next/font/google'; // Changed from Inter to Nunito
import './globals.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';

const nunito = Nunito({ // Changed from Inter to Nunito
  subsets: ['latin'],
  variable: '--font-nunito', // Changed from --font-inter
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
      <body className={`${nunito.variable} antialiased font-sans`}> {/* Changed from inter.variable */}
        <SidebarProvider defaultOpen={true}>
          {children}
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
