
import type { NavItem, Task, Tip, Routine, Badge } from '@/lib/types';
import { CalendarDays, Lightbulb, Sparkles, MessageCircle, Bell, Timer, ListChecks, LayoutDashboard, Settings } from 'lucide-react';

// NAV_ITEMS_LOGGED_IN now uses /app prefix
export const NAV_ITEMS_LOGGED_IN: NavItem[] = [
  { href: '/app/planner', label: 'Planificador Diario', icon: CalendarDays, match: (pathname) => pathname.startsWith('/app/planner') || pathname === '/app' },
  { href: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard, match: (pathname) => pathname.startsWith('/app/dashboard') },
  { href: '/app/routines', label: 'Rutinas', icon: ListChecks, match: (pathname) => pathname.startsWith('/app/routines') },
  { href: '/app/pomodoro', label: 'Pomodoro', icon: Timer, match: (pathname) => pathname.startsWith('/app/pomodoro') },
  { href: '/app/tips', label: 'Consejos Diarios', icon: Lightbulb, match: (pathname) => pathname.startsWith('/app/tips') },
  { href: '/app/affirmations', label: 'Afirmaciones', icon: Sparkles, match: (pathname) => pathname.startsWith('/app/affirmations') },
  { href: '/app/assistant', label: 'Asistente IA', icon: MessageCircle, match: (pathname) => pathname.startsWith('/app/assistant') },
  { href: '/app/notifications', label: 'Notificaciones', icon: Bell, match: (pathname) => pathname.startsWith('/app/notifications') },
];

// Updated to include match functions for better active state detection with /app prefix
export const NAV_ITEMS: NavItem[] = NAV_ITEMS_LOGGED_IN;

export const MOCK_TASKS_FOR_NEW_USER: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  { title: 'Meditación Matutina', time: '7:00 AM', category: 'Bienestar', priority: 'High', status: 'PENDIENTE', date: new Date() },
  { title: 'Planificar comidas de la semana', time: '9:00 AM', category: 'Hogar', priority: 'Medium', status: 'PENDIENTE', date: new Date() },
];
export const MOCK_TASKS: Task[] = [];


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

export const MOOD_OPTIONS = [
  { value: 'feliz', label: '😊 Feliz' },
  { value: 'calmada', label: '😌 Calmada' },
  { value: 'productiva', label: '🚀 Productiva' },
  { value: 'estresada', label: '😓 Estresada' },
  { value: 'cansada', label: '😴 Cansada' },
  { value: 'inspirada', label: '💡 Inspirada' },
  { value: 'agradecida', label: '🙏 Agradecida' },
];

export const MOCK_ROUTINES_TEMPLATES: Omit<Routine, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Mañana Energizante',
    description: 'Comienza tu día con energía y enfoque.',
    iconName: 'Zap',
    category: "Mañana",
    steps: ['Hidratación: Bebe un vaso de agua.', 'Movimiento: 5 minutos de estiramientos suaves.', 'Afirmación: Repite tu afirmación del día.', 'Planificación: Revisa tus 3 tareas principales.']
  },
  {
    title: 'Descanso Consciente',
    description: 'Una pausa para recargar energías durante el día.',
    iconName: 'Smile',
    category: "Bienestar",
    steps: ['Desconecta: Aléjate de las pantallas.', 'Respira: 3 respiraciones profundas y lentas.', 'Hidrátate: Bebe un poco de agua o té.', 'Estírate: Movimientos suaves de cuello y hombros.']
  },
];
export const MOCK_ROUTINES: Routine[] = [];


export const MOCK_BADGES: Badge[] = [
  { id: 'b1', title: 'Madrugadora Zen', description: 'Completaste 3 tareas matutinas esta semana.', iconUrl: 'https://placehold.co/100x100.png', achieved: true, imageHint: "sunrise medal" },
  { id: 'b2', title: 'Enfoque Total', description: 'Usaste el temporizador Pomodoro por 5 sesiones.', iconUrl: 'https://placehold.co/100x100.png', achieved: false, imageHint: "target icon" },
  { id: 'b3', title: 'Maestra de la Calma', description: 'Generaste 7 afirmaciones personalizadas.', iconUrl: 'https://placehold.co/100x100.png', achieved: true, imageHint: "zen badge" },
  { id: 'b4', title: 'Exploradora de Bienestar', description: 'Probaste una nueva rutina de bienestar.', iconUrl: 'https://placehold.co/100x100.png', achieved: false, imageHint: "compass award" }
];
