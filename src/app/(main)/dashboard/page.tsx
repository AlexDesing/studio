'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Award, BarChart3, CheckCircle, ClipboardList, Lightbulb, Smile, Sparkles, Zap } from 'lucide-react';
import { MOCK_TASKS, MOCK_BADGES } from '@/lib/constants';
import type { Badge, Task } from '@/lib/types';
import { getDailyRecommendations, type DailyRecommendationInput } from '@/ai/flows/daily-recommendation-flow'; // Assuming this flow is created

interface Recommendation {
    title: string;
    description: string;
    category: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [badges, setBadges] = useState<Badge[]>(MOCK_BADGES);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchRecommendations();
  }, []);
  
  const fetchRecommendations = async () => {
    setIsLoadingRecs(true);
    try {
      const input: DailyRecommendationInput = { userContext: "Busco mejorar mi bienestar general y enfoque diario." };
      const result = await getDailyRecommendations(input);
      if (result.recommendations) {
        setRecommendations(result.recommendations);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      // Set some default/fallback recommendations or show an error message
      setRecommendations([
        { title: "Respira Profundo", description: "Toma 5 minutos para respiraciones conscientes y centrarte.", category: "Bienestar"},
        { title: "Pequeña Meta Diaria", description: "Define una tarea pequeña y alcanzable para hoy.", category: "Productividad"},
      ]);
    } finally {
      setIsLoadingRecs(false);
    }
  };

  if (!isMounted) {
    return null; // Avoid hydration mismatch
  }

  const completedTasks = tasks.filter(task => task.status === 'HECHO').length;
  const totalTasks = tasks.length;
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Mock data for other charts/metrics
  const weeklyHabitProgress = 75; // Percentage
  const wellbeingScore = 8; // Out of 10

  return (
    <div className="container mx-auto">
      <header className="mb-10 text-center">
         <div className="inline-flex items-center justify-center bg-primary/20 p-4 rounded-full mb-4">
            <Sparkles className="h-12 w-12 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">Tu Centro de Bienestar y Productividad</h1>
        <p className="text-lg text-muted-foreground mt-2">Un vistazo a tu progreso, inspiración y próximos pasos en CasaZen.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Task Progress */}
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Progreso de Tareas Semanal</CardTitle>
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{completedTasks}/{totalTasks} tareas</div>
            <Progress value={taskProgress} className="mt-2 h-3" />
            <p className="text-xs text-muted-foreground mt-1">
              {taskProgress > 70 ? "¡Excelente progreso esta semana!" : "Sigue esforzándote, ¡vas por buen camino!"}
            </p>
          </CardContent>
        </Card>

        {/* Habit Tracking Placeholder */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Seguimiento de Hábitos</CardTitle>
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{weeklyHabitProgress}% completado</div>
            {/* Placeholder for chart */}
            <div className="mt-2 h-[60px] bg-secondary/30 rounded-md flex items-center justify-center">
                <Image src="https://placehold.co/200x60.png" width={200} height={60} alt="Gráfico de hábitos" data-ai-hint="bar chart habit tracker" className="opacity-50"/>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Meta semanal de hábitos.</p>
          </CardContent>
        </Card>

        {/* Wellbeing Score Placeholder */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Nivel de Bienestar</CardTitle>
            <Smile className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{wellbeingScore}/10</div>
             {/* Placeholder for chart */}
            <div className="mt-2 h-[60px] bg-accent/20 rounded-md flex items-center justify-center">
                 <Image src="https://placehold.co/200x60.png" width={200} height={60} alt="Gráfico de bienestar" data-ai-hint="line graph mood trend" className="opacity-50"/>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Basado en tu estado de ánimo reciente.</p>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="md:col-span-2 lg:col-span-3 shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
                <Lightbulb className="h-7 w-7 text-primary" />
                <CardTitle className="text-xl">Recomendaciones Zen para Hoy</CardTitle>
            </div>
            <CardDescription>Sugerencias personalizadas por IA para potenciar tu día.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingRecs ? (
              <div className="flex items-center justify-center h-24">
                <Zap className="h-6 w-6 animate-ping text-primary" />
                <p className="ml-3 text-muted-foreground">Generando tus recomendaciones...</p>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((rec, index) => (
                  <Card key={index} className="bg-card-foreground/5 p-4">
                    <CardTitle className="text-md font-semibold text-foreground mb-1">{rec.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">{rec.description}</CardDescription>
                    <p className="text-xs text-primary mt-2 uppercase font-medium">{rec.category}</p>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No hay recomendaciones disponibles en este momento.</p>
            )}
          </CardContent>
           <CardFooter>
                <Button variant="link" onClick={fetchRecommendations} disabled={isLoadingRecs}>
                    {isLoadingRecs ? "Cargando..." : "Refrescar Recomendaciones"}
                </Button>
           </CardFooter>
        </Card>

        {/* Achievements/Badges */}
        <Card className="md:col-span-2 lg:col-span-3 shadow-lg">
          <CardHeader>
             <div className="flex items-center space-x-3">
                <Award className="h-7 w-7 text-yellow-500" />
                <CardTitle className="text-xl">Mis Logros y Reconocimientos</CardTitle>
            </div>
            <CardDescription>¡Celebra tus avances y dedicación!</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {badges.map(badge => (
              <div key={badge.id} className={`flex flex-col items-center text-center p-3 rounded-lg ${badge.achieved ? 'bg-green-500/10 border border-green-500/30' : 'bg-muted/50 opacity-60'}`}>
                <Image src={badge.iconUrl} alt={badge.title} width={60} height={60} className="mb-2 rounded-full" data-ai-hint={badge.imageHint} />
                <h4 className="text-sm font-semibold text-foreground">{badge.title}</h4>
                {badge.achieved && <CheckCircle className="h-4 w-4 text-green-500 mt-1" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
