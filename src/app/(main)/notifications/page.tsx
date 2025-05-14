'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { MOCK_TASKS, MOCK_TIPS } from '@/lib/constants'; // For mock notification content

interface NotificationSetting {
  id: string;
  label: string;
  enabled: boolean;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Mock initial state with Spanish text
const initialSettings: NotificationSetting[] = [
  { id: 'taskReminders', label: 'Recordatorios de Tareas', enabled: true },
  { id: 'dailyTips', label: 'Consejos Diarios', enabled: true },
  { id: 'affirmationReady', label: 'Afirmación Lista', enabled: true },
  { id: 'aiResponse', label: 'Respuestas del Asistente IA', enabled: false },
];

const initialNotifications: NotificationItem[] = [
  { 
    id: '1', 
    title: 'Recordatorio de Tarea', 
    message: `Tu tarea "${MOCK_TASKS.find(t => t.id === '2')?.title || 'Planificar comidas'}" vence pronto.`, 
    timestamp: new Date(Date.now() - 3600000), 
    read: false 
  },
  { 
    id: '2', 
    title: '¡Nuevo Consejo Diario!', 
    message: `Echa un vistazo al consejo de limpieza de hoy: ${MOCK_TIPS.cleaning.find(t => t.id === 'c1')?.title || 'Limpieza Rápida de Baño'}.`, 
    timestamp: new Date(Date.now() - 7200000), 
    read: true 
  },
  { 
    id: '3', 
    title: 'Afirmación Generada', 
    message: '¡Tu afirmación personalizada está lista!', 
    timestamp: new Date(Date.now() - 10800000), 
    read: false 
  },
];


export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSetting[]>(initialSettings);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleSetting = (id: string) => {
    let changedSettingLabel = '';
    let newEnabledState = false;

    setSettings(prev =>
      prev.map(setting => {
        if (setting.id === id) {
          changedSettingLabel = setting.label;
          newEnabledState = !setting.enabled;
          return { ...setting, enabled: newEnabledState };
        }
        return setting;
      })
    );
    
    if (changedSettingLabel) {
        toast({
            title: "Configuración Actualizada",
            description: `Notificaciones de ${changedSettingLabel} ${newEnabledState ? "activadas" : "desactivadas"}.`
        });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
    toast({
        title: "Notificaciones Borradas",
        description: "Todas las notificaciones han sido eliminadas."
    });
  };

  if (!isMounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <div className="container mx-auto max-w-3xl">
      <header className="mb-8 text-center">
         <div className="inline-flex items-center justify-center bg-primary/20 p-3 rounded-full mb-3">
          <Bell className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Notificaciones</h1>
        <p className="text-muted-foreground">Gestiona tus alertas y mantente al día con CasaZen.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Configuración de Notificaciones</CardTitle>
            <CardDescription>Elige sobre qué quieres recibir notificaciones.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.map(setting => (
              <div key={setting.id} className="flex items-center justify-between p-3 bg-card-foreground/5 rounded-md">
                <Label htmlFor={setting.id} className="text-sm font-medium text-foreground">
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
           <CardFooter>
            <p className="text-xs text-muted-foreground">Nota: Las notificaciones reales del navegador/push son conceptuales para esta demostración. Estos ajustes controlan las alertas dentro de la aplicación.</p>
          </CardFooter>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>Notificaciones Recientes</CardTitle>
                {notifications.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearAllNotifications}>
                        <Trash2 className="mr-2 h-4 w-4" /> Borrar Todas
                    </Button>
                )}
            </div>
            <CardDescription>Tus últimas actualizaciones de CasaZen.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-md border ${notif.read ? 'border-border bg-card-foreground/5' : 'border-primary bg-primary/10'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`font-semibold ${notif.read ? 'text-muted-foreground' : 'text-primary-foreground'}`}>{notif.title}</h4>
                      <p className={`text-sm ${notif.read ? 'text-muted-foreground/80' : 'text-primary-foreground/90'}`}>{notif.message}</p>
                    </div>
                    {!notif.read && (
                      <Button variant="ghost" size="sm" onClick={() => markAsRead(notif.id)}>
                        Marcar como leída
                      </Button>
                    )}
                  </div>
                  <p className={`text-xs mt-1 ${notif.read ? 'text-muted-foreground/60' : 'text-primary-foreground/70'}`}>
                    {notif.timestamp.toLocaleTimeString('es-ES')} - {notif.timestamp.toLocaleDateString('es-ES')}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-10">No hay notificaciones nuevas.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
