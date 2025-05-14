'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, ChefHat, Sparkles as CleaningSparkles, HeartHandshake } from 'lucide-react'; // Renamed to avoid conflict
import { MOCK_TIPS } from '@/lib/constants';
import type { Tip } from '@/lib/types';

interface TipCategory {
  value: string;
  label: string;
  icon: React.ElementType;
  tips: Tip[];
}

export default function DailyTipsPage() {
  const [tipCategories, setTipCategories] = useState<TipCategory[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // In a real app, tips might be fetched or dynamically generated
    // For translation, labels will now come from the translated MOCK_TIPS in constants.ts
    const categoriesFromConstants = [
        { value: 'cleaning', labelKey: 'Limpieza Rápida de Baño', icon: CleaningSparkles, tips: MOCK_TIPS.cleaning || [] }, // Example labelKey, actual label comes from MOCK_TIPS keys if structured that way
        { value: 'cooking', labelKey: 'Prepara Vegetales con Anticipación', icon: ChefHat, tips: MOCK_TIPS.cooking || [] },
        { value: 'organizing', labelKey: 'Orden Rápido de 15 Minutos', icon: Lightbulb, tips: MOCK_TIPS.organizing || [] },
        { value: 'wellbeing', labelKey: 'Recordatorio de Hidratación', icon: HeartHandshake, tips: MOCK_TIPS.wellbeing || [] },
    ];
    
    // This mapping assumes MOCK_TIPS keys match category values and we derive labels elsewhere or they are static.
    // For dynamic labels based on constants, this needs adjustment or labels defined directly here in Spanish.
    // For now, using static Spanish labels for TabsTrigger and ensuring MOCK_TIPS in constants.ts is translated for content.
    setTipCategories([
      { value: 'cleaning', label: 'Limpieza', icon: CleaningSparkles, tips: MOCK_TIPS.cleaning || [] },
      { value: 'cooking', label: 'Cocina', icon: ChefHat, tips: MOCK_TIPS.cooking || [] },
      { value: 'organizing', label: 'Organización', icon: Lightbulb, tips: MOCK_TIPS.organizing || [] },
      { value: 'wellbeing', label: 'Bienestar', icon: HeartHandshake, tips: MOCK_TIPS.wellbeing || [] },
    ]);
  }, []);

  if (!isMounted) {
    return null; // Avoid hydration mismatch
  }
  
  const getTipOfTheDay = (category: TipCategory): Tip | null => {
    if (category.tips.length === 0) return null;
    return category.tips[0]; 
  };


  return (
    <div className="container mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Consejos Diarios</h1>
        <p className="text-muted-foreground">Inspiración fresca para tus tareas diarias y bienestar.</p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Consejo del Día</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tipCategories.map(category => {
            const tip = getTipOfTheDay(category);
            return tip ? (
              <Card key={`today-${category.value}`} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-2">
                    <category.icon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg">{category.label}</CardTitle>
                  </div>
                  <CardDescription className="font-semibold text-foreground">{tip.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tip.content}</p>
                </CardContent>
              </Card>
            ) : null;
          })}
        </div>
      </section>
      
      <Tabs defaultValue={tipCategories.length > 0 ? tipCategories[0].value : ""} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          {tipCategories.map(category => (
            <TabsTrigger key={category.value} value={category.value} className="flex items-center gap-2">
              <category.icon className="h-4 w-4" />
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tipCategories.map(category => (
          <TabsContent key={category.value} value={category.value}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.tips.length > 0 ? category.tips.map(tip => (
                <Card key={tip.id} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-md">{tip.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
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
