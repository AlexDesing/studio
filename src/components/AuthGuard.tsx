
'use client';

import type React from 'react';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import CustomLoader from '@/components/CustomLoader'; // Import CustomLoader

const AUTH_ROUTES = ['/login', '/signup', '/forgot-password'];
const APP_PREFIX = '/app';
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
          router.push(`${APP_PREFIX}/dashboard`);
        } else if (pathname === '/') {
           router.push(`${APP_PREFIX}/dashboard`);
        }
      } else { 
        if (isAppRoute) {
          router.push('/login');
        }
      }
    }
  }, [currentUser, loading, isManuallyCheckingAuth, router, pathname]);

  if (loading || isManuallyCheckingAuth) {
     return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <CustomLoader /> {/* Use CustomLoader */}
      </div>
    );
  }
  
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isAppRoute = pathname.startsWith(APP_PREFIX);
  if (currentUser && (isAuthRoute || pathname === '/')) {
      return ( 
          <div className="flex h-screen w-screen items-center justify-center bg-background">
              <CustomLoader /> {/* Use CustomLoader */}
          </div>
      );
  }
  if (!currentUser && isAppRoute) {
       return ( 
          <div className="flex h-screen w-screen items-center justify-center bg-background">
              <CustomLoader /> {/* Use CustomLoader */}
          </div>
      );
  }

  return <>{children}</>;
};

export default AuthGuard;
