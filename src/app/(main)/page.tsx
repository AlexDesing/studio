'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { PlusCircle, Edit3, Trash2, GripVertical } from 'lucide-react';
import { MOCK_TASKS } from '@/lib/constants';
import type { Task } from '@/lib/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function DailyPlannerPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  useEffect(() => {
    setIsMounted(true);
    // Initialize with mock tasks for the current date
    const todayTasks = MOCK_TASKS.filter(task => 
      selectedDate && format(task.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    );
    setTasks(todayTasks);
  }, [selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      // Filter mock tasks for selected date - in a real app, this would fetch tasks
       const dateTasks = MOCK_TASKS.filter(task => format(task.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
       // For demonstration, let's add some generic tasks if none found for other dates
       if (dateTasks.length === 0 && format(date, 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')) {
         setTasks([
           {id: String(Date.now()), title: `Task for ${format(date, 'MMM d')}`, date: date, completed: false, priority: 'Medium' }
         ]);
       } else {
        setTasks(dateTasks);
       }
    } else {
      setTasks([]);
    }
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const handleAddTask = () => {
    if (!newTaskTitle.trim() || !selectedDate) return;
    const newTask: Task = {
      id: String(Date.now()),
      title: newTaskTitle,
      time: newTaskTime,
      category: newTaskCategory,
      priority: newTaskPriority,
      completed: false,
      date: selectedDate,
    };
    setTasks(prevTasks => [...prevTasks, newTask].sort((a, b) => (a.time && b.time ? a.time.localeCompare(b.time) : 0)));
    setNewTaskTitle('');
    setNewTaskTime('');
    setNewTaskCategory('');
    setNewTaskPriority('Medium');
    // Close dialog - requires managing dialog open state
  };

  if (!isMounted) {
    return null; // Avoid hydration mismatch
  }

  const filteredTasks = selectedDate
    ? tasks.filter(task => format(task.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
    : [];

  return (
    <div className="container mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Daily Planner</h1>
        <p className="text-muted-foreground">Organize your day, achieve your goals.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                Tasks for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
              </CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="default">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2 pb-4">
                    <div className="space-y-2">
                      <Label htmlFor="taskTitle">Title</Label>
                      <Input id="taskTitle" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="E.g., Morning Walk" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taskTime">Time (Optional)</Label>
                      <Input id="taskTime" type="time" value={newTaskTime} onChange={(e) => setNewTaskTime(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taskCategory">Category (Optional)</Label>
                      <Input id="taskCategory" value={newTaskCategory} onChange={(e) => setNewTaskCategory(e.target.value)} placeholder="E.g., Wellness" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="taskPriority">Priority</Label>
                        <Select value={newTaskPriority} onValueChange={(value: 'High' | 'Medium' | 'Low') => setNewTaskPriority(value)}>
                          <SelectTrigger id="taskPriority">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                       <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button onClick={handleAddTask}>Add Task</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {filteredTasks.length > 0 ? (
                <ul className="space-y-3">
                  {filteredTasks.map(task => (
                    <li key={task.id} className="flex items-center space-x-3 p-3 bg-card-foreground/5 rounded-md shadow-sm hover:shadow-md transition-shadow">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => handleToggleTask(task.id)}
                        aria-label={`Mark task ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`task-${task.id}`}
                          className={`text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                        >
                          {task.title}
                        </label>
                        {(task.time || task.category || task.priority) && (
                           <div className="text-xs text-muted-foreground flex items-center space-x-2">
                            {task.time && <span>{task.time}</span>}
                            {task.category && <span>| {task.category}</span>}
                            {task.priority && <span className={cn(
                              task.priority === 'High' && 'text-red-500',
                              task.priority === 'Medium' && 'text-yellow-500',
                              task.priority === 'Low' && 'text-green-500',
                            )}>| {task.priority}</span>}
                          </div>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Edit task">
                        <Edit3 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Delete task" onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-10">
                  No tasks for this day. Enjoy your free time or add a new task!
                </p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
