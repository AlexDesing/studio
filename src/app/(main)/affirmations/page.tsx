'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, Wand2, PlusCircle, ImagePlus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from '@/components/ui/separator';
import { generateAffirmation, type GenerateAffirmationInput } from '@/ai/flows/affirmation-generator';
import type { VisionBoardItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

// Mock data for Vision Board - in a real app, this would come from a data source or user input
const initialVisionBoardItems: VisionBoardItem[] = [
  { id: 'vb1', imageUrl: 'https://placehold.co/400x300.png', imageHint: 'mountain sunrise', title: 'Alcanza tus Cumbres', description: 'Cada paso te acerca a la cima de tus sueños.' },
  { id: 'vb2', imageUrl: 'https://placehold.co/400x300.png', imageHint: 'serene forest', title: 'Conecta con tu Paz Interior', description: 'Encuentra la serenidad en tu viaje personal.' },
  { id: 'vb3', imageUrl: 'https://placehold.co/400x300.png', imageHint: 'open road sunset', title: 'Nuevos Horizontes te Esperan', description: 'Atrévete a explorar caminos desconocidos con valentía.' },
  { id: 'vb4', imageUrl: 'https://placehold.co/400x300.png', imageHint: 'growing plant', title: 'Crecimiento Constante', description: 'Nutre tus aspiraciones y observa cómo florecen.' },
];


export default function AffirmationsPage() {
  const [needs, setNeeds] = useState('');
  const [affirmation, setAffirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visionBoardItems, setVisionBoardItems] = useState<VisionBoardItem[]>(initialVisionBoardItems);
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
    <div className="container mx-auto max-w-3xl space-y-12">
      {/* Affirmation Generator Section */}
      <section>
        <header className="mb-8 text-center">
          <div className="inline-flex items-center justify-center bg-primary/20 p-3 rounded-full mb-4">
            <Wand2 className="h-10 w-10 text-primary" />
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
                <Sparkles className="mr-2 h-5 w-5" />
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
                    <Sparkles className="mr-2 h-5 w-5 text-primary" /> Tu Afirmación Personalizada:
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
      </section>

      <Separator className="my-12" />

      {/* Vision Board Section */}
      <section>
        <header className="mb-8 text-center">
          <div className="inline-flex items-center justify-center bg-secondary/20 p-3 rounded-full mb-4">
            <ImagePlus className="h-10 w-10 text-secondary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Mi Tablero de Visión</h2>
          <p className="text-muted-foreground">Un espacio para visualizar tus sueños y aspiraciones más profundas.</p>
        </header>
        
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
           <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Galería de Inspiración</CardTitle>
              <CardDescription>Visualiza tus metas y sueños.</CardDescription>
            </div>
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" /> Añadir Inspiración
            </Button>
          </CardHeader>
          <CardContent>
            {visionBoardItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {visionBoardItems.map(item => (
                  <Card key={item.id} className="overflow-hidden group hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105">
                    <div className="relative w-full h-56">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-500 group-hover:scale-110"
                        data-ai-hint={item.imageHint}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                    </div>
                    <CardFooter className="p-4 bg-background/80 backdrop-blur-sm">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{item.title}</h3>
                        {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <ImagePlus className="mx-auto h-12 w-12 mb-4" />
                <p className="text-lg">Tu tablero de visión está esperando tus sueños.</p>
                <p>¡Añade tu primera inspiración para empezar!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
