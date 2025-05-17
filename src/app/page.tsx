
'use client';

import type React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import AppLogo from '@/components/AppLogo'; 
import { Sparkles, ListChecks, Brain, CalendarDays, HeartHandshake, Users } from 'lucide-react';

// Componente para la barra de navegación de la landing page
const LandingNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <AppLogo iconSize={28}/>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="#features" className="text-muted-foreground hover:text-highlight-purple transition-colors">Características</Link>
            <Link href="#testimonials" className="text-muted-foreground hover:text-highlight-purple transition-colors">Testimonios</Link>
            <Link href="/login" legacyBehavior passHref>
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/signup" legacyBehavior passHref>
              <Button>Regístrate Gratis</Button>
            </Link>
          </div>
          <div className="md:hidden">
            <Link href="/login" legacyBehavior passHref>
              <Button variant="outline" size="sm">Acceder</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Componente para la sección de características
const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => {
  return (
    <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-lg text-center">
      <div className="p-3 mb-4 bg-primary/20 rounded-full text-primary-foreground">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight">
            MovaZen: Tu Oasis de <span className="text-primary-foreground">Calma</span> y <span className="text-secondary-foreground">Productividad</span>.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground">
            Organiza tus días, encuentra inspiración y cuida de ti con nuestra asistente inteligente diseñada para mujeres multifacéticas.
          </p>
          <div className="mt-10">
            <Link href="/signup" legacyBehavior passHref>
              <Button size="lg" className="text-lg px-10 py-7">
                <Sparkles className="mr-2 h-5 w-5" />
                Crea tu Cuenta Gratis
              </Button>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">Únete a MovaZen y transforma tu día a día.</p>
          </div>
          <div className="mt-12 md:mt-16 max-w-4xl mx-auto">
            <Image 
              src="https://placehold.co/1200x600.png" 
              alt="MovaZen App Showcase"
              width={1200}
              height={600}
              className="rounded-xl shadow-2xl"
              data-ai-hint="calm interface"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Todo lo que Necesitas para Brillar</h2>
            <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
              Herramientas intuitivas y personalizadas para tu bienestar y organización.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={CalendarDays}
              title="Planificador Diario Zen"
              description="Organiza tus tareas y citas con facilidad, priorizando lo que realmente importa para tu paz mental."
            />
            <FeatureCard 
              icon={Sparkles} // Using Sparkles for Afirmaciones con IA
              title="Afirmaciones con IA"
              description="Recibe afirmaciones positivas personalizadas que resuenan contigo y elevan tu ánimo cada día."
            />
            <FeatureCard 
              icon={ListChecks}
              title="Rutinas Personalizadas"
              description="Crea y sigue rutinas que te ayuden a construir hábitos positivos y a fluir con tus actividades diarias."
            />
             <FeatureCard 
              icon={Brain}
              title="Asistente MovaZen IA"
              description="Tu compañera virtual para consejos, ánimo y respuestas inteligentes que te apoyan en tu jornada."
            />
             <FeatureCard 
              icon={HeartHandshake}
              title="Tablero de Visión Inspirador"
              description="Plasma tus sueños y metas en un espacio digital emotivo que te motive a manifestarlos."
            />
             <FeatureCard 
              icon={Users} 
              title="Comunidad (Próximamente)"
              description="Conecta con otras mujeres, comparte experiencias y crece en un entorno de apoyo y comprensión."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section (Placeholder) */}
      <section id="testimonials" className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Amada por Mujeres como Tú</h2>
            <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
              Descubre cómo MovaZen está ayudando a otras a encontrar su equilibrio.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-6 bg-card rounded-lg shadow-lg">
                <p className="text-muted-foreground italic">"MovaZen ha cambiado mi forma de organizar mis mañanas. Ahora empiezo el día con más calma y enfoque. ¡Lo recomiendo totalmente!"</p>
                <div className="mt-4 flex items-center">
                  <Image src={'https://placehold.co/40x40.png'} alt={`Usuaria ${i}`} width={40} height={40} className="rounded-full" data-ai-hint="happy woman" />
                  <div className="ml-3">
                    <p className="font-semibold text-foreground">Nombre Usuaria {i}</p>
                    <p className="text-xs text-muted-foreground">Rol (Ej: Freelancer)</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-primary/20 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground">¿Lista para Transformar tu Día a Día?</h2>
          <p className="mt-4 max-w-xl mx-auto text-primary-foreground/80 mb-8">
            Únete a la comunidad MovaZen y empieza a construir una vida más organizada, consciente y llena de bienestar.
          </p>
          <Link href="/signup" legacyBehavior passHref>
            <Button size="lg" variant="default" className="text-lg px-10 py-7 bg-background text-foreground hover:bg-background/90">
              Sí, Quiero Empezar Ahora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <div className="flex justify-center mb-2">
            <AppLogo iconSize={20}/>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} MovaZen. Todos los derechos reservados.</p>
          <p className="text-sm mt-1">"Una mente sana refleja lo mejor."</p>
          <div className="mt-3 space-x-4 text-xs">
            <Link href="/privacy-policy" className="hover:text-highlight-purple">Política de Privacidad</Link>
            <span>|</span>
            <Link href="/terms-of-service" className="hover:text-highlight-purple">Términos de Servicio</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
