
'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ListChecks, Zap, Smile, Coffee, PlusCircle, Edit3, Trash2, Loader2, CalendarDays, Clock } from 'lucide-react';
import type { Routine } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from '@/contexts/AuthContext';
import { createRoutine, updateRoutine, deleteRoutine, onRoutinesSnapshot, getLucideIconByName } from '@/lib/firebase/firestore/routines';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import * as LucideIcons from 'lucide-react'; 
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';


const iconOptions = Object.keys(LucideIcons).filter(key => key !== 'createLucideIcon' && key !== 'icons' && typeof LucideIcons[key as keyof typeof LucideIcons] === 'object');


export default function RoutinesPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [routineTitle, setRoutineTitle] = useState('');
  const [routineDescription, setRoutineDescription] = useState('');
  const [routineCategory, setRoutineCategory] = useState('');
  const [routineSteps, setRoutineSteps] = useState<string[]>(['']);
  const [routineIconName, setRoutineIconName] = useState<keyof typeof LucideIcons>('ListChecks');
  const [routineStartDate, setRoutineStartDate] = useState<string>(''); 
  const [routineStartTime, setRoutineStartTime] = useState<string>(''); 

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [routineToDeleteId, setRoutineToDeleteId] = useState<string | null>(null);


  useEffect(() => {
    if (currentUser && !authLoading) {
      setIsLoading(true);
      const unsubscribe = onRoutinesSnapshot(currentUser.uid, (fetchedRoutines) => {
        setRoutines(fetchedRoutines);
        setIsLoading(false);
      });
      return () => unsubscribe();
    } else if (!currentUser && !authLoading) {
        setRoutines([]);
        setIsLoading(false);
    }
  }, [currentUser, authLoading]);

  const openAddDialog = () => {
    setEditingRoutine(null);
    setRoutineTitle('');
    setRoutineDescription('');
    setRoutineCategory('');
    setRoutineSteps(['']);
    setRoutineIconName('ListChecks');
    setRoutineStartDate('');
    setRoutineStartTime('');
    setIsFormDialogOpen(true);
  };

  const openEditDialog = (routine: Routine) => {
    setEditingRoutine(routine);
    setRoutineTitle(routine.title);
    setRoutineDescription(routine.description);
    setRoutineCategory(routine.category);
    setRoutineSteps(routine.steps.length > 0 ? routine.steps : ['']);
    setRoutineIconName(routine.iconName || 'ListChecks');
    if (routine.startDate) {
      const dateObj = routine.startDate instanceof Timestamp ? routine.startDate.toDate() : new Date(routine.startDate);
      setRoutineStartDate(format(dateObj, 'yyyy-MM-dd'));
    } else {
      setRoutineStartDate('');
    }
    setRoutineStartTime(routine.startTime || '');
    setIsFormDialogOpen(true);
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...routineSteps];
    newSteps[index] = value;
    setRoutineSteps(newSteps);
  };

  const addStepField = () => {
    setRoutineSteps([...routineSteps, '']);
  };

  const removeStepField = (index: number) => {
    if (routineSteps.length > 1) {
      const newSteps = routineSteps.filter((_, i) => i !== index);
      setRoutineSteps(newSteps);
    }
  };
  
  const handleSaveRoutine = async () => {
    if (!currentUser || !routineTitle.trim()) {
        toast({ variant: 'destructive', title: 'Error', description: 'El título de la rutina es obligatorio.'});
        return;
    }
    const finalSteps = routineSteps.map(s => s.trim()).filter(s => s !== '');
    if (finalSteps.length === 0) {
        toast({ variant: 'destructive', title: 'Error', description: 'Debe haber al menos un paso en la rutina.'});
        return;
    }

    const routineData: Partial<Routine> = { 
      title: routineTitle.trim(),
      description: routineDescription.trim(),
      category: routineCategory.trim(),
      steps: finalSteps,
      iconName: routineIconName,
    };

    if (routineStartDate) {
      // Ensure time is considered correctly if using date string
      const [year, month, day] = routineStartDate.split('-').map(Number);
      routineData.startDate = new Date(year, month - 1, day);
    } else {
      routineData.startDate = undefined; 
    }
    
    if (routineStartTime) {
      routineData.startTime = routineStartTime;
    } else {
      routineData.startTime = undefined; 
    }

    try {
      if (editingRoutine) {
        await updateRoutine(currentUser.uid, editingRoutine.id, routineData as Omit<Routine, 'id' | 'userId' | 'createdAt' | 'updatedAt'>);
        toast({ title: 'Rutina Actualizada'});
      } else {
        await createRoutine(currentUser.uid, routineData as Omit<Routine, 'id' | 'createdAt' | 'updatedAt' | 'userId'>);
        toast({ title: 'Rutina Creada'});
      }
      setIsFormDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving routine: ", error);
      toast({ variant: 'destructive', title: 'Error al Guardar', description: error.message });
    }
  };

  const handleDeleteRoutine = async (routineId: string | null) => {
    if (!currentUser || !routineId) return;
    try {
        await deleteRoutine(currentUser.uid, routineId);
        toast({ title: 'Rutina Eliminada'});
    } catch (error: any) {
        console.error("Error deleting routine: ", error);
        toast({ variant: 'destructive', title: 'Error al Eliminar', description: error.message });
    }
  };

  const openDeleteConfirmDialog = (e: React.MouseEvent, routineId: string) => {
    e.stopPropagation(); // Prevent accordion from toggling
    setRoutineToDeleteId(routineId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteAndCloseDialog = async () => {
    await handleDeleteRoutine(routineToDeleteId);
    setIsDeleteDialogOpen(false);
    setRoutineToDeleteId(null);
  };
  
  const RenderIcon = ({ name }: { name: keyof typeof LucideIcons | undefined }) => {
    if (!name) return <ListChecks className="h-8 w-8 text-primary" />;
    const IconComponent = LucideIcons[name] as React.ElementType;
    if (!IconComponent) return <ListChecks className="h-8 w-8 text-primary" />; 
    return <IconComponent className="h-8 w-8 text-primary" />;
  };


  if (authLoading || isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }
  
  if (!currentUser && !authLoading) {
     return (
        <div className="container mx-auto text-center py-20">
            <h1 className="text-2xl font-semibold">Mis Rutinas Zen</h1>
            <p className="text-muted-foreground mb-4">Inicia sesión para crear y gestionar tus rutinas personalizadas.</p>
            <Button asChild><Link href="/login">Iniciar Sesión</Link></Button>
        </div>
    );
  }


  return (
    <div className="container mx-auto max-w-2xl">
      <header className="mb-10 text-center">
        <div className="inline-flex items-center justify-center bg-primary/20 p-4 rounded-full mb-4">
            <ListChecks className="h-12 w-12 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">Mis Rutinas Zen</h1>
        <p className="text-lg text-muted-foreground mt-2">Secuencias personalizadas para potenciar tu día con intención y calma.</p>
      </header>
      
      <div className="text-center mb-8">
        <Button size="lg" onClick={openAddDialog}>
            <PlusCircle className="mr-2 h-5 w-5" /> Crear Nueva Rutina
        </Button>
      </div>

      {routines.length > 0 ? (
        <Accordion type="single" collapsible className="w-full space-y-6">
          {routines.map((routine, index) => (
            <AccordionItem value={`item-${index}`} key={routine.id} className="bg-card border border-primary/20 rounded-lg shadow-lg overflow-hidden">
              <AccordionTrigger className="p-6 hover:no-underline">
                <div className="flex items-center space-x-4 w-full">
                  <RenderIcon name={routine.iconName} />
                  <div className="flex-grow text-left">
                    <CardTitle className="text-xl">{routine.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">{routine.description}</CardDescription>
                    {routine.startDate && (
                        <div className="text-xs text-muted-foreground mt-1 flex items-center">
                            <CalendarDays className="mr-1.5 h-3.5 w-3.5"/> 
                            Programada para: {format(routine.startDate instanceof Timestamp ? routine.startDate.toDate() : new Date(routine.startDate), "PPP", {locale: es})}
                            {routine.startTime && (
                                <span className="ml-2 flex items-center"><Clock className="mr-1 h-3.5 w-3.5"/> {routine.startTime}</span>
                            )}
                        </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                     <Button asChild variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openEditDialog(routine);}} className="hover:bg-accent/50">
                        <span><Edit3 className="h-5 w-5 text-blue-500" /></span>
                     </Button>
                     <Button asChild variant="ghost" size="icon" onClick={(e) => openDeleteConfirmDialog(e, routine.id)} className="hover:bg-destructive/10">
                        <span><Trash2 className="h-5 w-5 text-destructive" /></span>
                     </Button>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-0">
                <p className="text-sm text-muted-foreground mb-1">Categoría: {routine.category || "General"}</p>
                <ul className="space-y-3 mt-4">
                  {routine.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-foreground">{step}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-6 w-full sm:w-auto" variant="default">
                  Iniciar Rutina (Próximamente)
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
        </Card>
      )}
      <div className="mt-12 text-center">
        <Button variant="link" className="text-highlight-purple">
            Explorar plantillas de rutinas (Próximamente)
        </Button>
      </div>

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>{editingRoutine ? 'Editar Rutina' : 'Crear Nueva Rutina'}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="routine-title" className="text-right">Título</Label>
                  <Input id="routine-title" value={routineTitle} onChange={(e) => setRoutineTitle(e.target.value)} className="col-span-3" placeholder="Ej: Mañana Energizante"/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="routine-desc" className="text-right">Descripción</Label>
                  <Textarea id="routine-desc" value={routineDescription} onChange={(e) => setRoutineDescription(e.target.value)} className="col-span-3" placeholder="Pequeña descripción de la rutina"/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="routine-category" className="text-right">Categoría</Label>
                  <Input id="routine-category" value={routineCategory} onChange={(e) => setRoutineCategory(e.target.value)} className="col-span-3" placeholder="Ej: Bienestar, Productividad"/>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="routine-icon" className="text-right">Ícono</Label>
                    <select 
                        id="routine-icon"
                        value={routineIconName}
                        onChange={(e) => setRoutineIconName(e.target.value as keyof typeof LucideIcons)}
                        className="col-span-3 p-2 border rounded-md bg-input"
                    >
                        {iconOptions.map(iconKey => (
                            <option key={iconKey} value={iconKey}>{iconKey}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="routine-start-date" className="text-right">Fecha Inicio (Opcional)</Label>
                  <Input id="routine-start-date" type="date" value={routineStartDate} onChange={(e) => setRoutineStartDate(e.target.value)} className="col-span-3"/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="routine-start-time" className="text-right">Hora Inicio (Opcional)</Label>
                  <Input id="routine-start-time" type="time" value={routineStartTime} onChange={(e) => setRoutineStartTime(e.target.value)} className="col-span-3"/>
                </div>

                <Label className="font-semibold mt-2">Pasos de la Rutina:</Label>
                {routineSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Input value={step} onChange={(e) => handleStepChange(index, e.target.value)} placeholder={`Paso ${index + 1}`} className="flex-grow"/>
                        {routineSteps.length > 1 && (
                            <Button variant="ghost" size="icon" onClick={() => removeStepField(index)} className="text-destructive">
                                <Trash2 className="h-4 w-4"/>
                            </Button>
                        )}
                    </div>
                ))}
                <Button variant="outline" onClick={addStepField} size="sm" className="mt-2">Añadir Paso</Button>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsFormDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleSaveRoutine}>{editingRoutine ? 'Guardar Cambios' : 'Crear Rutina'}</Button>
              </DialogFooter>
            </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás absolutamente segura?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Esto eliminará permanentemente la rutina de tus registros.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setRoutineToDeleteId(null)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteAndCloseDialog}>Sí, eliminar rutina</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

    </div>
  );
}

    