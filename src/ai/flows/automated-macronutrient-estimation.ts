'use server';
/**
 * @fileOverview This file provides a Genkit flow for automated macronutrient estimation.
 *
 * - estimateMealMacronutrients - A function that estimates the macronutrient content of a meal from natural language.
 * - EstimateMealMacronutrientsInput - The input type for the estimateMealMacronutrients function.
 * - EstimateMealMacronutrientsOutput - The return type for the estimateMealMacronutrients function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EstimateMealMacronutrientsInputSchema = z.object({
  mealDescription: z
    .string()
    .describe('A natural language description of the meal (e.g., "A bowl of oatmeal with a banana").'),
});
export type EstimateMealMacronutrientsInput = z.infer<typeof EstimateMealMacronutrientsInputSchema>;

const EstimateMealMacronutrientsOutputSchema = z.object({
  mealName: z.string().describe('A concise, appetizing name for the meal.'),
  totalCalories: z.number().describe('Estimated total calories (kcal).'),
  macronutrients: z.object({
    carbohydrates: z.number().describe('Grams of carbs.'),
    protein: z.number().describe('Grams of protein.'),
    fat: z.number().describe('Grams of fat.'),
  }),
  ingredients: z.array(z.object({
    name: z.string().describe('Ingredient name.'),
    quantity: z.string().describe('Estimated quantity (e.g., "1 cup").'),
  })),
});
export type EstimateMealMacronutrientsOutput = z.infer<typeof EstimateMealMacronutrientsOutputSchema>;

export async function estimateMealMacronutrients(input: EstimateMealMacronutrientsInput): Promise<EstimateMealMacronutrientsOutput> {
  return automatedMacronutrientEstimationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automatedMacronutrientEstimationPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: { schema: EstimateMealMacronutrientsInputSchema },
  output: { schema: EstimateMealMacronutrientsOutputSchema },
  system: 'You are a precise nutritional analysis engine. Break down meals into calories, macros (carbs, protein, fat), and ingredients based on common nutritional databases. Provide realistic estimates based on standard portions.',
  prompt: `Analyze this meal and provide a nutritional estimate:
  
  Meal Description: {{{mealDescription}}}
  
  If the description is too vague, use standard average portions for the mentioned foods. Always provide a mealName, totalCalories, and macronutrients.`,
});

const automatedMacronutrientEstimationFlow = ai.defineFlow(
  {
    name: 'automatedMacronutrientEstimationFlow',
    inputSchema: EstimateMealMacronutrientsInputSchema,
    outputSchema: EstimateMealMacronutrientsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI was unable to generate a valid response. Please try being more specific about portions.');
    }
    return output;
  }
);
