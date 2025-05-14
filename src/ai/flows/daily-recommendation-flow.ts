'use server';
/**
 * @fileOverview Genera recomendaciones diarias de hábitos y consejos usando IA.
 *
 * - getDailyRecommendations - Función que obtiene recomendaciones.
 * - DailyRecommendationInput - Tipo de entrada para la función.
 * - DailyRecommendationOutput - Tipo de retorno para la función.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailyRecommendationInputSchema = z.object({
  userContext: z.string().describe('Contexto o necesidad del usuario para las recomendaciones, ej. "sentirse estresado", "mejorar enfoque", "ideas para amas de casa ocupadas", "consejos para freelancers".'),
});
export type DailyRecommendationInput = z.infer<typeof DailyRecommendationInputSchema>;

const RecommendationSchema = z.object({
    title: z.string().describe("Título conciso de la recomendación."),
    description: z.string().describe("Descripción breve (1-2 frases) de la recomendación."),
    category: z.string().describe("Categoría de la recomendación (ej. Bienestar, Productividad, Hogar, Creatividad, Salud Mental).")
});

const DailyRecommendationOutputSchema = z.object({
  recommendations: z.array(RecommendationSchema).length(3).describe('Una lista de 3 recomendaciones personalizadas.'),
});
export type DailyRecommendationOutput = z.infer<typeof DailyRecommendationOutputSchema>;

export async function getDailyRecommendations(input: DailyRecommendationInput): Promise<DailyRecommendationOutput> {
  return dailyRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dailyRecommendationPrompt',
  input: {schema: DailyRecommendationInputSchema},
  output: {schema: DailyRecommendationOutputSchema},
  prompt: `Eres CasaZen AI, un coach de bienestar y productividad experto en ayudar a amas de casa, freelancers y creadoras de contenido.
Tu objetivo es proporcionar 3 recomendaciones prácticas y personalizadas basadas en el contexto del usuario.

Contexto del usuario: {{{userContext}}}

Por favor, genera 3 recomendaciones que sean:
- Relevantes para el contexto proporcionado.
- Accionables y fáciles de implementar.
- Variadas en sus categorías (ej. una de bienestar, una de productividad, una específica para su rol si se infiere).
- Positivas y alentadoras.

Formato de salida:
Cada recomendación debe tener un título, una descripción breve y una categoría.
Asegúrate de que la descripción sea útil y motivadora.
Intenta que las categorías sean diversas como "Bienestar Emocional", "Organización del Hogar", "Foco Creativo", "Salud Física", "Gestión del Tiempo", "Autocuidado Rápido".
`,
});

const dailyRecommendationFlow = ai.defineFlow(
  {
    name: 'dailyRecommendationFlow',
    inputSchema: DailyRecommendationInputSchema,
    outputSchema: DailyRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
