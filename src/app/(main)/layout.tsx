'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from '@/components/ui/sidebar';
import AppLogo from '@/components/AppLogo';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Settings, LogOut } from 'lucide-react';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4">
          <div className="flex items-center justify-between">
            <AppLogo />
            <SidebarTrigger className="md:hidden" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">"Una mente sana refleja lo mejor"</p>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {NAV_ITEMS.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    asChild
                    isActive={item.match ? item.match(pathname) : pathname === item.href}
                    className={cn(
                      "justify-start w-full",
                       pathname === item.href ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    tooltip={{children: item.label, className: "group-data-[collapsible=icon]:block hidden"}}
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
        <SidebarFooter className="p-2">
          <SidebarMenu>
             <SidebarMenuItem>
                <SidebarMenuButton className="justify-start w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" tooltip={{children: "Settings", className: "group-data-[collapsible=icon]:block hidden"}}>
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton className="justify-start w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" tooltip={{children: "Log Out", className: "group-data-[collapsible=icon]:block hidden"}}>
                    <LogOut className="h-5 w-5" />
                    <span>Log Out</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex-1 bg-background">
        <div className="p-4 md:p-6">
         <div className="flex items-center justify-between mb-6 md:hidden">
            <AppLogo />
            <SidebarTrigger />
          </div>
          {children}
        </div>
      </SidebarInset>
    </div>
  );
}
