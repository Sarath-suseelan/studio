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
    .describe('A natural language description of the meal (e.g., "A bowl of oatmeal with a banana and two spoons of peanut butter").'),
});
export type EstimateMealMacronutrientsInput = z.infer<typeof EstimateMealMacronutrientsInputSchema>;

const EstimateMealMacronutrientsOutputSchema = z.object({
  mealName: z.string().describe('A concise name for the meal.'),
  totalCalories: z.number().describe('Estimated total calories for the meal.'),
  macronutrients: z.object({
    carbohydrates: z.number().describe('Estimated carbohydrates in grams.'),
    protein: z.number().describe('Estimated protein in grams.'),
    fat: z.number().describe('Estimated fat in grams.'),
  }).describe('Estimated macronutrient breakdown.'),
  ingredients: z.array(z.object({
    name: z.string().describe('The name of the ingredient (e.g., "oatmeal", "banana").'),
    quantity: z.string().describe('The quantity of the ingredient (e.g., "1 bowl", "2 spoons").'),
  })).describe('A list of identified ingredients and their estimated quantities.'),
});
export type EstimateMealMacronutrientsOutput = z.infer<typeof EstimateMealMacronutrientsOutputSchema>;

export async function estimateMealMacronutrients(input: EstimateMealMacronutrientsInput): Promise<EstimateMealMacronutrientsOutput> {
  return automatedMacronutrientEstimationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automatedMacronutrientEstimationPrompt',
  input: { schema: EstimateMealMacronutrientsInputSchema },
  output: { schema: EstimateMealMacronutrientsOutputSchema },
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  },
  prompt: `You are an expert nutritionist and food scientist. Your task is to analyze a user's meal description and accurately estimate its macronutrient content (carbohydrates, protein, and fat in grams), total calories, and identify individual ingredients with their quantities. Provide a concise name for the meal.

Meal Description: {{{mealDescription}}}`,
});

const automatedMacronutrientEstimationFlow = ai.defineFlow(
  {
    name: 'automatedMacronutrientEstimationFlow',
    inputSchema: EstimateMealMacronutrientsInputSchema,
    outputSchema: EstimateMealMacronutrientsOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      if (!output) {
        throw new Error('The AI was unable to generate a nutritional estimate for this description. Please try being more specific.');
      }
      return output;
    } catch (error: any) {
      console.error('Flow Execution Error:', error);
      throw new Error(error.message || 'An unexpected error occurred during AI analysis.');
    }
  }
);
