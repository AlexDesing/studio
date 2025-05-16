
'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, Wand2, PlusCircle, ImagePlus, Heart, Smile, Zap, Trash2, Edit3, Bookmark, BookOpen, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from '@/components/ui/separator';
import { generateAffirmation, type GenerateAffirmationInput } from '@/ai/flows/affirmation-generator';
import type { VisionBoardItem, SavedAffirmation } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { MOOD_OPTIONS } from '@/lib/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { 
  createVisionBoardItem, 
  deleteVisionBoardItem, 
  onVisionBoardItemsSnapshot,
  updateVisionBoardItem
} from '@/lib/firebase/firestore/visionBoardItems';
import { 
  createSavedAffirmation,
} from '@/lib/firebase/firestore/userAffirmations';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';

export default function AffirmationsPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const [needs, setNeeds] = useState('');
  const [mood, setMood] = useState<string | undefined>(undefined);
  const [generatedAffirmation, setGeneratedAffirmation] = useState('');
  const [isLoadingAffirmation, setIsLoadingAffirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [visionBoardItems, setVisionBoardItems] = useState<VisionBoardItem[]>([]);
  const [isLoadingVisionBoard, setIsLoadingVisionBoard] = useState(true);
  const [currentVisionPageIndex, setCurrentVisionPageIndex] = useState(0);
  
  const [isVisionBoardDialogOpen, setIsVisionBoardDialogOpen] = useState(false);
  const [editingVisionItem, setEditingVisionItem] = useState<VisionBoardItem | null>(null);
  const [visionItemTitle, setVisionItemTitle] = useState('');
  const [visionItemDescription, setVisionItemDescription] = useState('');
  const [visionItemImageUrl, setVisionItemImageUrl] = useState('');
  const [visionItemImageHint, setVisionItemImageHint] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    if (currentUser && !authLoading) {
      setIsLoadingVisionBoard(true);
      const unsubscribe = onVisionBoardItemsSnapshot(currentUser.uid, (items) => {
        setVisionBoardItems(items);
        // Only reset page index if it's out of bounds or initially
        if (currentVisionPageIndex >= items.length && items.length > 0) {
          setCurrentVisionPageIndex(items.length - 1);
        } else if (items.length === 0) {
          setCurrentVisionPageIndex(0);
        }
        setIsLoadingVisionBoard(false);
      });
      return () => unsubscribe();
    } else if (!currentUser && !authLoading) {
        setVisionBoardItems([]);
        setIsLoadingVisionBoard(false);
    }
  }, [currentUser, authLoading, currentVisionPageIndex]); // Added currentVisionPageIndex to dependencies to avoid stale closure issues if needed

  const handleGenerateAffirmation = async () => {
    if (!needs.trim() && !mood) {
      setError('Por favor, describe tus necesidades o selecciona tu estado de ánimo.');
      return;
    }
    setError(null);
    setIsLoadingAffirmation(true);
    setGeneratedAffirmation('');

    try {
      const input: GenerateAffirmationInput = { needs, mood };
      const result = await generateAffirmation(input);
      if (result.affirmation) {
        setGeneratedAffirmation(result.affirmation);
        toast({
          title: "¡Afirmación Generada!",
          description: "Tu nueva afirmación está lista.",
        });
      } else {
        setError('No se pudo generar una afirmación. Por favor, inténtalo de nuevo.');
        toast({
          title: "Error", description: "Error al generar la afirmación.", variant: "destructive",
        });
      }
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'Ocurrió un error inesperado.';
      setError(`Error al generar afirmación: ${errorMessage}`);
       toast({
          title: "Error", description: `Error al generar afirmación: ${errorMessage}`, variant: "destructive",
        });
    } finally {
      setIsLoadingAffirmation(false);
    }
  };
  
  const handleSaveGeneratedAffirmation = async () => {
    if (!currentUser || !generatedAffirmation) {
      toast({title: "Error", description: "No hay afirmación generada para guardar o no has iniciado sesión.", variant: "destructive"});
      return;
    }
    try {
      await createSavedAffirmation(currentUser.uid, {
        text: generatedAffirmation,
        mood: mood,
        needs: needs,
        isFavorite: false, 
      });
      toast({title: "Afirmación Guardada", description: "Tu afirmación ha sido guardada en tu colección."});
    } catch (error: any) {
      console.error("Error saving affirmation: ", error);
      toast({title: "Error al Guardar", description: `No se pudo guardar la afirmación: ${error.message}`, variant: "destructive"});
    }
  };

  // Vision Board Dialog Handlers
  const openAddVisionItemDialog = () => {
    setEditingVisionItem(null);
    setVisionItemTitle('');
    setVisionItemDescription('');
    setVisionItemImageUrl('https://placehold.co/600x400.png'); 
    setVisionItemImageHint('');
    setIsVisionBoardDialogOpen(true);
  };

  const openEditVisionItemDialog = (item: VisionBoardItem | undefined) => {
    if (!item) return;
    setEditingVisionItem(item);
    setVisionItemTitle(item.title);
    setVisionItemDescription(item.description || '');
    setVisionItemImageUrl(item.imageUrl);
    setVisionItemImageHint(item.imageHint);
    setIsVisionBoardDialogOpen(true);
  };
  
  const handleVisionItemImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVisionItemImageUrl(e.target.value);
  };

  const handleSaveVisionBoardItem = async () => {
    if (!currentUser || !visionItemTitle.trim() || !visionItemImageUrl.trim()) {
        toast({variant: "destructive", title: "Error", description: "El título y la URL de la imagen son obligatorios."});
        return;
    }
    
    const itemData = {
        title: visionItemTitle.trim(),
        description: visionItemDescription.trim(),
        imageUrl: visionItemImageUrl, 
        imageHint: visionItemImageHint.trim(),
    };

    try {
        if (editingVisionItem) {
            await updateVisionBoardItem(currentUser.uid, editingVisionItem.id, itemData);
            toast({title: "Elemento Actualizado"});
        } else {
            await createVisionBoardItem(currentUser.uid, itemData);
            toast({title: "Inspiración Añadida"});
        }
        setIsVisionBoardDialogOpen(false);
    } catch (error: any) {
        console.error("Error saving vision board item: ", error);
        toast({variant: "destructive", title: "Error al Guardar", description: error.message});
    }
  };

  const handleDeleteVisionBoardItem = async (itemId: string | undefined) => {
    if (!currentUser || !itemId) return;
    if (confirm('¿Estás segura de que quieres eliminar esta inspiración de tu tablero?')) {
        try {
            await deleteVisionBoardItem(currentUser.uid, itemId);
            toast({title: "Elemento Eliminado"});
            // Adjust current page if the deleted item was the last one and not the only one
            if (visionBoardItems.length -1 === 0) { // if it was the last item
                setCurrentVisionPageIndex(0);
            } else if (currentVisionPageIndex >= visionBoardItems.length - 1) { // If on the last page that now doesn't exist
                 setCurrentVisionPageIndex(Math.max(0, currentVisionPageIndex - 1));
            }
            // No need to manually filter visionBoardItems, onVisionBoardItemsSnapshot will update it
        } catch (error: any) {
            console.error("Error deleting vision board item: ", error);
            toast({variant: "destructive", title: "Error al Eliminar", description: error.message});
        }
    }
  };

  const currentVisionItem = visionBoardItems.length > 0 ? visionBoardItems[currentVisionPageIndex] : undefined;

  const goToPreviousPage = () => {
    setCurrentVisionPageIndex(prev => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentVisionPageIndex(prev => Math.min(visionBoardItems.length - 1, prev + 1));
  };

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }
  if (!currentUser && !authLoading) {
     return (
        <div className="container mx-auto text-center py-20">
            <h1 className="text-2xl font-semibold">Afirmaciones y Tablero de Visión</h1>
            <p className="text-muted-foreground mb-4">Inicia sesión para crear afirmaciones personalizadas y tu tablero de sueños.</p>
            <Button asChild><Link href="/login">Iniciar Sesión</Link></Button>
        </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl space-y-12">
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
                  disabled={isLoadingAffirmation}
                  className="w-full text-lg py-4 px-6"
                  size="lg"
                >
                  {isLoadingAffirmation ? (
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
          
          {(isLoadingAffirmation || generatedAffirmation) && (
            <CardFooter className="flex flex-col items-center p-6 md:p-8 bg-accent/20">
              {isLoadingAffirmation && (
                <div className="text-center text-muted-foreground mb-4">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-2" />
                  <p>Creando tu afirmación personal...</p>
                </div>
              )}

              {generatedAffirmation && !isLoadingAffirmation && (
                <Card className="w-full bg-background border-primary shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-primary-foreground flex items-center text-xl justify-between">
                      <div className="flex items-center">
                        <Heart className="mr-2 h-6 w-6 text-primary" /> Tu Afirmación Personalizada:
                      </div>
                      <Button variant="outline" size="sm" onClick={handleSaveGeneratedAffirmation} title="Guardar esta afirmación">
                        <Bookmark className="h-4 w-4"/>
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-medium text-foreground/90 text-center italic leading-relaxed">
                      "{generatedAffirmation}"
                    </p>
                  </CardContent>
                </Card>
              )}
            </CardFooter>
          )}
        </Card>
      </section>

      <Separator className="my-16" />

      {/* Vision Board "Book" Section */}
      <section>
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center bg-secondary/30 p-4 rounded-full mb-5">
            <BookOpen className="h-12 w-12 text-secondary-foreground" />
          </div>
          <h2 className="text-4xl font-bold text-foreground">Mi Diario de Visiones</h2>
          <p className="text-lg text-muted-foreground mt-2">Un espacio sagrado para plasmar y revisitar tus sueños más profundos.</p>
          <Button variant="outline" className="mt-6 bg-secondary hover:bg-secondary/80 text-secondary-foreground" onClick={openAddVisionItemDialog}>
            <PlusCircle className="mr-2 h-5 w-5" /> Añadir Nueva Visión
          </Button>
        </header>
        
        {isLoadingVisionBoard ? (
          <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary"/></div>
        ) : visionBoardItems.length > 0 && currentVisionItem ? (
          <Card className="shadow-2xl bg-card/90 backdrop-blur-sm border-secondary/50 rounded-xl overflow-hidden relative pb-16 min-h-[600px] flex flex-col">
            {/* Page Content */}
            <div 
              key={currentVisionItem.id} // Added key for animation trigger
              className="flex-grow p-6 md:p-10 bg-gradient-to-br from-background to-card/50 relative animate-in fade-in duration-500" // Added animation classes
            >
                {/* Page Curl Effect (decorative) */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-transparent via-transparent to-secondary/20 opacity-50 pointer-events-none" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
                
                <div className="relative w-full h-60 md:h-80 mb-6 rounded-lg overflow-hidden shadow-lg mx-auto max-w-md">
                  <Image
                    src={currentVisionItem.imageUrl}
                    alt={currentVisionItem.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-500 hover:scale-105"
                    data-ai-hint={currentVisionItem.imageHint || "vision board image"}
                    onError={(e) => e.currentTarget.src = 'https://placehold.co/600x400.png?text=Error+al+cargar'}
                  />
                </div>
                <div className="text-center">
                    <h3 className="font-semibold text-3xl text-foreground mb-2">{currentVisionItem.title}</h3>
                    {currentVisionItem.description && <p className="text-md text-muted-foreground mb-4 italic max-w-xl mx-auto">{currentVisionItem.description}</p>}
                    {currentVisionItem.createdAt && (
                        <div className="flex items-center justify-center text-sm text-muted-foreground/80 mt-4">
                            <CalendarDays className="mr-2 h-4 w-4" />
                            Agregado el: {currentVisionItem.createdAt instanceof Timestamp ? format(currentVisionItem.createdAt.toDate(), "PPP", { locale: es }) : format(new Date(currentVisionItem.createdAt), "PPP", { locale: es })}
                        </div>
                    )}
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                    <Button variant="outline" size="icon" className="h-9 w-9 bg-background/70 hover:bg-accent" onClick={() => openEditVisionItemDialog(currentVisionItem)}>
                        <Edit3 size={18} />
                        <span className="sr-only">Editar Visión</span>
                    </Button>
                    <Button variant="destructive" size="icon" className="h-9 w-9 bg-destructive/80 hover:bg-destructive" onClick={() => handleDeleteVisionBoardItem(currentVisionItem.id)}>
                        <Trash2 size={18} />
                         <span className="sr-only">Eliminar Visión</span>
                    </Button>
                </div>
            </div>

            {/* Book Navigation */}
            {visionBoardItems.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-4 bg-card-foreground/5 border-t border-secondary/30">
                <Button variant="ghost" onClick={goToPreviousPage} disabled={currentVisionPageIndex === 0} className="text-secondary-foreground hover:bg-secondary/20">
                  <ChevronLeft className="mr-2 h-5 w-5" /> Anterior
                </Button>
                <p className="text-sm text-muted-foreground">
                  Página {currentVisionPageIndex + 1} de {visionBoardItems.length}
                </p>
                <Button variant="ghost" onClick={goToNextPage} disabled={currentVisionPageIndex === visionBoardItems.length - 1} className="text-secondary-foreground hover:bg-secondary/20">
                  Siguiente <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
          </Card>
        ) : (
          <div className="text-center py-16 text-muted-foreground bg-card/50 rounded-lg shadow-md">
            <BookOpen className="mx-auto h-20 w-20 mb-6 text-secondary-foreground/70" />
            <p className="text-2xl mb-2">Tu diario de visiones está esperando.</p>
            <p className="text-lg">¡Añade tu primera visión para empezar a manifestar tus sueños!</p>
          </div>
        )}
      </section>

      {/* Vision Board Item Dialog */}
      <Dialog open={isVisionBoardDialogOpen} onOpenChange={setIsVisionBoardDialogOpen}>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>{editingVisionItem ? 'Editar Visión' : 'Añadir Nueva Visión'}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-1">
                  <Label htmlFor="vb-title">Título</Label>
                  <Input id="vb-title" value={visionItemTitle} onChange={(e) => setVisionItemTitle(e.target.value)} placeholder="Ej: Mi Cumbre Personal"/>
                </div>
                 <div className="space-y-1">
                  <Label htmlFor="vb-image-url">URL de la Imagen</Label>
                  <Input id="vb-image-url" value={visionItemImageUrl} onChange={handleVisionItemImageChange} placeholder="https://placehold.co/600x400.png"/>
                </div>
                {visionItemImageUrl && visionItemImageUrl.startsWith('https://') && (
                    <div className="my-2 flex justify-center">
                        <Image src={visionItemImageUrl} alt="Previsualización" width={200} height={150} className="rounded-md object-cover mx-auto" onError={(e) => e.currentTarget.style.display='none'}/>
                    </div>
                )}
                <div className="space-y-1">
                  <Label htmlFor="vb-desc">Descripción (opcional)</Label>
                  <Textarea id="vb-desc" value={visionItemDescription} onChange={(e) => setVisionItemDescription(e.target.value)} placeholder="Pequeña frase o nota..."/>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="vb-hint">Pista para IA (ej: "montaña amanecer")</Label>
                  <Input id="vb-hint" value={visionItemImageHint} onChange={(e) => setVisionItemImageHint(e.target.value)} placeholder="Dos palabras clave para la imagen"/>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsVisionBoardDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleSaveVisionBoardItem}>{editingVisionItem ? 'Guardar Cambios' : 'Añadir Visión'}</Button>
              </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}

    