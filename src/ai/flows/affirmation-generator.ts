// 'use server';
/**
 * @fileOverview Genera afirmaciones positivas diarias adaptadas a las necesidades y metas específicas del usuario usando IA.
 *
 * - generateAffirmation - Una función que genera una afirmación positiva diaria.
 * - GenerateAffirmationInput - El tipo de entrada para la función generateAffirmation.
 * - GenerateAffirmationOutput - El tipo de retorno para la función generateAffirmation.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAffirmationInputSchema = z.object({
  needs: z.string().describe('Las necesidades y metas específicas del usuario.'),
});
export type GenerateAffirmationInput = z.infer<typeof GenerateAffirmationInputSchema>;

const GenerateAffirmationOutputSchema = z.object({
  affirmation: z.string().describe('Una afirmación positiva adaptada a las necesidades y metas del usuario.'),
});
export type GenerateAffirmationOutput = z.infer<typeof GenerateAffirmationOutputSchema>;

export async function generateAffirmation(input: GenerateAffirmationInput): Promise<GenerateAffirmationOutput> {
  return generateAffirmationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAffirmationPrompt',
  input: {schema: GenerateAffirmationInputSchema},
  output: {schema: GenerateAffirmationOutputSchema},
  prompt: `Eres un asistente de IA útil que se especializa en proporcionar afirmaciones positivas.

  Basado en las necesidades y metas del usuario, genera una afirmación positiva que sea personalizada para él/ella.

  Necesidades y metas del usuario: {{{needs}}}
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
