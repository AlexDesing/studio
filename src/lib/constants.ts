import type { NavItem, Task, Tip, Routine, Badge } from '@/lib/types';
import { CalendarDays, Lightbulb, Sparkles, MessageCircle, Bell, Timer, ListChecks, LayoutDashboard, Smile, Zap, Award } from 'lucide-react';

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Planificador Diario', icon: CalendarDays },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/routines', label: 'Rutinas', icon: ListChecks },
  { href: '/pomodoro', label: 'Temporizador Pomodoro', icon: Timer },
  { href: '/tips', label: 'Consejos Diarios', icon: Lightbulb },
  { href: '/affirmations', label: 'Afirmaciones', icon: Sparkles },
  { href: '/assistant', label: 'Asistente IA', icon: MessageCircle },
  { href: '/notifications', label: 'Notificaciones', icon: Bell },
];

export const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Meditación Matutina', time: '7:00 AM', category: 'Bienestar', priority: 'High', completed: false, status: 'PENDIENTE', date: new Date() },
  { id: '2', title: 'Planificar comidas de la semana', time: '9:00 AM', category: 'Hogar', priority: 'Medium', completed: false, status: 'PENDIENTE', date: new Date() },
  { id: '3', title: 'Llamada con cliente X', time: '10:00 AM', category: 'Trabajo', priority: 'High', completed: false, status: 'EN PROGRESO', date: new Date() },
  { id: '4', title: 'Compras de Supermercado', time: '11:00 AM', category: 'Pendientes', priority: 'Medium', completed: false, status: 'PENDIENTE', date: new Date() },
  { id: '5', title: 'Escribir artículo para blog', time: '2:00 PM', category: 'Contenido', priority: 'High', completed: false, status: 'PENDIENTE', date: new Date() },
  { id: '6', title: 'Caminata de 30 min', time: '5:00 PM', category: 'Ejercicio', priority: 'High', completed: true, status: 'HECHO', date: new Date(new Date().setDate(new Date().getDate() -1)) }, // Tarea de ayer completada
  { id: '7', title: 'Leer un capítulo de un libro', time: '8:00 PM', category: 'Autocuidado', priority: 'Low', completed: false, status: 'PENDIENTE', date: new Date() },
  { id: '8', title: 'Revisar emails y responder', time: 'N/A', category: 'Trabajo', priority: 'Medium', completed: true, status: 'HECHO', date: new Date() },
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

export const MOOD_OPTIONS = [
  { value: 'feliz', label: '😊 Feliz' },
  { value: 'calmada', label: '😌 Calmada' },
  { value: 'productiva', label: '🚀 Productiva' },
  { value: 'estresada', label: '😓 Estresada' },
  { value: 'cansada', label: '😴 Cansada' },
  { value: 'inspirada', label: '💡 Inspirada' },
  { value: 'agradecida', label: '🙏 Agradecida' },
];

export const MOCK_ROUTINES: Routine[] = [
  {
    id: 'routine1',
    title: 'Mañana Energizante',
    description: 'Comienza tu día con energía y enfoque.',
    icon: Zap,
    category: "Mañana",
    steps: ['Hidratación: Bebe un vaso de agua.', 'Movimiento: 5 minutos de estiramientos suaves.', 'Afirmación: Repite tu afirmación del día.', 'Planificación: Revisa tus 3 tareas principales.']
  },
  {
    id: 'routine2',
    title: 'Descanso Consciente',
    description: 'Una pausa para recargar energías durante el día.',
    icon: Smile,
    category: "Bienestar",
    steps: ['Desconecta: Aléjate de las pantallas.', 'Respira: 3 respiraciones profundas y lentas.', 'Hidrátate: Bebe un poco de agua o té.', 'Estírate: Movimientos suaves de cuello y hombros.']
  },
  {
    id: 'routine3',
    title: 'Cierre de Jornada Laboral',
    description: 'Finaliza tu trabajo y prepárate para desconectar.',
    icon: ListChecks,
    category: "Productividad",
    steps: ['Revisión: Anota pendientes para mañana.', 'Orden: Organiza tu espacio de trabajo.', 'Agradecimiento: Piensa en un logro del día.', 'Desconexión: Cierra aplicaciones de trabajo.']
  }
];

export const MOCK_BADGES: Badge[] = [
  { id: 'b1', title: 'Madrugadora Zen', description: 'Completaste 3 tareas matutinas esta semana.', iconUrl: 'https://placehold.co/100x100.png', achieved: true, imageHint: "sunrise medal" },
  { id: 'b2', title: 'Enfoque Total', description: 'Usaste el temporizador Pomodoro por 5 sesiones.', iconUrl: 'https://placehold.co/100x100.png', achieved: false, imageHint: "target icon" },
  { id: 'b3', title: 'Maestra de la Calma', description: 'Generaste 7 afirmaciones personalizadas.', iconUrl: 'https://placehold.co/100x100.png', achieved: true, imageHint: "zen badge" },
  { id: 'b4', title: 'Exploradora de Bienestar', description: 'Probaste una nueva rutina de bienestar.', iconUrl: 'https://placehold.co/100x100.png', achieved: false, imageHint: "compass award" }
];
