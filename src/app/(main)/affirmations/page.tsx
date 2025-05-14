'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, Wand2, PlusCircle, ImagePlus, Heart, Smile, Zap } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from '@/components/ui/separator';
import { generateAffirmation, type GenerateAffirmationInput } from '@/ai/flows/affirmation-generator';
import type { VisionBoardItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { MOOD_OPTIONS } from '@/lib/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const initialVisionBoardItems: VisionBoardItem[] = [
  { id: 'vb1', imageUrl: 'https://placehold.co/400x300.png', imageHint: 'mountain sunrise', title: 'Alcanza tus Cumbres', description: 'Cada paso te acerca a la cima de tus sueños.' },
  { id: 'vb2', imageUrl: 'https://placehold.co/400x300.png', imageHint: 'serene forest', title: 'Conecta con tu Paz Interior', description: 'Encuentra la serenidad en tu viaje personal.' },
  { id: 'vb3', imageUrl: 'https://placehold.co/400x300.png', imageHint: 'open road sunset', title: 'Nuevos Horizontes te Esperan', description: 'Atrévete a explorar caminos desconocidos con valentía.' },
  { id: 'vb4', imageUrl: 'https://placehold.co/400x300.png', imageHint: 'growing plant', title: 'Crecimiento Constante', description: 'Nutre tus aspiraciones y observa cómo florecen.' },
];


export default function AffirmationsPage() {
  const [needs, setNeeds] = useState('');
  const [mood, setMood] = useState<string | undefined>(undefined);
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
    if (!needs.trim() && !mood) {
      setError('Por favor, describe tus necesidades o selecciona tu estado de ánimo.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setAffirmation('');

    try {
      const input: GenerateAffirmationInput = { needs, mood };
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
    <div className="container mx-auto max-w-4xl space-y-12">
      {/* Affirmation Generator Section */}
      <section>
        <header className="mb-8 text-center">
          <div className="inline-flex items-center justify-center bg-primary/20 p-3 rounded-full mb-4">
            <Wand2 className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Afirmaciones Personalizadas</h1>
          <p className="text-lg text-muted-foreground">Crea mensajes positivos que resuenen contigo y te impulsen.</p>
        </header>

        <Card className="shadow-xl overflow-hidden">
          <CardContent className="p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <Label htmlFor="mood" className="text-base font-semibold mb-2 block">¿Cómo te sientes hoy?</Label>
                <Select value={mood} onValueChange={setMood}>
                  <SelectTrigger id="mood" className="w-full text-base py-3">
                    <SelectValue placeholder="Selecciona tu estado de ánimo (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOOD_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value} className="text-base">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="needs" className="text-base font-semibold mb-2 block">O describe tus necesidades y metas:</Label>
                <Textarea
                  id="needs"
                  value={needs}
                  onChange={(e) => setNeeds(e.target.value)}
                  placeholder="Ej., 'Quiero sentirme más segura y reducir el estrés...'"
                  rows={3}
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
                <Button
                  onClick={handleGenerateAffirmation}
                  disabled={isLoading}
                  className="w-full text-lg py-4 px-6"
                  size="lg"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-6 w-6" />
                  )}
                  Generar Mi Afirmación
                </Button>
            </div>
            <div className="hidden md:flex justify-center items-center">
                 <Image src="https://placehold.co/300x300.png" alt="Ilustración de bienestar" width={300} height={300} className="rounded-lg" data-ai-hint="flat vector illustration wellbeing meditation" />
            </div>
          </CardContent>
          
          {(isLoading || affirmation) && (
            <CardFooter className="flex flex-col items-center p-6 md:p-8 bg-accent/20">
              {isLoading && (
                <div className="text-center text-muted-foreground mb-4">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-2" />
                  <p>Creando tu afirmación personal...</p>
                </div>
              )}

              {affirmation && !isLoading && (
                <Card className="w-full bg-background border-primary shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-primary-foreground flex items-center text-xl">
                      <Heart className="mr-2 h-6 w-6 text-primary" /> Tu Afirmación Personalizada:
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-medium text-foreground/90 text-center italic leading-relaxed">
                      "{affirmation}"
                    </p>
                  </CardContent>
                </Card>
              )}
            </CardFooter>
          )}
        </Card>
      </section>

      <Separator className="my-16" />

      {/* Vision Board Section */}
      <section>
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center bg-secondary/30 p-4 rounded-full mb-5">
            <ImagePlus className="h-12 w-12 text-secondary-foreground" />
          </div>
          <h2 className="text-4xl font-bold text-foreground">Mi Tablero de Visión</h2>
          <p className="text-lg text-muted-foreground mt-2">Un espacio sagrado para visualizar tus sueños y aspiraciones más profundas.</p>
        </header>
        
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-secondary">
           <CardHeader className="flex flex-row justify-between items-center p-6">
            <div>
              <CardTitle className="text-2xl">Galería de Inspiración</CardTitle>
              <CardDescription>Visualiza tus metas y sueños. ¡Hazlos realidad!</CardDescription>
            </div>
            <Button variant="outline" className="bg-secondary hover:bg-secondary/80 text-secondary-foreground">
              <PlusCircle className="mr-2 h-5 w-5" /> Añadir Inspiración
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            {visionBoardItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {visionBoardItems.map(item => (
                  <Card key={item.id} className="overflow-hidden group hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 border-transparent hover:border-primary">
                    <div className="relative w-full h-60">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-500 group-hover:scale-110"
                        data-ai-hint={item.imageHint}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                       <div className="absolute top-3 right-3 bg-primary/80 text-primary-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Zap size={20} />
                      </div>
                    </div>
                    <CardFooter className="p-5 bg-background/90 backdrop-blur-sm">
                      <div>
                        <h3 className="font-semibold text-xl text-foreground mb-1">{item.title}</h3>
                        {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <ImagePlus className="mx-auto h-16 w-16 mb-4 text-secondary-foreground" />
                <p className="text-xl mb-1">Tu tablero de visión está esperando tus sueños.</p>
                <p>¡Añade tu primera inspiración para empezar a manifestar!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
