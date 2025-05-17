
'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link'; 
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Trash2, Sparkles, Coffee, Lightbulb, Loader2, Save, BookOpen, Smile, Zap, CalendarDays } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserPreferences } from '@/lib/firebase/firestore/users';
import type { UserProfileData } from '@/lib/firebase/firestore/users';
import type { UserAppNotification } from '@/lib/types';
import { onUserAppNotificationsSnapshot, markUserNotificationAsRead } from '@/lib/firebase/firestore/userAppNotifications';
import * as LucideIcons from 'lucide-react';


interface NotificationSetting {
  id: keyof NonNullable<NonNullable<UserProfileData['preferences']>['notifications']>; 
  label: string;
  enabled: boolean;
}

const initialSettingLabels: Record<NotificationSetting['id'], string> = {
  taskReminders: 'Recordatorios de Tareas',
  dailyTips: 'Consejos Diarios',
  affirmationReady: 'Afirmación Lista',
  motivationalPhrases: 'Frases Motivacionales',
  selfCareReminders: 'Recordatorios de Autocuidado',
};

const iconMap: { [key in UserAppNotification['category'] | string]?: React.ElementType } = {
  Recordatorio: Bell,
  Motivación: Sparkles,
  Autocuidado: Smile,
  Consejo: Lightbulb,
  Logro: Award, // Assuming Award icon for Logro
  General: Bell,
};


export default function NotificationsPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [settings, setSettings] = useState<NotificationSetting[]>([]);
  const [notifications, setNotifications] = useState<UserAppNotification[]>([]); 
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentUser && !authLoading) {
      setIsLoadingSettings(true);
      const currentPrefs = currentUser.preferences?.notifications || {};
      const loadedSettings = (Object.keys(initialSettingLabels) as Array<NotificationSetting['id']>).map(key => ({
        id: key,
        label: initialSettingLabels[key],
        enabled: currentPrefs[key] !== undefined ? currentPrefs[key] : true, 
      }));
      setSettings(loadedSettings);
      setIsLoadingSettings(false);

      setIsLoadingNotifications(true);
      const unsubscribeNotifications = onUserAppNotificationsSnapshot(currentUser.uid, (fetchedNotifications) => {
        setNotifications(fetchedNotifications);
        setIsLoadingNotifications(false);
      });
      return () => {
        unsubscribeNotifications();
      };

    } else if (!currentUser && !authLoading) {
        setSettings([]); 
        setNotifications([]);
        setIsLoadingSettings(false);
        setIsLoadingNotifications(false);
    }
  }, [currentUser, authLoading]);


  const toggleSetting = (id: NotificationSetting['id']) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const handleSaveSettings = async () => {
    if (!currentUser) {
        toast({variant: "destructive", title: "Error", description: "Debes iniciar sesión."});
        return;
    }
    setIsSaving(true);
    const preferencesToSave = settings.reduce((acc, setting) => {
        acc[setting.id] = setting.enabled;
        return acc;
    }, {} as Record<NotificationSetting['id'], boolean>);

    try {
        const existingPreferences = currentUser.preferences || { notifications: {}, theme: 'light' };
        await updateUserPreferences(currentUser.uid, { 
            ...existingPreferences, 
            notifications: preferencesToSave 
        });
        toast({ title: "Ajustes Guardados", description: "Tus preferencias de notificación han sido actualizadas." });
    } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: `No se pudo guardar: ${error.message}` });
    } finally {
        setIsSaving(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    if (!currentUser) return;
    try {
      await markUserNotificationAsRead(currentUser.uid, id);
      // Optimistic update locally, or rely on onSnapshot to refresh
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
      toast({ title: "Notificación Leída", description: "Has marcado una notificación como leída." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: `No se pudo marcar como leída: ${error.message}` });
    }
  };
  
  const clearAllNotifications = async () => {
    // Note: True "clear all" would involve deleting from Firestore.
    // For now, this will just clear the local state for demo purposes.
    // A real implementation would need a batch delete operation on Firestore.
    setNotifications([]);
    toast({ title: "Notificaciones Borradas (Vista Local)", description: "La eliminación real requeriría una función de backend." });
  };
  
  const getCategoryColor = (category: UserAppNotification['category']) => {
    switch(category) {
        case 'Recordatorio': return 'border-blue-500 bg-blue-500/10';
        case 'Motivación': return 'border-purple-500 bg-purple-500/10';
        case 'Autocuidado': return 'border-pink-500 bg-pink-500/10';
        case 'Consejo': return 'border-green-500 bg-green-500/10';
        case 'Logro': return 'border-yellow-500 bg-yellow-500/10';
        default: return 'border-border bg-muted/10'; 
    }
  };
  
  const getIconColorClass = (read: boolean) => {
    return read ? 'text-muted-foreground' : 'text-highlight-purple';
  };

  const RenderNotificationIcon = ({ iconName, read }: { iconName?: keyof typeof LucideIcons, read: boolean }) => {
    const ResolvedIcon = iconName ? LucideIcons[iconName] as React.ElementType : Bell;
    return <ResolvedIcon className={`h-6 w-6 mt-1 ${getIconColorClass(read)}`} />;
  };


  if (authLoading || isLoadingSettings) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }
  if (!currentUser && !authLoading) {
     return (
        <div className="mx-auto w-full max-w-2xl text-center py-20">
            <h1 className="text-2xl font-semibold">Centro de Notificaciones</h1>
            <p className="text-muted-foreground mb-4">Inicia sesión para gestionar tus alertas y mensajes.</p>
            <Button asChild><Link href="/login">Iniciar Sesión</Link></Button>
        </div>
    );
  }


  return (
    <div className="w-full max-w-5xl px-6 ml-[calc(max(0px,50vw-40rem))]"> 
      <header className="mb-10 text-center">
         <div className="inline-flex items-center justify-center bg-primary/20 p-4 rounded-full mb-4">
          <Bell className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">Centro de Notificaciones</h1>
        <p className="text-lg text-muted-foreground mt-2">Gestiona tus alertas y mantente al tanto con mensajes inspiradores de MovaZen.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <Card className="md:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Ajustes de Notificación</CardTitle>
            <CardDescription>Elige qué tipo de mensajes quieres recibir.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.map(setting => (
              <div key={setting.id} className="flex items-center justify-between p-3 bg-card-foreground/5 rounded-lg">
                <Label htmlFor={setting.id} className="text-base font-medium text-foreground cursor-pointer">
                  {setting.label}
                </Label>
                <Switch
                  id={setting.id}
                  checked={setting.enabled}
                  onCheckedChange={() => toggleSetting(setting.id)}
                  aria-label={`Activar/Desactivar notificaciones de ${setting.label}`}
                />
              </div>
            ))}
          </CardContent>
           <CardFooter className="flex-col items-start space-y-2">
             <Button onClick={handleSaveSettings} disabled={isSaving} className="w-full">
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4"/>}
                Guardar Ajustes
            </Button>
            <p className="text-xs text-muted-foreground">Nota: Las notificaciones push reales requieren configuración de servidor (Cloud Functions). Estos ajustes controlan las preferencias para futuras implementaciones.</p>
          </CardFooter>
        </Card>

        <Card className="md:col-span-3 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Tus Mensajes Recientes</CardTitle>
                {notifications.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearAllNotifications} className="hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Borrar Todas (Local)
                    </Button>
                )}
            </div>
            <CardDescription>Tus últimas actualizaciones e inspiraciones de MovaZen.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[500px] overflow-y-auto p-4">
            {isLoadingNotifications ? (
                <div className="flex justify-center items-center h-32"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>
            ) : notifications.length > 0 ? (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-lg border-l-4 ${notif.read ? 'border-border bg-card-foreground/5 opacity-70' : getCategoryColor(notif.category)}`}
                >
                  <div className="flex items-start gap-3">
                    <RenderNotificationIcon iconName={notif.icon || iconMap[notif.category]} read={notif.read} />
                    <div className="flex-grow">
                      <h4 className={`font-semibold ${notif.read ? 'text-muted-foreground' : 'text-foreground'}`}>{notif.title}</h4>
                      <p className={`text-sm ${notif.read ? 'text-muted-foreground/80' : 'text-foreground/90'}`}>{notif.message}</p>
                       <p className={`text-xs mt-1 ${notif.read ? 'text-muted-foreground/60' : 'text-foreground/70'}`}>
                        {notif.createdAt.toDate().toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})} - {notif.createdAt.toDate().toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    {!notif.read && (
                      <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notif.id)} className="text-xs self-start">
                        Marcar leída
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="mx-auto h-12 w-12 mb-3 text-primary/50" />
                <p className="text-lg">No hay notificaciones nuevas por ahora.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
