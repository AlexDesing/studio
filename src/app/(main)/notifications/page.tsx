'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Trash2, Sparkles, Coffee } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { MOCK_TASKS } from '@/lib/constants'; 

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
  icon?: React.ElementType; // Optional icon
  category: 'Recordatorio' | 'Motivación' | 'Autocuidado' | 'Consejo';
}

const initialSettings: NotificationSetting[] = [
  { id: 'taskReminders', label: 'Recordatorios de Tareas', enabled: true },
  { id: 'dailyTips', label: 'Consejos Diarios', enabled: true },
  { id: 'affirmationReady', label: 'Afirmación Lista', enabled: true },
  { id: 'motivationalPhrases', label: 'Frases Motivacionales', enabled: true },
  { id: 'selfCareReminders', label: 'Recordatorios de Autocuidado', enabled: true },
];

// Enhanced mock notifications
const initialNotifications: NotificationItem[] = [
  { 
    id: '1', 
    title: 'Recordatorio de Tarea', 
    message: `Tu tarea "${MOCK_TASKS.find(t => t.id === '2')?.title || 'Planificar comidas'}" vence pronto. ¡Tú puedes!`, 
    timestamp: new Date(Date.now() - 3600000), 
    read: false,
    icon: Bell,
    category: 'Recordatorio'
  },
  { 
    id: '2', 
    title: '✨ ¡Frase del Día!', 
    message: 'La felicidad no es algo hecho. Proviene de tus propias acciones.', 
    timestamp: new Date(Date.now() - 7200000), 
    read: true,
    icon: Sparkles,
    category: 'Motivación'
  },
  { 
    id: '3', 
    title: '💖 Recordatorio de Autocuidado', 
    message: '¿Tomaste un momento para respirar hoy? Una pausa de 5 minutos puede hacer maravillas.', 
    timestamp: new Date(Date.now() - 10800000), 
    read: false,
    icon: Coffee,
    category: 'Autocuidado' 
  },
   { 
    id: '4', 
    title: '💡 Consejo Zen', 
    message: 'Organiza un pequeño rincón de tu hogar. Un espacio ordenado, una mente clara.', 
    timestamp: new Date(Date.now() - 14400000), 
    read: true,
    icon: Lightbulb,
    category: 'Consejo' 
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
     toast({
        title: "Notificación Leída",
        description: "Has marcado una notificación como leída."
    });
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

  const getCategoryColor = (category: NotificationItem['category']) => {
    switch(category) {
        case 'Recordatorio': return 'border-blue-500 bg-blue-500/10';
        case 'Motivación': return 'border-purple-500 bg-purple-500/10';
        case 'Autocuidado': return 'border-pink-500 bg-pink-500/10';
        case 'Consejo': return 'border-green-500 bg-green-500/10';
        default: return 'border-primary bg-primary/10';
    }
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <header className="mb-10 text-center">
         <div className="inline-flex items-center justify-center bg-primary/20 p-4 rounded-full mb-4">
          <Bell className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">Centro de Notificaciones</h1>
        <p className="text-lg text-muted-foreground mt-2">Gestiona tus alertas y mantente al tanto con mensajes inspiradores de CasaZen.</p>
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
           <CardFooter>
            <p className="text-xs text-muted-foreground">Nota: Las notificaciones son conceptuales para esta demo. Estos ajustes controlan las alertas dentro de la aplicación.</p>
          </CardFooter>
        </Card>

        <Card className="md:col-span-3 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Tus Mensajes Recientes</CardTitle>
                {notifications.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearAllNotifications} className="hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Borrar Todas
                    </Button>
                )}
            </div>
            <CardDescription>Tus últimas actualizaciones e inspiraciones de CasaZen.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[500px] overflow-y-auto p-4">
            {notifications.length > 0 ? (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-lg border-l-4 ${notif.read ? 'border-border bg-card-foreground/5 opacity-70' : getCategoryColor(notif.category)}`}
                >
                  <div className="flex items-start gap-3">
                    {notif.icon && <notif.icon className={`h-6 w-6 mt-1 ${notif.read ? 'text-muted-foreground' : 'text-primary'}`} />}
                    <div className="flex-grow">
                      <h4 className={`font-semibold ${notif.read ? 'text-muted-foreground' : 'text-foreground'}`}>{notif.title}</h4>
                      <p className={`text-sm ${notif.read ? 'text-muted-foreground/80' : 'text-foreground/90'}`}>{notif.message}</p>
                       <p className={`text-xs mt-1 ${notif.read ? 'text-muted-foreground/60' : 'text-foreground/70'}`}>
                        {notif.timestamp.toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})} - {notif.timestamp.toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    {!notif.read && (
                      <Button variant="ghost" size="sm" onClick={() => markAsRead(notif.id)} className="text-xs self-start">
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
                <p>¡Sigue interactuando con CasaZen para recibir mensajes!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
