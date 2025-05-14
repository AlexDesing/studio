
'use client';

import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { PlusCircle, Edit3, Trash2, MoreHorizontal, Loader2 } from 'lucide-react';
import type { Task, TaskStatus } from '@/lib/types';
import { format, isEqual, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { createTask, updateTask, deleteTask, onTasksSnapshot } from '@/lib/firebase/firestore/tasks';
import { useToast } from '@/hooks/use-toast';
import { Timestamp } from 'firebase/firestore';


const KANBAN_COLUMNS: { title: string; status: TaskStatus }[] = [
  { title: '📝 Pendiente', status: 'PENDIENTE' },
  { title: '⏳ En Progreso', status: 'EN PROGRESO' },
  { title: '✅ Hecho', status: 'HECHO' },
];

export default function DailyPlannerPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [taskCategory, setTaskCategory] = useState('');
  const [taskPriority, setTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('PENDIENTE');
  const [taskDate, setTaskDate] = useState<Date>(selectedDate || new Date());


  useEffect(() => {
    if (currentUser && selectedDate && !authLoading) {
      setIsLoadingTasks(true);
      const unsubscribe = onTasksSnapshot(currentUser.uid, selectedDate, (fetchedTasks) => {
        setTasks(fetchedTasks);
        setIsLoadingTasks(false);
      });
      return () => unsubscribe(); // Cleanup subscription on unmount or when deps change
    } else if (!currentUser && !authLoading) {
      setTasks([]); // Clear tasks if user logs out
      setIsLoadingTasks(false);
    }
  }, [currentUser, selectedDate, authLoading]);


  const openAddTaskDialog = () => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskTime('');
    setTaskCategory('');
    setTaskPriority('Medium');
    setTaskStatus('PENDIENTE');
    setTaskDate(selectedDate || new Date());
    setIsDialogOpen(true);
  };

  const openEditTaskDialog = (task: Task) => {
    if (!currentUser) {
      toast({ variant: 'destructive', title: 'Error', description: 'Debes iniciar sesión para editar tareas.' });
      return;
    }
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskTime(task.time || '');
    setTaskCategory(task.category || '');
    setTaskPriority(task.priority || 'Medium');
    setTaskStatus(task.status);
    // Ensure task.date is a JS Date object for the input
    const jsDate = task.date instanceof Timestamp ? task.date.toDate() : task.date;
    setTaskDate(jsDate);
    setIsDialogOpen(true);
  };

  const handleSaveTask = async () => {
    if (!currentUser) {
        toast({ variant: 'destructive', title: 'Error', description: 'Debes iniciar sesión para guardar tareas.' });
        return;
    }
    if (!taskTitle.trim()) {
        toast({ variant: 'destructive', title: 'Error', description: 'El título de la tarea es obligatorio.' });
        return;
    }

    const taskDataToSave = {
      title: taskTitle.trim(),
      time: taskTime || null, // Store as null if empty
      category: taskCategory || null,
      priority: taskPriority,
      status: taskStatus,
      date: taskDate, // This is a JS Date, will be converted by Firestore function
    };

    try {
      if (editingTask) {
        await updateTask(currentUser.uid, editingTask.id, taskDataToSave);
        toast({ title: 'Tarea Actualizada', description: 'Los cambios en tu tarea han sido guardados.' });
      } else {
        await createTask(currentUser.uid, taskDataToSave as Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>);
        toast({ title: 'Tarea Añadida', description: 'Tu nueva tarea ha sido creada.' });
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving task: ", error);
      toast({ variant: 'destructive', title: 'Error al Guardar', description: error.message });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!currentUser) {
      toast({ variant: 'destructive', title: 'Error', description: 'Debes iniciar sesión para eliminar tareas.' });
      return;
    }
    try {
      await deleteTask(currentUser.uid, taskId);
      toast({ title: 'Tarea Eliminada', description: 'La tarea ha sido borrada.' });
    } catch (error: any) {
        console.error("Error deleting task: ", error);
        toast({ variant: 'destructive', title: 'Error al Eliminar', description: error.message });
    }
  };
  
  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
     if (!currentUser) {
       toast({ variant: 'destructive', title: 'Error', description: 'Debes iniciar sesión para cambiar el estado de las tareas.' });
       return;
     }
     try {
        await updateTask(currentUser.uid, taskId, { status: newStatus });
        // Real-time listener will update the UI
     } catch (error: any) {
        console.error("Error updating task status: ", error);
        toast({ variant: 'destructive', title: 'Error al Cambiar Estado', description: error.message });
     }
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
        setSelectedDate(startOfDay(date)); // Ensure we use the start of the day for consistency
        setTaskDate(startOfDay(date));
    }
  };

  const getPriorityText = (priority: 'High' | 'Medium' | 'Low' | undefined): string => {
    if (!priority) return '';
    switch (priority) {
      case 'High': return 'Alta';
      case 'Medium': return 'Media';
      case 'Low': return 'Baja';
      default: return '';
    }
  };

  const getColumnActionText = (title: string): string => {
    const parts = title.split(' ');
    if (parts.length > 1) {
      return parts.slice(1).join(' ');
    }
    return title;
  };


  if (authLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }
  if (!currentUser && !authLoading) {
     return (
        <div className="container mx-auto text-center py-20">
            <h1 className="text-2xl font-semibold">Bienvenida a CasaZen</h1>
            <p className="text-muted-foreground mb-4">Por favor, inicia sesión para organizar tu día.</p>
            <Button asChild><Link href="/login">Iniciar Sesión</Link></Button>
        </div>
    );
  }

  // Tasks are already filtered by onTasksSnapshot based on selectedDate
  const tasksForSelectedDate = tasks;

  return (
    <div className="container mx-auto">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-foreground">Planificador Diario</h1>
            <p className="text-muted-foreground">Organiza tu día: {selectedDate ? format(selectedDate, 'eeee, d \'de\' MMMM \'de\' yyyy', { locale: es }) : 'Selecciona una fecha'}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" variant="default" onClick={openAddTaskDialog} className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-5 w-5" /> Añadir Tarea
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTask ? 'Editar Tarea' : 'Añadir Nueva Tarea'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2 pb-4">
                <div className="space-y-2">
                  <Label htmlFor="taskTitle">Título</Label>
                  <Input id="taskTitle" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="Ej., Caminata Matutina" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="taskDate">Fecha</Label>
                      {/* Ensure taskDate is a Date object */}
                      <Input id="taskDate" type="date" value={format(taskDate instanceof Timestamp ? taskDate.toDate() : taskDate, 'yyyy-MM-dd')} onChange={(e) => setTaskDate(new Date(e.target.value + 'T00:00:00'))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taskTime">Hora (Opcional)</Label>
                      <Input id="taskTime" type="time" value={taskTime} onChange={(e) => setTaskTime(e.target.value)} />
                    </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taskCategory">Categoría (Opcional)</Label>
                  <Input id="taskCategory" value={taskCategory} onChange={(e) => setTaskCategory(e.target.value)} placeholder="Ej., Bienestar" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="taskPriority">Prioridad</Label>
                    <Select value={taskPriority} onValueChange={(value: 'High' | 'Medium' | 'Low') => setTaskPriority(value)}>
                        <SelectTrigger id="taskPriority"><SelectValue placeholder="Seleccionar prioridad" /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="High">Alta</SelectItem>
                        <SelectItem value="Medium">Media</SelectItem>
                        <SelectItem value="Low">Baja</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="taskStatus">Estado</Label>
                    <Select value={taskStatus} onValueChange={(value: TaskStatus) => setTaskStatus(value)}>
                        <SelectTrigger id="taskStatus"><SelectValue placeholder="Seleccionar estado" /></SelectTrigger>
                        <SelectContent>
                        {KANBAN_COLUMNS.map(col => (
                            <SelectItem key={col.status} value={col.status}>{getColumnActionText(col.title)}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleSaveTask}>{editingTask ? 'Guardar Cambios' : 'Añadir Tarea'}</Button>
              </DialogFooter>
            </DialogContent>
        </Dialog>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4">
            <Card className="shadow-lg sticky top-6">
              <CardHeader><CardTitle>Calendario</CardTitle></CardHeader>
              <CardContent className="flex justify-center p-2">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="rounded-md"
                  locale={es}
                  disabled={authLoading || isLoadingTasks}
                />
              </CardContent>
            </Card>
        </div>

        <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {KANBAN_COLUMNS.map(column => (
            <div key={column.status} className="flex flex-col">
              <Card className="shadow-md bg-card/70 flex-grow">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-lg font-semibold">{column.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <ScrollArea className="h-[calc(100vh-20rem)] p-2 min-h-[200px]"> {/* Adjusted height */}
                    {isLoadingTasks ? (
                        <div className="flex justify-center items-center h-full"><Loader2 className="h-6 w-6 animate-spin text-primary"/></div>
                    ) : tasksForSelectedDate.filter(task => task.status === column.status).length > 0 ? (
                      <ul className="space-y-3">
                        {tasksForSelectedDate
                          .filter(task => task.status === column.status)
                          .sort((a,b) => {
                            // Sort by time if present, otherwise keep order (e.g., by creation if needed)
                            if (a.time && b.time) return a.time.localeCompare(b.time);
                            if (a.time && !b.time) return -1; // Tasks with time come first
                            if (!a.time && b.time) return 1;  // Tasks with time come first
                            return 0; // Keep original order for tasks without time
                          })
                          .map(task => (
                          <li key={task.id} className="p-3 bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <span className={`text-sm font-medium ${task.status === 'HECHO' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                    {task.title}
                                    </span>
                                    {(task.time || task.category || task.priority) && (
                                    <div className="text-xs text-muted-foreground flex items-center flex-wrap gap-x-2 mt-1">
                                        {task.time && <span>{task.time}</span>}
                                        {task.category && <span className="bg-secondary/50 px-1.5 py-0.5 rounded-full">{task.category}</span>}
                                        {task.priority && <span className={cn(
                                        "font-semibold",
                                        task.priority === 'High' && 'text-destructive/80',
                                        task.priority === 'Medium' && 'text-yellow-600 dark:text-yellow-400',
                                        task.priority === 'Low' && 'text-green-600 dark:text-green-400',
                                        )}>{getPriorityText(task.priority)}</span>}
                                    </div>
                                    )}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => openEditTaskDialog(task)}>
                                            <Edit3 className="mr-2 h-4 w-4" /> Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDeleteTask(task.id)} className="text-destructive hover:!bg-destructive/10 focus:!bg-destructive/10">
                                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        {KANBAN_COLUMNS.filter(col => col.status !== task.status).map(newCol => (
                                            <DropdownMenuItem key={newCol.status} onClick={() => handleStatusChange(task.id, newCol.status)}>
                                                Mover a {getColumnActionText(newCol.title)}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-center py-10 text-sm">
                        No hay tareas en esta columna para {selectedDate ? format(selectedDate, 'dd/MM', { locale: es }) : ''}.
                      </p>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
