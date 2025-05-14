import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: (pathname: string) => boolean;
}

export type TaskStatus = 'PENDIENTE' | 'EN PROGRESO' | 'HECHO';

export interface Task {
  id: string;
  title: string;
  time?: string;
  date: Date;
  category?: string;
  priority?: 'High' | 'Medium' | 'Low';
  completed: boolean; // Mantener para compatibilidad, pero el status es el principal ahora
  status: TaskStatus;
  description?: string;
}

export interface Tip {
  id: string;
  title: string;
  content: string;
}

export interface VisionBoardItem {
  id: string;
  imageUrl: string;
  imageHint: string;
  title: string;
  description?: string;
}

export interface PomodoroSettings {
  pomodoroTime: number; // minutes
  shortBreakTime: number; // minutes
  longBreakTime: number; // minutes
  roundsBeforeLongBreak: number;
}

export interface Routine {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  steps: string[];
  category: string; // e.g., "Mañana", "Productividad", "Relax"
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconUrl: string; // placeholder image url
  achieved: boolean;
  imageHint: string;
}
