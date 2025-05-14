
'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserCircle, ImageUp, Save, Palette, BellRing } from 'lucide-react';
import { updateUserProfileDocument, type UserProfileData } from '@/lib/firebase/firestore/users';
import { uploadUserAvatar } from '@/lib/firebase/storage';
import { auth } from '@/lib/firebase/config'; // For direct Firebase User object
import { updateFirebaseProfile } from '@/lib/firebase/auth'; // For updating Auth user profile

export default function SettingsPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [displayName, setDisplayName] = useState('');
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [theme, setTheme] = useState('light'); // Example, load from currentUser.preferences.theme

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setAvatarPreview(currentUser.photoURL || null);
      setTheme(currentUser.preferences?.theme || 'light');
    }
  }, [currentUser]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setNewAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser || !auth.currentUser) {
      toast({ variant: 'destructive', title: 'Error', description: 'Debes estar autenticado.' });
      return;
    }
    setIsSavingProfile(true);
    try {
      let photoURL = currentUser.photoURL;
      if (newAvatarFile) {
        photoURL = await uploadUserAvatar(currentUser.uid, newAvatarFile);
      }

      const profileUpdateData: Partial<UserProfileData> = {};
      if (displayName !== currentUser.displayName) {
        profileUpdateData.displayName = displayName;
      }
      if (photoURL && photoURL !== currentUser.photoURL) {
        profileUpdateData.photoURL = photoURL;
      }

      if (Object.keys(profileUpdateData).length > 0) {
        // Update Firebase Auth profile
        await updateFirebaseProfile(auth.currentUser, { displayName: profileUpdateData.displayName, photoURL: profileUpdateData.photoURL });
        // Update Firestore document
        await updateUserProfileDocument(currentUser.uid, profileUpdateData);
      }
      
      toast({ title: 'Perfil Actualizado', description: 'Tus cambios han sido guardados.' });
      // Optionally force re-fetch of currentUser in AuthContext or optimistically update
    } catch (error: any) {
      console.error("Error updating profile: ", error);
      toast({ variant: 'destructive', title: 'Error', description: `No se pudo actualizar el perfil: ${error.message}` });
    } finally {
      setIsSavingProfile(false);
      setNewAvatarFile(null); // Clear file after attempt
    }
  };

  // Placeholder for saving preferences
  const handleSavePreferences = async () => {
    if (!currentUser) return;
    setIsSavingPreferences(true);
    // Example: await updateUserPreferences(currentUser.uid, { notifications: {...}, theme });
    toast({ title: 'Preferencias Guardadas (Simulado)', description: 'Tus preferencias se han guardado.' });
    setIsSavingPreferences(false);
  };
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'CZ';
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
  };


  if (authLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!currentUser) {
    return <div className="text-center py-10">Por favor, inicia sesión para ver tu configuración.</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl space-y-10">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-foreground">Configuración de la Cuenta</h1>
        <p className="text-muted-foreground">Personaliza tu experiencia en CasaZen.</p>
      </header>

      {/* Profile Settings Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <UserCircle className="h-7 w-7 text-primary" />
            <CardTitle className="text-xl">Información del Perfil</CardTitle>
          </div>
          <CardDescription>Actualiza tu nombre y foto de perfil.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <AvatarImage src={avatarPreview || undefined} alt={displayName} />
              <AvatarFallback className="text-3xl">{getInitials(displayName)}</AvatarFallback>
            </Avatar>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              className="hidden"
            />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <ImageUp className="mr-2 h-4 w-4" /> Cambiar Avatar
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="displayName">Nombre para Mostrar</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Tu nombre"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveProfile} disabled={isSavingProfile} className="ml-auto">
            {isSavingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar Cambios de Perfil
          </Button>
        </CardFooter>
      </Card>

      {/* Preferences Card - Example */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
             <Palette className="h-7 w-7 text-secondary" />
            <CardTitle className="text-xl">Preferencias de Apariencia</CardTitle>
          </div>
          <CardDescription>Elige cómo se ve CasaZen para ti.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Theme selection example */}
          <div className="space-y-2">
            <Label htmlFor="theme">Tema</Label>
            <select 
              id="theme" 
              value={theme} 
              onChange={(e) => setTheme(e.target.value)}
              className="w-full p-2 border rounded-md bg-input"
            >
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
              <option value="system">Automático (Sistema)</option>
            </select>
             <p className="text-xs text-muted-foreground">La implementación del cambio de tema requiere lógica adicional en `globals.css` y `RootLayout`.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSavePreferences} disabled={isSavingPreferences} className="ml-auto" variant="secondary">
            {isSavingPreferences ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar Preferencias (Simulado)
          </Button>
        </CardFooter>
      </Card>
      
      {/* Notification Preferences Card - Example */}
      <Card className="shadow-lg">
        <CardHeader>
           <div className="flex items-center space-x-3">
             <BellRing className="h-7 w-7 text-accent" />
            <CardTitle className="text-xl">Preferencias de Notificaciones</CardTitle>
          </div>
          <CardDescription>Gestiona qué alertas deseas recibir (sección en desarrollo).</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Aquí podrás configurar tus notificaciones de tareas, consejos y más. (Funcionalidad completa en desarrollo).</p>
            <div className="mt-4 space-y-2">
                {/* Example Toggle */}
                <div className="flex items-center justify-between">
                    <Label htmlFor="taskReminders">Recordatorios de Tareas</Label>
                    {/* <Switch id="taskReminders" checked={true} /> */}
                    <p className="text-sm text-primary">(Activado)</p>
                </div>
                 <div className="flex items-center justify-between">
                    <Label htmlFor="dailyTips">Consejos Diarios</Label>
                    <p className="text-sm text-primary">(Activado)</p>
                </div>
            </div>
        </CardContent>
         <CardFooter>
          <Button onClick={handleSavePreferences} disabled={isSavingPreferences} className="ml-auto" variant="outline">
            {isSavingPreferences ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar Notificaciones (Simulado)
          </Button>
        </CardFooter>
      </Card>

    </div>
  );
}
