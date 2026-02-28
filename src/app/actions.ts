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
    console.error('GENKIT_FLOW_ERROR:', error);
    
    // Check for specific 404 errors which indicate model alias issues or propagation delay
    if (error.message?.includes('404') || error.message?.includes('NOT_FOUND')) {
      throw new Error('AI Model is not found. This can happen if the API key is very new (wait 5 mins) or if the Generative Language API is not fully enabled for this project.');
    }
    
    throw new Error(error.message || 'The AI service is currently unavailable. Please try again.');
  }
}
