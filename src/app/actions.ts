'use server';

import { estimateMealMacronutrients } from '@/ai/flows/automated-macronutrient-estimation';

/**
 * Server action to log a meal using AI analysis.
 * Uses Genkit to estimate nutritional content from a text description.
 */
export async function logMealWithAI(mealDescription: string) {
  if (!mealDescription.trim()) {
    throw new Error('Please describe what you ate.');
  }
  
  try {
    const result = await estimateMealMacronutrients({ mealDescription });
    return result;
  } catch (error: any) {
    // Log the error for internal tracking
    console.error('GENKIT_FLOW_ERROR:', error);
    
    // Provide a clean error message to the user
    // The prefixing of 'googleai/' in the flow should resolve the 404 issue
    const message = error.message || 'The AI service is currently unavailable. Please try again in a moment.';
    throw new Error(message);
  }
}
