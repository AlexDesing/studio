
'use client';

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmail, signInWithGoogle } from '@/lib/firebase/auth';
import { Loader2, Mail, KeyRound, LogIn } from 'lucide-react';
import Image from 'next/image';

const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor ingresa un email válido.' }),
  password: z.string().min(1, { message: 'Por favor ingresa tu contraseña.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsLoading(true);
    try {
      await signInWithEmail(data.email, data.password);
      toast({ title: '¡Bienvenida de nuevo!', description: 'Has iniciado sesión correctamente.' });
      router.push('/app/dashboard'); // Redirect to app dashboard
    } catch (error: any) {
      console.error("Error signing in: ", error);
      toast({
        variant: 'destructive',
        title: 'Error al iniciar sesión',
        description: error.message || 'Hubo un problema al intentar iniciar sesión. Verifica tus credenciales.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast({ title: '¡Bienvenida!', description: 'Has iniciado sesión con Google correctamente.' });
      router.push('/app/dashboard'); // Redirect to app dashboard
    } catch (error: any) {
      console.error("Error signing in with Google: ", error);
      toast({
        variant: 'destructive',
        title: 'Error con Google',
        description: error.message || 'No se pudo iniciar sesión con Google.',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">¡Hola de Nuevo!</CardTitle>
        <CardDescription>Ingresa a tu espacio MovaZen.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" /> Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="tu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><KeyRound className="mr-2 h-4 w-4 text-muted-foreground" /> Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                  <div className="text-right">
                    <Link href="/forgot-password" passHref legacyBehavior>
                        <a className="text-sm text-highlight-purple hover:underline">¿Olvidaste tu contraseña?</a>
                    </Link>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full text-lg" disabled={isLoading || isGoogleLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
              Ingresar
            </Button>
          </form>
        </Form>
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-muted"></div>
          <span className="mx-4 flex-shrink text-xs uppercase text-muted-foreground">O continúa con</span>
          <div className="flex-grow border-t border-muted"></div>
        </div>
        <Button variant="outline" className="w-full text-lg" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>
          {isGoogleLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 
            <Image src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="Google logo" width={20} height={20} className="mr-2"/>
          }
          Google
        </Button>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          ¿No tienes una cuenta?{' '}
          <Link href="/signup" passHref legacyBehavior>
            <a className="font-semibold text-highlight-purple hover:underline">Regístrate aquí</a>
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
