'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { generateAffirmation, type GenerateAffirmationInput } from '@/ai/flows/affirmation-generator';
import { useToast } from '@/hooks/use-toast';

export default function AffirmationsPage() {
  const [needs, setNeeds] = useState('');
  const [affirmation, setAffirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleGenerateAffirmation = async () => {
    if (!needs.trim()) {
      setError('Por favor, describe tus necesidades o metas.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setAffirmation('');

    try {
      const input: GenerateAffirmationInput = { needs };
      const result = await generateAffirmation(input);
      if (result.affirmation) {
        setAffirmation(result.affirmation);
        toast({
          title: "¡Afirmación Generada!",
          description: "Tu nueva afirmación está lista.",
        });
      } else {
        setError('No se pudo generar una afirmación. Por favor, inténtalo de nuevo.');
        toast({
          title: "Error",
          description: "Error al generar la afirmación.",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'Ocurrió un error inesperado.';
      setError(`Error al generar afirmación: ${errorMessage}`);
       toast({
          title: "Error",
          description: `Error al generar afirmación: ${errorMessage}`,
          variant: "destructive",
        });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center bg-primary/20 p-3 rounded-full mb-4">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Afirmaciones Personalizadas</h1>
        <p className="text-muted-foreground">Genera afirmaciones positivas adaptadas a tus necesidades y metas.</p>
      </header>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Crea Tu Afirmación</CardTitle>
          <CardDescription>Describe en qué quieres enfocarte o qué quieres lograr, y deja que la IA cree un mensaje positivo para ti.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="needs" className="text-base">Mis necesidades y metas:</Label>
            <Textarea
              id="needs"
              value={needs}
              onChange={(e) => setNeeds(e.target.value)}
              placeholder="Ej., 'Quiero sentirme más seguro/a y reducir el estrés relacionado con las tareas diarias.'"
              rows={4}
              className="resize-none text-base"
              aria-label="Describe tus necesidades y metas para la generación de afirmaciones"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-6">
          <Button
            onClick={handleGenerateAffirmation}
            disabled={isLoading}
            className="w-full md:w-auto text-base py-3 px-6"
            size="lg"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-5 w-5" />
            )}
            Generar Afirmación
          </Button>

          {isLoading && (
            <div className="text-center text-muted-foreground">
              <p>Creando tu afirmación personal...</p>
            </div>
          )}

          {affirmation && !isLoading && (
            <Card className="w-full bg-accent/30 border-accent shadow-md">
              <CardHeader>
                <CardTitle className="text-accent-foreground flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-primary" /> Tu Afirmación Diaria:
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium text-accent-foreground/90 text-center italic">
                  "{affirmation}"
                </p>
              </CardContent>
            </Card>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
