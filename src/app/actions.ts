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
    // Log the full error for debugging
    console.error('GENKIT_FLOW_ERROR:', error);
    
    // Check for specific 404/NOT_FOUND errors which indicate API propagation delay
    if (error.message?.includes('404') || error.message?.includes('NOT_FOUND')) {
      throw new Error('AI Model is still initializing. This usually happens for a few minutes after a new API key is created. Please try again in 2-3 minutes.');
    }
    
    const message = error.message || 'The AI service is currently unavailable. Please try again in a moment.';
    throw new Error(message);
  }
}
