
'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, Wand2, PlusCircle, ImagePlus, Heart, Smile, Zap, Trash2, Edit3, Bookmark } from 'lucide-react';
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
  // onSavedAffirmationsSnapshot, // If you want to display saved affirmations too
  // deleteSavedAffirmation 
} from '@/lib/firebase/firestore/userAffirmations';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
// import { uploadUserVisionBoardImage } from '@/lib/firebase/storage'; // Assuming a similar function to uploadUserAvatar exists or is created

// Helper for image uploads if direct upload to storage is implemented for vision board
// For now, we'll use placeholder URLs for simplicity of Firebase integration scope
// const handleImageUpload = async (file: File, userId: string): Promise<string> => {
//   // Example: return await uploadUserVisionBoardImage(userId, file);
//   return URL.createObjectURL(file); // Placeholder
// };


export default function AffirmationsPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const [needs, setNeeds] = useState('');
  const [mood, setMood] = useState<string | undefined>(undefined);
  const [generatedAffirmation, setGeneratedAffirmation] = useState('');
  const [isLoadingAffirmation, setIsLoadingAffirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [visionBoardItems, setVisionBoardItems] = useState<VisionBoardItem[]>([]);
  const [isLoadingVisionBoard, setIsLoadingVisionBoard] = useState(true);
  
  const [isVisionBoardDialogOpen, setIsVisionBoardDialogOpen] = useState(false);
  const [editingVisionItem, setEditingVisionItem] = useState<VisionBoardItem | null>(null);
  const [visionItemTitle, setVisionItemTitle] = useState('');
  const [visionItemDescription, setVisionItemDescription] = useState('');
  const [visionItemImageUrl, setVisionItemImageUrl] = useState('');
  const [visionItemImageHint, setVisionItemImageHint] = useState('');
  // const [visionItemImageFile, setVisionItemImageFile] = useState<File | null>(null);


  const { toast } = useToast();

  useEffect(() => {
    if (currentUser && !authLoading) {
      setIsLoadingVisionBoard(true);
      const unsubscribe = onVisionBoardItemsSnapshot(currentUser.uid, (items) => {
        setVisionBoardItems(items);
        setIsLoadingVisionBoard(false);
      });
      return () => unsubscribe();
    } else if (!currentUser && !authLoading) {
        setVisionBoardItems([]);
        setIsLoadingVisionBoard(false);
    }
  }, [currentUser, authLoading]);

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
        isFavorite: false, // Default, can be changed later
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
    setVisionItemImageUrl('https://placehold.co/400x300.png'); // Default placeholder
    setVisionItemImageHint('');
    // setVisionItemImageFile(null);
    setIsVisionBoardDialogOpen(true);
  };

  const openEditVisionItemDialog = (item: VisionBoardItem) => {
    setEditingVisionItem(item);
    setVisionItemTitle(item.title);
    setVisionItemDescription(item.description || '');
    setVisionItemImageUrl(item.imageUrl);
    setVisionItemImageHint(item.imageHint);
    // setVisionItemImageFile(null);
    setIsVisionBoardDialogOpen(true);
  };
  
  const handleVisionItemImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // For now, we'll just allow direct URL input or use placeholder
    // if (e.target.files && e.target.files[0]) {
    //   setVisionItemImageFile(e.target.files[0]);
    //   setVisionItemImageUrl(URL.createObjectURL(e.target.files[0]));
    // }
    // If using direct URL input:
    setVisionItemImageUrl(e.target.value);
  };


  const handleSaveVisionBoardItem = async () => {
    if (!currentUser || !visionItemTitle.trim() || !visionItemImageUrl.trim()) {
        toast({variant: "destructive", title: "Error", description: "El título y la URL de la imagen son obligatorios."});
        return;
    }
    
    // let finalImageUrl = visionItemImageUrl;
    // if (visionItemImageFile && currentUser) { // Prioritize uploaded file
    //   try {
    //     // finalImageUrl = await handleImageUpload(visionItemImageFile, currentUser.uid); // Implement this
    //   } catch (error) {
    //     toast({variant: "destructive", title: "Error de Carga", description: "No se pudo subir la imagen."});
    //     return;
    //   }
    // }
    
    const itemData = {
        title: visionItemTitle.trim(),
        description: visionItemDescription.trim(),
        imageUrl: visionItemImageUrl, // Use finalImageUrl if implementing upload
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

  const handleDeleteVisionBoardItem = async (itemId: string) => {
    if (!currentUser) return;
    try {
        await deleteVisionBoardItem(currentUser.uid, itemId);
        toast({title: "Elemento Eliminado"});
    } catch (error: any) {
        console.error("Error deleting vision board item: ", error);
        toast({variant: "destructive", title: "Error al Eliminar", description: error.message});
    }
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
            <Button variant="outline" className="bg-secondary hover:bg-secondary/80 text-secondary-foreground" onClick={openAddVisionItemDialog}>
              <PlusCircle className="mr-2 h-5 w-5" /> Añadir Inspiración
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            {isLoadingVisionBoard ? (
                <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>
            ) : visionBoardItems.length > 0 ? (
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
                        onError={(e) => e.currentTarget.src = 'https://placehold.co/400x300.png?text=Error+al+cargar'}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                       <div className="absolute top-3 right-3 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-primary/80 text-primary-foreground hover:bg-primary" onClick={() => openEditVisionItemDialog(item)}>
                            <Edit3 size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-destructive/80 text-destructive-foreground hover:bg-destructive" onClick={() => handleDeleteVisionBoardItem(item.id)}>
                            <Trash2 size={16} />
                        </Button>
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

      {/* Vision Board Item Dialog */}
      <Dialog open={isVisionBoardDialogOpen} onOpenChange={setIsVisionBoardDialogOpen}>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>{editingVisionItem ? 'Editar Inspiración' : 'Añadir Nueva Inspiración'}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-1">
                  <Label htmlFor="vb-title">Título</Label>
                  <Input id="vb-title" value={visionItemTitle} onChange={(e) => setVisionItemTitle(e.target.value)} placeholder="Ej: Mi Cumbre Personal"/>
                </div>
                 <div className="space-y-1">
                  <Label htmlFor="vb-image-url">URL de la Imagen</Label>
                  <Input id="vb-image-url" value={visionItemImageUrl} onChange={handleVisionItemImageChange} placeholder="https://placehold.co/600x400.png"/>
                  {/* <Label htmlFor="vb-image-file" className="text-sm text-muted-foreground mt-1 block">O sube un archivo:</Label>
                  <Input id="vb-image-file" type="file" accept="image/*" onChange={handleVisionItemImageChange} /> */}
                </div>
                {visionItemImageUrl && (
                    <div className="my-2">
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
                <Button onClick={handleSaveVisionBoardItem}>{editingVisionItem ? 'Guardar Cambios' : 'Añadir Inspiración'}</Button>
              </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}
