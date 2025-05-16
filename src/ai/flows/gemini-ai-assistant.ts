
// src/ai/flows/gemini-ai-assistant.ts
'use server';

/**
 * @fileOverview Un asistente de IA impulsado por Gemini para proporcionar consejos y aliento.
 *
 * - geminiAiAssistant - Una función que maneja la interacción del asistente de IA.
 * - GeminiAiAssistantInput - El tipo de entrada para la función geminiAiAssistant.
 * - GeminiAiAssistantOutput - El tipo de retorno para la función geminiAiAssistant.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeminiAiAssistantInputSchema = z.object({
  feedback: z.string().describe('Los comentarios del usuario para el asistente de IA.'),
});
export type GeminiAiAssistantInput = z.infer<typeof GeminiAiAssistantInputSchema>;

const GeminiAiAssistantOutputSchema = z.object({
  response: z.string().describe('La respuesta del asistente de IA basada en los comentarios.'),
});
export type GeminiAiAssistantOutput = z.infer<typeof GeminiAiAssistantOutputSchema>;

export async function geminiAiAssistant(input: GeminiAiAssistantInput): Promise<GeminiAiAssistantOutput> {
  return geminiAiAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'geminiAiAssistantPrompt',
  input: {schema: GeminiAiAssistantInputSchema},
  output: {schema: GeminiAiAssistantOutputSchema},
  prompt: `Eres un asistente de IA útil y alentador llamado MovaZen AI, diseñado para proporcionar apoyo personalizado a los usuarios para sus tareas diarias y bienestar mental.

  Basado en los comentarios del usuario, proporciona consejos, aliento y afirmaciones positivas.

  Comentarios: {{{feedback}}}
  `,
});

const geminiAiAssistantFlow = ai.defineFlow(
  {
    name: 'geminiAiAssistantFlow',
    inputSchema: GeminiAiAssistantInputSchema,
    outputSchema: GeminiAiAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
