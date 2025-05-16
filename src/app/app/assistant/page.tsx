
'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Send, MessageCircle, User, Bot } from 'lucide-react'; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { geminiAiAssistant, type GeminiAiAssistantInput } from '@/ai/flows/gemini-ai-assistant';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AiAssistantPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    setMessages([
      { id: 'initial', text: "¡Hola! Soy tu asistente MovaZen. ¿Cómo puedo ayudarte a encontrar equilibrio y alegría hoy?", sender: 'ai', timestamp: new Date() }
    ]);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableView = scrollAreaRef.current.querySelector('div > div'); 
      if (scrollableView) {
        scrollableView.scrollTop = scrollableView.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: String(Date.now()),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      const aiInput: GeminiAiAssistantInput = { feedback: input };
      const result = await geminiAiAssistant(aiInput);

      if (result.response) {
        const aiMessage: Message = {
          id: String(Date.now() + 1),
          text: result.response,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        setError('El asistente no pudo proporcionar una respuesta. Por favor, inténtalo de nuevo.');
        toast({
          title: "Error del Asistente",
          description: "El asistente no pudo proporcionar una respuesta.",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'Ocurrió un error inesperado.';
      setError(`Error al obtener respuesta del asistente: ${errorMessage}`);
      toast({
          title: "Error de Conexión",
          description: `Error al obtener respuesta del asistente: ${errorMessage}`,
          variant: "destructive",
        });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };


  if (!isMounted) {
    return null; 
  }

  return (
    <div className="w-full max-w-3xl px-6 ml-[calc(max(0px,50vw-32rem))] flex flex-col h-[calc(100vh-10rem)]"> 
      <header className="mb-6 text-center">
         <div className="inline-flex items-center justify-center bg-primary/20 p-3 rounded-full mb-3">
          <Bot className="h-8 w-8 text-primary-foreground" /> 
        </div>
        <h1 className="text-3xl font-bold text-foreground">Asistente IA MovaZen</h1>
        <p className="text-muted-foreground">Tu guía personal para consejos, ánimo y bienestar integral.</p>
      </header>

      <Card className="flex-1 flex flex-col shadow-xl overflow-hidden border-primary/30">
        <CardHeader className="border-b border-primary/20">
          <CardTitle>Chatea con MovaZen IA</CardTitle>
          <CardDescription>Pide consejos, comparte tus sentimientos o busca una chispa de motivación.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-end space-x-2 max-w-[85%]",
                    message.sender === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''
                  )}
                >
                  <Avatar className="h-10 w-10"> 
                    <AvatarImage 
                      src={message.sender === 'ai' ? "https://placehold.co/80x80.png" : "https://placehold.co/80x80.png"} 
                      data-ai-hint={message.sender === 'ai' ? "animated friendly robot" : "person silhouette pastel"} 
                    />
                    <AvatarFallback className={cn(message.sender === 'ai' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground')}>
                      {message.sender === 'ai' ? <Bot/> : <User/>}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "p-3 rounded-lg shadow-md text-base", 
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-card-foreground/10 text-foreground rounded-bl-none'
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <p className={cn("text-xs mt-1", message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground/70')}>
                      {formatTimestamp(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-end space-x-2">
                  <Avatar className="h-10 w-10">
                     <AvatarImage src="https://placehold.co/80x80.png" data-ai-hint="animated friendly robot thinking" />
                    <AvatarFallback className="bg-secondary text-secondary-foreground"><Bot/></AvatarFallback>
                  </Avatar>
                  <div className="p-3 rounded-lg bg-card-foreground/10 text-foreground rounded-bl-none shadow-md">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 border-t border-primary/20">
          {error && (
            <Alert variant="destructive" className="mb-2">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1 text-base h-12" 
              aria-label="Entrada de chat"
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} size="lg" aria-label="Enviar mensaje"> 
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}
