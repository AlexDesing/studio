
import type { LucideIcon } from 'lucide-react';
import type { Timestamp } from 'firebase/firestore';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: (pathname: string) => boolean;
}

export type TaskStatus = 'PENDIENTE' | 'EN PROGRESO' | 'HECHO';

export interface Task {
  id: string; // Firestore document ID
  userId?: string; // Added for Firestore queries, though path implies it
  title: string;
  time?: string;
  date: Date | Timestamp; // Can be JS Date or Firestore Timestamp
  category?: string;
  priority?: 'High' | 'Medium' | 'Low';
  status: TaskStatus;
  description?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Tip {
  id: string;
  title: string;
  content: string;
}

export interface VisionBoardItem {
  id: string; // Firestore document ID
  userId?: string;
  imageUrl: string;
  imageHint: string;
  title: string;
  description?: string;
  createdAt?: Timestamp;
}

// For affirmations saved by the user
export interface SavedAffirmation {
  id: string; // Firestore document ID
  userId?: string;
  text: string;
  mood?: string;
  needs?: string;
  isFavorite?: boolean;
  createdAt?: Timestamp;
}


export interface PomodoroSettings {
  pomodoroTime: number; // minutes
  shortBreakTime: number; // minutes
  longBreakTime: number; // minutes
  roundsBeforeLongBreak: number;
}

export interface Routine {
  id: string; // Firestore document ID
  userId?: string;
  title: string;
  description: string;
  iconName: keyof typeof import('lucide-react'); // Store icon name to re-render
  steps: string[];
  category: string; // e.g., "Mañana", "Productividad", "Relax"
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconUrl: string; // placeholder image url
  achieved: boolean;
  imageHint: string;
  criteria?: any; // Define criteria for achieving badge
}

// User Profile in Firestore
export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL?: string | null;
    createdAt: Timestamp;
    preferences?: {
        notifications?: {
            taskReminders?: boolean;
            dailyTips?: boolean;
            affirmationReady?: boolean;
            motivationalPhrases?: boolean;
            selfCareReminders?: boolean;
        };
        theme?: 'light' | 'dark' | 'system';
        productivityHours?: { start: string; end: string };
        favoriteAffirmations?: string[]; // Array of SavedAffirmation IDs
    };
}
