'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, ChefHat, Sparkles as CleaningSparkles, HeartHandshake } from 'lucide-react'; 
import { MOCK_TIPS } from '@/lib/constants';
import type { Tip } from '@/lib/types';

interface TipCategory {
  value: string;
  label: string;
  icon: React.ElementType;
  tips: Tip[];
  illustrationHint: string;
}

export default function DailyTipsPage() {
  const [tipCategories, setTipCategories] = useState<TipCategory[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setTipCategories([
      { value: 'cleaning', label: 'Limpieza', icon: CleaningSparkles, tips: MOCK_TIPS.cleaning || [], illustrationHint: 'flat vector illustration cleaning tools' },
      { value: 'cooking', label: 'Cocina', icon: ChefHat, tips: MOCK_TIPS.cooking || [], illustrationHint: 'flat vector illustration cooking ingredients' },
      { value: 'organizing', label: 'Organización', icon: Lightbulb, tips: MOCK_TIPS.organizing || [], illustrationHint: 'flat vector illustration organized desk' },
      { value: 'wellbeing', label: 'Bienestar', icon: HeartHandshake, tips: MOCK_TIPS.wellbeing || [], illustrationHint: 'flat vector illustration yoga meditation' },
    ]);
  }, []);

  if (!isMounted) {
    return null; // Avoid hydration mismatch
  }
  
  const getTipOfTheDay = (category: TipCategory): Tip | null => {
    if (category.tips.length === 0) return null;
    // Simple logic: pick a tip based on the day of the month to vary it a bit
    const dayOfMonth = new Date().getDate();
    return category.tips[dayOfMonth % category.tips.length]; 
  };


  return (
    <div className="container mx-auto">
      <header className="mb-10 text-center">
        <div className="inline-flex items-center justify-center bg-primary/20 p-4 rounded-full mb-4">
            <Lightbulb className="h-12 w-12 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">Consejos Diarios para Ti</h1>
        <p className="text-lg text-muted-foreground mt-2">Pequeñas ideas para un gran impacto en tu día a día y bienestar.</p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">✨ Tus Consejos Destacados de Hoy ✨</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tipCategories.map(category => {
            const tip = getTipOfTheDay(category);
            return tip ? (
              <Card key={`today-${category.value}`} className="shadow-lg hover:shadow-xl transition-shadow bg-card border-secondary/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3 mb-2">
                    <category.icon className="h-7 w-7 text-primary" />
                    <CardTitle className="text-xl text-primary-foreground">{category.label}</CardTitle>
                  </div>
                  <CardDescription className="font-semibold text-lg text-foreground h-16 line-clamp-2">{tip.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground h-20 line-clamp-4">{tip.content}</p>
                </CardContent>
              </Card>
            ) : null;
          })}
        </div>
      </section>
      
      <Tabs defaultValue={tipCategories.length > 0 ? tipCategories[0].value : ""} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 h-auto py-2">
          {tipCategories.map(category => (
            <TabsTrigger key={category.value} value={category.value} className="flex items-center gap-2 text-base py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <category.icon className="h-5 w-5" />
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tipCategories.map(category => (
          <TabsContent key={category.value} value={category.value}>
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8 p-6 bg-secondary/30 rounded-lg">
              <div className="w-full md:w-1/3 flex justify-center">
                <Image 
                    src={`https://placehold.co/300x200.png`} 
                    alt={`Ilustración sobre ${category.label}`} 
                    width={300} 
                    height={200} 
                    className="rounded-lg object-cover"
                    data-ai-hint={category.illustrationHint}
                />
              </div>
              <div className="w-full md:w-2/3">
                <h3 className="text-2xl font-semibold text-secondary-foreground mb-3">Explora Consejos de {category.label}</h3>
                <p className="text-muted-foreground mb-4">
                  Encuentra inspiración y trucos prácticos para simplificar tus tareas y mejorar tu bienestar en el área de {category.label.toLowerCase()}.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.tips.length > 0 ? category.tips.map(tip => (
                <Card key={tip.id} className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg leading-tight">{tip.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">{tip.content}</p>
                  </CardContent>
                </Card>
              )) : (
                <p className="text-muted-foreground col-span-full text-center py-10">No hay consejos disponibles en esta categoría en este momento.</p>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
