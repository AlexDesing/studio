
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarFooter,
  SidebarProvider, // Ensure SidebarProvider is imported
} from '@/components/ui/sidebar';
import AppLogo from '@/components/AppLogo';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { logout as firebaseLogout } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await firebaseLogout();
      toast({ title: "Sesión Cerrada", description: "Has cerrado sesión correctamente." });
      router.push('/login'); // Redirect to login after logout
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo cerrar sesión." });
    }
  };
  
  const getInitials = (name: string | null | undefined) => {
    if (!name || name.trim() === '') return 'MZ'; 
    const names = name.trim().split(' ').filter(part => part.length > 0);
    if (names.length === 0) return 'MZ';
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
  };

  return (
    <SidebarProvider defaultOpen={true}> {/* SidebarProvider wraps the entire layout */}
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon">
          <SidebarHeader className="p-4">
            <div className="flex items-center justify-between">
              {/* Ensure this links to the new dashboard path if (main) is truly obsolete, or keep as is if it's a distinct section */}
              <Link href="/app/dashboard" passHref> 
                <AppLogo />
              </Link>
              <SidebarTrigger className="md:hidden" />
            </div>
            <p className="text-xs text-muted-foreground mt-1 group-data-[collapsible=icon]:hidden">"Una mente sana refleja lo mejor"</p>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => ( // NAV_ITEMS should point to /app/... paths
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton
                      asChild
                      isActive={item.match ? item.match(pathname) : pathname === item.href}
                      className={cn(
                        "justify-start w-full",
                        (item.match ? item.match(pathname) : pathname === item.href) ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                      tooltip={{ children: item.label, className: "group-data-[collapsible=icon]:block hidden" }}
                    >
                      <a>
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-2 border-t border-sidebar-border">
            {currentUser && (
                 <div className="p-2 group-data-[collapsible=icon]:hidden">
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || 'Usuario'} />
                            <AvatarFallback>{getInitials(currentUser.displayName)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium text-sidebar-foreground truncate">{currentUser.displayName || "Usuario"}</p>
                            <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                        </div>
                    </div>
                </div>
            )}
             <SidebarMenuItem>
                   {/* Ensure this links to the new settings path if (main) is truly obsolete */}
                  <Link href="/app/settings" passHref legacyBehavior>
                    <SidebarMenuButton className="justify-start w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" tooltip={{children: "Configuración", className: "group-data-[collapsible=icon]:block hidden"}}>
                        <Settings className="h-5 w-5" />
                        <span>Configuración</span>
                    </SidebarMenuButton>
                  </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleLogout} className="justify-start w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" tooltip={{children: "Cerrar Sesión", className: "group-data-[collapsible=icon]:block hidden"}}>
                      <LogOut className="h-5 w-5" />
                      <span>Cerrar Sesión</span>
                  </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1 bg-background">
          <div className="py-4 md:py-6 w-full"> 
            <div className="flex items-center justify-between mb-6 md:hidden px-4"> 
               {/* Ensure this links to the new dashboard path if (main) is truly obsolete */}
              <Link href="/app/dashboard" passHref>
                <AppLogo />
              </Link>
              <SidebarTrigger />
            </div>
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
