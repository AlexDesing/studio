'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Se mantiene por si se usa en otro lado, pero no en la lista principal.
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { PlusCircle, Edit3, Trash2, GripVertical, MoreHorizontal } from 'lucide-react';
import { MOCK_TASKS } from '@/lib/constants';
import type { Task, TaskStatus } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';


const KANBAN_COLUMNS: { title: string; status: TaskStatus }[] = [
  { title: '📝 Pendiente', status: 'PENDIENTE' },
  { title: '⏳ En Progreso', status: 'EN PROGRESO' },
  { title: '✅ Hecho', status: 'HECHO' },
];

export default function DailyPlannerPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS); // Initialize with all mock tasks
  const [isMounted, setIsMounted] = useState(false);
  
  // State for new/edit task dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [taskCategory, setTaskCategory] = useState('');
  const [taskPriority, setTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('PENDIENTE');
  const [taskDate, setTaskDate] = useState<Date>(selectedDate || new Date());


  useEffect(() => {
    setIsMounted(true);
    // Filter tasks for selected date on initial load and when selectedDate changes
    // This part is handled by filteredTasksForKanban now
  }, []);


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
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskTime(task.time || '');
    setTaskCategory(task.category || '');
    setTaskPriority(task.priority || 'Medium');
    setTaskStatus(task.status);
    setTaskDate(task.date);
    setIsDialogOpen(true);
  };

  const handleSaveTask = () => {
    if (!taskTitle.trim()) return;

    const taskData = {
      title: taskTitle,
      time: taskTime,
      category: taskCategory,
      priority: taskPriority,
      status: taskStatus,
      date: taskDate, // Use the date from the dialog state
      completed: taskStatus === 'HECHO', // Sync completed with status
    };

    if (editingTask) {
      setTasks(prevTasks => prevTasks.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t));
    } else {
      const newTask: Task = {
        id: String(Date.now()),
        ...taskData,
      };
      setTasks(prevTasks => [...prevTasks, newTask]);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
  };
  
  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
     setTasks(prevTasks => 
        prevTasks.map(task => 
            task.id === taskId ? { ...task, status: newStatus, completed: newStatus === 'HECHO' } : task
        )
     );
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

  if (!isMounted) {
    return null;
  }

  const filteredTasksForKanban = tasks.filter(task => 
    selectedDate && format(task.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );


  return (
    <div className="container mx-auto">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-foreground">Planificador Diario</h1>
            <p className="text-muted-foreground">Organiza tu día en estilo Kanban: {selectedDate ? format(selectedDate, 'eeee, MMMM d, yyyy', { locale: es }) : 'Selecciona una fecha'}</p>
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
                      <Input id="taskDate" type="date" value={format(taskDate, 'yyyy-MM-dd')} onChange={(e) => setTaskDate(new Date(e.target.value + 'T00:00:00'))} /> {/* Ensure date is parsed correctly */}
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
                            <SelectItem key={col.status} value={col.status}>{col.title.split(' ')[1]}</SelectItem>
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
        {/* Calendar moved to a collapsible section or smaller component if needed, or keep as is */}
        <div className="lg:w-1/4">
            <Card className="shadow-lg sticky top-6">
              <CardHeader><CardTitle>Calendario</CardTitle></CardHeader>
              <CardContent className="flex justify-center p-2">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {setSelectedDate(date); setTaskDate(date || new Date());}}
                  className="rounded-md"
                  locale={es}
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
                  <ScrollArea className="h-[calc(100vh-18rem)] p-2 min-h-[200px]"> {/* Adjusted height */}
                    {filteredTasksForKanban.filter(task => task.status === column.status).length > 0 ? (
                      <ul className="space-y-3">
                        {filteredTasksForKanban
                          .filter(task => task.status === column.status)
                          .sort((a,b) => (a.time && b.time ? a.time.localeCompare(b.time) : 0))
                          .map(task => (
                          <li key={task.id} className="p-3 bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <span className={`text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                    {task.title}
                                    </span>
                                    {(task.time || task.category || task.priority) && (
                                    <div className="text-xs text-muted-foreground flex items-center flex-wrap space-x-2 mt-1">
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
                                        <DropdownMenuItem onClick={() => handleDeleteTask(task.id)} className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        {KANBAN_COLUMNS.filter(col => col.status !== task.status).map(newCol => (
                                            <DropdownMenuItem key={newCol.status} onClick={() => handleStatusChange(task.id, newCol.status)}>
                                                Mover a {newCol.title.split(' ')[1]}
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
