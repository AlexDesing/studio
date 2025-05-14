import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: (pathname: string) => boolean;
}

export interface Task {
  id: string;
  title: string;
  time?: string;
  date: Date;
  category?: string;
  priority?: 'High' | 'Medium' | 'Low';
  completed: boolean;
  description?: string;
}

export interface Tip {
  id: string;
  title: string;
  content: string;
}
