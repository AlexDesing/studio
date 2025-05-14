// src/ai/flows/gemini-ai-assistant.ts
'use server';

/**
 * @fileOverview An AI assistant powered by Gemini to provide advice and encouragement.
 *
 * - geminiAiAssistant - A function that handles the AI assistant interaction.
 * - GeminiAiAssistantInput - The input type for the geminiAiAssistant function.
 * - GeminiAiAssistantOutput - The return type for the geminiAiAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeminiAiAssistantInputSchema = z.object({
  feedback: z.string().describe('The user feedback for the AI assistant.'),
});
export type GeminiAiAssistantInput = z.infer<typeof GeminiAiAssistantInputSchema>;

const GeminiAiAssistantOutputSchema = z.object({
  response: z.string().describe('The AI assistant response based on the feedback.'),
});
export type GeminiAiAssistantOutput = z.infer<typeof GeminiAiAssistantOutputSchema>;

export async function geminiAiAssistant(input: GeminiAiAssistantInput): Promise<GeminiAiAssistantOutput> {
  return geminiAiAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'geminiAiAssistantPrompt',
  input: {schema: GeminiAiAssistantInputSchema},
  output: {schema: GeminiAiAssistantOutputSchema},
  prompt: `You are a helpful and encouraging AI assistant designed to provide personalized support to users for their daily tasks and mental well-being.

  Based on the user's feedback, provide advice, encouragement, and positive affirmations.

  Feedback: {{{feedback}}}
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
