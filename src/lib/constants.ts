import type { NavItem, Task, Tip } from '@/lib/types';
import { CalendarDays, Lightbulb, Sparkles, MessageCircle, Bell } from 'lucide-react';

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Planificador Diario', icon: CalendarDays },
  { href: '/tips', label: 'Consejos Diarios', icon: Lightbulb },
  { href: '/affirmations', label: 'Afirmaciones', icon: Sparkles },
  { href: '/assistant', label: 'Asistente IA', icon: MessageCircle },
  { href: '/notifications', label: 'Notificaciones', icon: Bell },
];

export const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Meditación Matutina', time: '7:00 AM', category: 'Bienestar', priority: 'High', completed: false, date: new Date() },
  { id: '2', title: 'Planificar comidas de la semana', time: '9:00 AM', category: 'Hogar', priority: 'Medium', completed: false, date: new Date() },
  { id: '3', title: 'Compras de Supermercado', time: '11:00 AM', category: 'Pendientes', priority: 'Medium', completed: false, date: new Date() },
  { id: '4', title: 'Caminata de 30 min', time: '5:00 PM', category: 'Ejercicio', priority: 'High', completed: false, date: new Date() },
  { id: '5', title: 'Leer un capítulo de un libro', time: '8:00 PM', category: 'Autocuidado', priority: 'Low', completed: false, date: new Date() },
];

export const MOCK_TIPS: { [key: string]: Tip[] } = {
  cleaning: [
    { id: 'c1', title: 'Limpieza Rápida de Baño', content: 'Limpia las superficies del baño a diario para evitar acumulaciones. ¡Solo toma 5 minutos!' },
    { id: 'c2', title: 'Lavavajillas Nocturno', content: 'Pon el lavavajillas cada noche para despertar con una cocina limpia.' },
  ],
  cooking: [
    { id: 'k1', title: 'Prepara Vegetales con Anticipación', content: 'Pica verduras para los próximos días el domingo para ahorrar tiempo durante la semana.' },
    { id: 'k2', title: 'Comidas en una Olla', content: 'Adopta las comidas en una sola olla para cocinar y limpiar más fácilmente.' },
  ],
  organizing: [
    { id: 'o1', title: 'Orden Rápido de 15 Minutos', content: 'Pon un temporizador de 15 minutos cada noche para un orden rápido de la casa.' },
    { id: 'o2', title: 'Despeja un Cajón', content: 'Encárgate de un cajón pequeño o estante cada día para despejar tu casa poco a poco.' },
  ],
  wellbeing: [
    { id: 'w1', title: 'Recordatorio de Hidratación', content: 'Mantén una botella de agua cerca y bebe a lo largo del día para mantenerte hidratado.'},
    { id: 'w2', title: 'Momento Consciente', content: 'Respira profundamente 5 veces cuando te sientas estresado o abrumado.'}
  ]
};
