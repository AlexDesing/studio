
'use client';

import type React from 'react';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext'; // Updated import
import { Loader2 } from 'lucide-react';

const AUTH_ROUTES = ['/login', '/signup', '/forgot-password'];
const PUBLIC_ROUTES: string[] = []; // Add any public routes not requiring auth, e.g. '/about'

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading, isManuallyCheckingAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isManuallyCheckingAuth) {
      const isAuthRoute = AUTH_ROUTES.includes(pathname);
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

      if (currentUser && isAuthRoute) {
        // If user is logged in and tries to access auth pages, redirect to home
        router.push('/');
      } else if (!currentUser && !isAuthRoute && !isPublicRoute) {
        // If user is not logged in and tries to access a protected page, redirect to login
        router.push('/login');
      }
    }
  }, [currentUser, loading, isManuallyCheckingAuth, router, pathname]);

  if (loading || isManuallyCheckingAuth) {
     return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // Allow access if:
  // 1. User is logged in (and not on an auth route, handled by redirect above)
  // 2. User is not logged in but is on an auth route or a public route
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (currentUser || isAuthRoute || isPublicRoute) {
    return <>{children}</>;
  }
  
  // Fallback, should ideally be caught by loader or useEffect redirect
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
};

export default AuthGuard;
