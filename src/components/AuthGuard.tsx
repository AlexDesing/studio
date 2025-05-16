
'use client';

import type React from 'react';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const AUTH_ROUTES = ['/login', '/signup', '/forgot-password'];
const APP_PREFIX = '/app';
// The landing page '/' is now the main public route.
// Other explicit public routes can be added if necessary.
const PUBLIC_ROUTES: string[] = ['/']; 

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading, isManuallyCheckingAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isManuallyCheckingAuth) {
      const isAuthRoute = AUTH_ROUTES.includes(pathname);
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
      const isAppRoute = pathname.startsWith(APP_PREFIX);

      if (currentUser) {
        if (isAuthRoute) {
          // User is logged in and on an auth page (login/signup) -> redirect to app dashboard
          router.push(`${APP_PREFIX}/dashboard`);
        } else if (pathname === '/') {
           // User is logged in and on the landing page -> redirect to app dashboard
           router.push(`${APP_PREFIX}/dashboard`);
        }
        // If user is logged in and on an app route or other non-auth/non-landing public route, stay.
      } else { // No current user
        if (isAppRoute) {
          // User is not logged in and tries to access a protected app page -> redirect to login
          router.push('/login');
        }
        // If !currentUser and on auth route or public landing page, stay.
      }
    }
  }, [currentUser, loading, isManuallyCheckingAuth, router, pathname]);

  // Show loader while auth state is being determined or redirection is imminent
  if (loading || isManuallyCheckingAuth) {
     return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // Determine if a redirect is likely based on current logic, to avoid flash of content.
  // This is a simplified check and might need refinement for complex scenarios.
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isAppRoute = pathname.startsWith(APP_PREFIX);
  if (currentUser && (isAuthRoute || pathname === '/')) {
      return ( // Still show loader if a redirect to app is expected
          <div className="flex h-screen w-screen items-center justify-center bg-background">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      );
  }
  if (!currentUser && isAppRoute) {
       return ( // Still show loader if a redirect to login is expected
          <div className="flex h-screen w-screen items-center justify-center bg-background">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      );
  }

  return <>{children}</>;
};

export default AuthGuard;
