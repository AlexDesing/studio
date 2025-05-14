'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label';
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
      setError('Please describe your needs or goals.');
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
          title: "Affirmation Generated!",
          description: "Your new affirmation is ready.",
        });
      } else {
        setError('Could not generate an affirmation. Please try again.');
        toast({
          title: "Error",
          description: "Failed to generate affirmation.",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to generate affirmation: ${errorMessage}`);
       toast({
          title: "Error",
          description: `Failed to generate affirmation: ${errorMessage}`,
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
        <h1 className="text-3xl font-bold text-foreground">Personalized Affirmations</h1>
        <p className="text-muted-foreground">Generate positive affirmations tailored to your needs and goals.</p>
      </header>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Create Your Affirmation</CardTitle>
          <CardDescription>Describe what you want to focus on or achieve, and let AI craft a positive message for you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="needs" className="text-base">My needs & goals:</Label>
            <Textarea
              id="needs"
              value={needs}
              onChange={(e) => setNeeds(e.target.value)}
              placeholder="E.g., 'I want to feel more confident and reduce stress related to daily chores.'"
              rows={4}
              className="resize-none text-base"
              aria-label="Describe your needs and goals for affirmation generation"
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
            Generate Affirmation
          </Button>

          {isLoading && (
            <div className="text-center text-muted-foreground">
              <p>Crafting your personal affirmation...</p>
            </div>
          )}

          {affirmation && !isLoading && (
            <Card className="w-full bg-accent/30 border-accent shadow-md">
              <CardHeader>
                <CardTitle className="text-accent-foreground flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-primary" /> Your Daily Affirmation:
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
