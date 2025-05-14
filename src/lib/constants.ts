import type { NavItem, Task, Tip } from '@/lib/types';
import { CalendarDays, Lightbulb, Sparkles, MessageCircle, Bell } from 'lucide-react';

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Daily Planner', icon: CalendarDays },
  { href: '/tips', label: 'Daily Tips', icon: Lightbulb },
  { href: '/affirmations', label: 'Affirmations', icon: Sparkles },
  { href: '/assistant', label: 'AI Assistant', icon: MessageCircle },
  { href: '/notifications', label: 'Notifications', icon: Bell },
];

export const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Morning Meditation', time: '7:00 AM', category: 'Wellness', priority: 'High', completed: false, date: new Date() },
  { id: '2', title: 'Plan meals for the week', time: '9:00 AM', category: 'Household', priority: 'Medium', completed: false, date: new Date() },
  { id: '3', title: 'Grocery Shopping', time: '11:00 AM', category: 'Errands', priority: 'Medium', completed: false, date: new Date() },
  { id: '4', title: '30 min walk', time: '5:00 PM', category: 'Fitness', priority: 'High', completed: false, date: new Date() },
  { id: '5', title: 'Read a chapter of a book', time: '8:00 PM', category: 'Self-care', priority: 'Low', completed: false, date: new Date() },
];

export const MOCK_TIPS: { [key: string]: Tip[] } = {
  cleaning: [
    { id: 'c1', title: 'Quick Clean Bathroom', content: 'Wipe down surfaces in the bathroom daily to prevent buildup. Takes 5 minutes!' },
    { id: 'c2', title: 'Dishwasher Nightly', content: 'Run the dishwasher every night to wake up to a clean kitchen.' },
  ],
  cooking: [
    { id: 'k1', title: 'Prep Veggies Ahead', content: 'Chop vegetables for the next few days on Sunday to save time during the week.' },
    { id: 'k2', title: 'One-Pot Meals', content: 'Embrace one-pot meals for easier cooking and cleanup.' },
  ],
  organizing: [
    { id: 'o1', title: '15-Minute Tidy', content: 'Set a timer for 15 minutes each evening for a quick house tidy-up.' },
    { id: 'o2', title: 'Declutter One Drawer', content: 'Tackle one small drawer or shelf each day to slowly declutter your home.' },
  ],
  wellbeing: [
    { id: 'w1', title: 'Hydration Reminder', content: 'Keep a water bottle nearby and sip throughout the day to stay hydrated.'},
    { id: 'w2', title: 'Mindful Moment', content: 'Take 5 deep breaths when you feel stressed or overwhelmed.'}
  ]
};
