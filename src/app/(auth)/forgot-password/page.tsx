
'use client';

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { resetPassword } from '@/lib/firebase/auth';
import { Loader2, Mail, Send } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Por favor ingresa un email válido.' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = async (data) => {
    setIsLoading(true);
    try {
      await resetPassword(data.email);
      setEmailSent(true);
      toast({ 
        title: 'Correo Enviado', 
        description: 'Si existe una cuenta con ese email, recibirás instrucciones para restablecer tu contraseña.' 
      });
    } catch (error: any) {
      console.error("Error sending password reset email: ", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo enviar el correo de restablecimiento.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Restablecer Contraseña</CardTitle>
        <CardDescription>Ingresa tu email para recibir instrucciones.</CardDescription>
      </CardHeader>
      <CardContent>
        {emailSent ? (
          <div className="text-center space-y-4">
            <Mail className="mx-auto h-12 w-12 text-green-500" />
            <p className="text-lg">¡Correo enviado!</p>
            <p className="text-muted-foreground">Revisa tu bandeja de entrada (y spam) para las instrucciones.</p>
            <Button asChild variant="outline">
              <Link href="/login">Volver a Ingresar</Link>
            </Button>
          </div>
        ) : (
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
              <Button type="submit" className="w-full text-lg" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                Enviar Instrucciones
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      {!emailSent && (
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            ¿Recordaste tu contraseña?{' '}
            <Link href="/login" passHref legacyBehavior>
                <a className="font-semibold text-highlight-purple hover:underline">Ingresa aquí</a>
            </Link>
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
