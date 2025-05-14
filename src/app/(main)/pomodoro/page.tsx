'use client';

import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Timer, Play, Pause, RotateCcw, Coffee, Settings, ChevronsRight } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { PomodoroSettings as PomodoroSettingsType } from '@/lib/types';

const DEFAULT_SETTINGS: PomodoroSettingsType = {
  pomodoroTime: 25, // minutes
  shortBreakTime: 5,
  longBreakTime: 15,
  roundsBeforeLongBreak: 4,
};

type PomodoroMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export default function PomodoroPage() {
  const [settings, setSettings] = useState<PomodoroSettingsType>(DEFAULT_SETTINGS);
  const [mode, setMode] = useState<PomodoroMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(settings.pomodoroTime * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState<PomodoroSettingsType>(DEFAULT_SETTINGS);

  const { toast } = useToast();

  const resetTimer = useCallback((newMode?: PomodoroMode, newSettings?: PomodoroSettingsType) => {
    const currentSettings = newSettings || settings;
    const targetMode = newMode || mode;
    setIsRunning(false);
    switch (targetMode) {
      case 'pomodoro':
        setTimeLeft(currentSettings.pomodoroTime * 60);
        break;
      case 'shortBreak':
        setTimeLeft(currentSettings.shortBreakTime * 60);
        break;
      case 'longBreak':
        setTimeLeft(currentSettings.longBreakTime * 60);
        break;
    }
    setMode(targetMode);
  }, [mode, settings]);


  useEffect(() => {
    resetTimer('pomodoro', settings);
  }, [settings, resetTimer]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (timeLeft <=0 && isRunning) { // Timer reached zero while running
        setIsRunning(false);
        // Play sound placeholder
        toast({ title: "¡Tiempo Completado!", description: `Es hora de un ${mode === 'pomodoro' ? 'descanso' : 'nuevo ciclo de enfoque'}.` });

        if (mode === 'pomodoro') {
          setRoundsCompleted(prev => prev + 1);
          if ((roundsCompleted + 1) % settings.roundsBeforeLongBreak === 0) {
            resetTimer('longBreak');
          } else {
            resetTimer('shortBreak');
          }
        } else { // break ended
          resetTimer('pomodoro');
        }
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode, roundsCompleted, settings, resetTimer, toast]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleSkipToNext = () => {
     if (mode === 'pomodoro') {
        setRoundsCompleted(prev => prev + 1);
        if ((roundsCompleted + 1) % settings.roundsBeforeLongBreak === 0) {
            resetTimer('longBreak');
        } else {
            resetTimer('shortBreak');
        }
    } else { // break ended, skip to pomodoro
        resetTimer('pomodoro');
    }
    setIsRunning(false); // Stop timer when skipping
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDurationForMode = () => {
    switch (mode) {
      case 'pomodoro': return settings.pomodoroTime * 60;
      case 'shortBreak': return settings.shortBreakTime * 60;
      case 'longBreak': return settings.longBreakTime * 60;
      default: return settings.pomodoroTime * 60;
    }
  };
  
  const progressPercentage = (totalDurationForMode() - timeLeft) / totalDurationForMode() * 100;

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempSettings(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const saveSettings = () => {
    setSettings(tempSettings);
    setIsSettingsDialogOpen(false);
    // Reset timer with new settings, maintaining current mode if possible, or defaulting to pomodoro.
    // If timer was running, it will stop.
    resetTimer(mode, tempSettings); 
    toast({ title: "Ajustes Guardados", description: "El temporizador se ha actualizado con tus nuevas preferencias." });
  };

  const getModeDisplay = () => {
    switch(mode) {
      case 'pomodoro': return { text: 'Enfoque', icon: <Timer className="h-5 w-5 mr-2" />};
      case 'shortBreak': return { text: 'Descanso Corto', icon: <Coffee className="h-5 w-5 mr-2" />};
      case 'longBreak': return { text: 'Descanso Largo', icon: <Coffee className="h-5 w-5 mr-2" />};
    }
  }

  return (
    <div className="container mx-auto max-w-md">
      <header className="mb-10 text-center">
        <div className="inline-flex items-center justify-center bg-primary/20 p-4 rounded-full mb-4">
            <Timer className="h-12 w-12 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">Temporizador Pomodoro Zen</h1>
        <p className="text-lg text-muted-foreground mt-2">Encuentra tu ritmo y maximiza tu productividad con enfoque y pausas conscientes.</p>
      </header>

      <Card className="shadow-xl text-center border-primary/40">
        <CardHeader className="pb-4">
           <div className="flex items-center justify-center text-lg font-medium text-primary-foreground mb-2">
            {getModeDisplay().icon}
            <span>{getModeDisplay().text}</span>
          </div>
          <CardTitle className="text-7xl font-bold tracking-tighter text-foreground">
            {formatTime(timeLeft)}
          </CardTitle>
           <CardDescription>Rondas de enfoque completadas: {roundsCompleted}</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 space-y-6">
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex justify-center space-x-4">
            <Button
              onClick={toggleTimer}
              size="lg"
              className="w-36 text-lg py-7"
              variant={isRunning ? "outline" : "default"}
            >
              {isRunning ? <Pause className="mr-2 h-6 w-6" /> : <Play className="mr-2 h-6 w-6" />}
              {isRunning ? 'Pausar' : 'Iniciar'}
            </Button>
             <Button onClick={handleSkipToNext} size="lg" variant="secondary" className="w-36 text-lg py-7">
              <ChevronsRight className="mr-2 h-6 w-6" /> Siguiente
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center p-4 bg-muted/50">
          <Button onClick={() => resetTimer('pomodoro')} variant="ghost" className="text-muted-foreground">
            <RotateCcw className="mr-2 h-4 w-4" /> Reiniciar Ciclo
          </Button>
          <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" onClick={() => setTempSettings(settings)}>
                <Settings className="mr-2 h-4 w-4" /> Ajustes
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configuración del Pomodoro</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-3">
                <div>
                  <Label htmlFor="pomodoroTime">Tiempo de Enfoque (minutos)</Label>
                  <Input id="pomodoroTime" name="pomodoroTime" type="number" value={tempSettings.pomodoroTime} onChange={handleSettingsChange} />
                </div>
                <div>
                  <Label htmlFor="shortBreakTime">Descanso Corto (minutos)</Label>
                  <Input id="shortBreakTime" name="shortBreakTime" type="number" value={tempSettings.shortBreakTime} onChange={handleSettingsChange} />
                </div>
                <div>
                  <Label htmlFor="longBreakTime">Descanso Largo (minutos)</Label>
                  <Input id="longBreakTime" name="longBreakTime" type="number" value={tempSettings.longBreakTime} onChange={handleSettingsChange} />
                </div>
                <div>
                  <Label htmlFor="roundsBeforeLongBreak">Rondas para Descanso Largo</Label>
                  <Input id="roundsBeforeLongBreak" name="roundsBeforeLongBreak" type="number" value={tempSettings.roundsBeforeLongBreak} onChange={handleSettingsChange} />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button onClick={saveSettings}>Guardar Ajustes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
       <p className="text-xs text-muted-foreground text-center mt-6 px-4">
        Nota: Los sonidos relajantes son una futura mejora. Por ahora, disfruta del silencio o pon tu propia música de enfoque.
      </p>
    </div>
  );
}
