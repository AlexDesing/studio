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

// Mock initial state
const initialSettings: NotificationSetting[] = [
  { id: 'taskReminders', label: 'Task Reminders', enabled: true },
  { id: 'dailyTips', label: 'Daily Tips', enabled: true },
  { id: 'affirmationReady', label: 'Affirmation Ready', enabled: true },
  { id: 'aiResponse', label: 'AI Assistant Responses', enabled: false },
];

const initialNotifications: NotificationItem[] = [
  { id: '1', title: 'Task Reminder', message: 'Your task "Plan meals for the week" is due soon.', timestamp: new Date(Date.now() - 3600000), read: false },
  { id: '2', title: 'New Daily Tip!', message: 'Check out today\'s cleaning tip: Quick Clean Bathroom.', timestamp: new Date(Date.now() - 7200000), read: true },
  { id: '3', title: 'Affirmation Generated', message: 'Your personalized affirmation is ready!', timestamp: new Date(Date.now() - 10800000), read: false },
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
    setSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
    const changedSetting = settings.find(s => s.id === id);
    if (changedSetting) {
        toast({
            title: "Setting Updated",
            description: `${changedSetting.label} notifications ${!changedSetting.enabled ? "enabled" : "disabled"}.`
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
        title: "Notifications Cleared",
        description: "All notifications have been removed."
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
        <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground">Manage your alerts and stay updated with CasaZen.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Choose what you want to be notified about.</CardDescription>
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
                  aria-label={`Toggle ${setting.label} notifications`}
                />
              </div>
            ))}
          </CardContent>
           <CardFooter>
            <p className="text-xs text-muted-foreground">Note: Actual browser/push notifications are conceptual for this demo. These settings control in-app alerts.</p>
          </CardFooter>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>Recent Notifications</CardTitle>
                {notifications.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearAllNotifications}>
                        <Trash2 className="mr-2 h-4 w-4" /> Clear All
                    </Button>
                )}
            </div>
            <CardDescription>Your latest updates from CasaZen.</CardDescription>
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
                        Mark as read
                      </Button>
                    )}
                  </div>
                  <p className={`text-xs mt-1 ${notif.read ? 'text-muted-foreground/60' : 'text-primary-foreground/70'}`}>
                    {notif.timestamp.toLocaleTimeString()} - {notif.timestamp.toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-10">No new notifications.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
