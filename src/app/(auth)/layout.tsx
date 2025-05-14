
import type React from 'react';
import AppLogo from '@/components/AppLogo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
      <div className="mb-8">
        <AppLogo iconSize={40} />
      </div>
      <main className="w-full max-w-md">
        {children}
      </main>
       <p className="mt-8 text-center text-sm text-muted-foreground">
        CasaZen: Una mente sana refleja lo mejor.
      </p>
    </div>
  );
}
