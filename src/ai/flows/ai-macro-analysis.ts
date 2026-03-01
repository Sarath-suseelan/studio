'use server';
/**
 * @fileOverview A Genkit flow for analyzing food images to estimate macronutrient content.
 *
 * - aiMacroAnalysis - A function that handles the AI macro analysis process.
 * - AIMacroAnalysisInput - The input type for the aiMacroAnalysis function.
 * - AIMacroAnalysisOutput - The return type for the aiMacroAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIMacroAnalysisInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a meal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AIMacroAnalysisInput = z.infer<typeof AIMacroAnalysisInputSchema>;

const AIMacroAnalysisOutputSchema = z.object({
  foodItems: z.array(
    z.object({
      name: z.string().describe('The name of the identified food item.'),
      estimatedMacros: z.object({
        calories: z.number().describe('Estimated calories in kcal.'),
        protein: z.number().describe('Estimated protein in grams.'),
        carbs: z.number().describe('Estimated carbohydrates in grams.'),
        fat: z.number().describe('Estimated fat in grams.'),
      }),
    })
  ).describe('A list of identified food items and their estimated macronutrient content.'),
  overallSummary: z.string().describe('An overall summary of the meal and its estimated macronutrient breakdown.'),
});
export type AIMacroAnalysisOutput = z.infer<typeof AIMacroAnalysisOutputSchema>;

const aiMacroAnalysisPrompt = ai.definePrompt({
  name: 'aiMacroAnalysisPrompt',
  input: {schema: AIMacroAnalysisInputSchema},
  output: {schema: AIMacroAnalysisOutputSchema},
  // We rely on the default model defined in src/ai/genkit.ts
  prompt: `You are an expert nutritionist and food analyst. 
  
  Your task is to:
  1. Identify food items in the provided image.
  2. Estimate their macronutrient content (calories, protein, carbohydrates, and fat) based on standard portion sizes visible in the image.
  3. Provide a detailed breakdown for each identified item.
  4. Write a brief overall summary of the meal's nutritional profile.

  Image to analyze: {{media url=photoDataUri}}`,
});

const aiMacroAnalysisFlow = ai.defineFlow(
  {
    name: 'aiMacroAnalysisFlow',
    inputSchema: AIMacroAnalysisInputSchema,
    outputSchema: AIMacroAnalysisOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await aiMacroAnalysisPrompt(input);
      if (!output) {
        throw new Error('Failed to get macro analysis output from the model.');
      }
      return output;
    } catch (error) {
      console.error('Genkit flow error:', error);
      throw error;
    }
  }
);

export async function aiMacroAnalysis(input: AIMacroAnalysisInput): Promise<AIMacroAnalysisOutput> {
  return aiMacroAnalysisFlow(input);
}
