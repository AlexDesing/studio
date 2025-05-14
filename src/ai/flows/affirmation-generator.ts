'use server';
/**
 * @fileOverview Genera afirmaciones positivas diarias adaptadas a las necesidades, metas y estado de ánimo del usuario usando IA.
 *
 * - generateAffirmation - Una función que genera una afirmación positiva diaria.
 * - GenerateAffirmationInput - El tipo de entrada para la función generateAffirmation.
 * - GenerateAffirmationOutput - El tipo de retorno para la función generateAffirmation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAffirmationInputSchema = z.object({
  needs: z.string().optional().describe('Las necesidades y metas específicas del usuario (opcional).'),
  mood: z.string().optional().describe('El estado de ánimo actual del usuario (opcional).'),
});
export type GenerateAffirmationInput = z.infer<typeof GenerateAffirmationInputSchema>;

const GenerateAffirmationOutputSchema = z.object({
  affirmation: z.string().describe('Una afirmación positiva adaptada al usuario.'),
});
export type GenerateAffirmationOutput = z.infer<typeof GenerateAffirmationOutputSchema>;

export async function generateAffirmation(input: GenerateAffirmationInput): Promise<GenerateAffirmationOutput> {
  return generateAffirmationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAffirmationPrompt',
  input: {schema: GenerateAffirmationInputSchema},
  output: {schema: GenerateAffirmationOutputSchema},
  prompt: `Eres un asistente de IA compasivo y experto en crear afirmaciones poderosas y personalizadas.
Genera una afirmación positiva única y alentadora. Considera los siguientes aspectos si están disponibles:
{{#if mood}}
- Estado de ánimo actual del usuario: {{{mood}}}
{{/if}}
{{#if needs}}
- Necesidades y metas específicas del usuario: {{{needs}}}
{{/if}}
{{#unless mood}}{{#unless needs}}
- El usuario no ha especificado un estado de ánimo o necesidad. Crea una afirmación general inspiradora sobre el amor propio y el potencial interior.
{{/unless}}{{/unless}}

La afirmación debe ser:
- En primera persona.
- Positiva y empoderadora.
- Concisa y fácil de recordar.
- Relevante para el contexto proporcionado (ánimo/necesidades).
- Evita clichés y frases genéricas si es posible, busca un toque original.
`,
});

const generateAffirmationFlow = ai.defineFlow(
  {
    name: 'generateAffirmationFlow',
    inputSchema: GenerateAffirmationInputSchema,
    outputSchema: GenerateAffirmationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
