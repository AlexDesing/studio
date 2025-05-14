'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ListChecks, Zap, Smile, Coffee } from 'lucide-react';
import { MOCK_ROUTINES } from '@/lib/constants';
import type { Routine } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>(MOCK_ROUTINES);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <div className="container mx-auto max-w-3xl">
      <header className="mb-10 text-center">
        <div className="inline-flex items-center justify-center bg-primary/20 p-4 rounded-full mb-4">
            <ListChecks className="h-12 w-12 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">Mis Rutinas Zen</h1>
        <p className="text-lg text-muted-foreground mt-2">Secuencias personalizadas para potenciar tu día con intención y calma.</p>
      </header>

      {routines.length > 0 ? (
        <Accordion type="single" collapsible className="w-full space-y-6">
          {routines.map((routine, index) => (
            <AccordionItem value={`item-${index}`} key={routine.id} className="bg-card border border-primary/20 rounded-lg shadow-lg overflow-hidden">
              <AccordionTrigger className="p-6 hover:no-underline">
                <div className="flex items-center space-x-4 w-full">
                  <routine.icon className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-xl text-left">{routine.title}</CardTitle>
                    <CardDescription className="text-sm text-left text-muted-foreground">{routine.description}</CardDescription>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-0">
                <p className="text-sm text-muted-foreground mb-4">Categoría: {routine.category}</p>
                <ul className="space-y-3">
                  {routine.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-foreground">{step}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-6 w-full sm:w-auto" variant="default">
                  Iniciar Rutina
                </Button>
                 <Button className="mt-6 ml-2 w-full sm:w-auto" variant="outline">
                  Editar Rutina
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Card className="text-center p-10 shadow-lg">
          <ListChecks className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <CardTitle className="text-2xl mb-2">Aún no hay rutinas definidas</CardTitle>
          <CardDescription className="mb-6">Crea tu primera rutina para empezar a organizar tus días con propósito.</CardDescription>
          <Button size="lg">
            <Zap className="mr-2 h-5 w-5" /> Crear Nueva Rutina
          </Button>
        </Card>
      )}
      <div className="mt-12 text-center">
        <Button variant="link" className="text-primary">
            Explorar plantillas de rutinas
        </Button>
      </div>
    </div>
  );
}
