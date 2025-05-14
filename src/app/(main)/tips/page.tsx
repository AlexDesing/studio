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
    setTipCategories([
      { value: 'cleaning', label: 'Cleaning', icon: CleaningSparkles, tips: MOCK_TIPS.cleaning || [] },
      { value: 'cooking', label: 'Cooking', icon: ChefHat, tips: MOCK_TIPS.cooking || [] },
      { value: 'organizing', label: 'Organizing', icon: Lightbulb, tips: MOCK_TIPS.organizing || [] },
      { value: 'wellbeing', label: 'Well-being', icon: HeartHandshake, tips: MOCK_TIPS.wellbeing || [] },
    ]);
  }, []);

  if (!isMounted) {
    return null; // Avoid hydration mismatch
  }
  
  // Function to select one random tip per category for "Tip of the Day"
  const getTipOfTheDay = (category: TipCategory): Tip | null => {
    if (category.tips.length === 0) return null;
    // For consistent "Tip of the Day" during a session, this could be memoized or based on date
    // For now, just pick the first one for simplicity
    return category.tips[0]; 
  };


  return (
    <div className="container mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Daily Tips</h1>
        <p className="text-muted-foreground">Fresh inspiration for your daily tasks and well-being.</p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Tip of the Day</h2>
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
                <p className="text-muted-foreground col-span-full text-center py-10">No tips available in this category right now.</p>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
