'use server';

import { estimateMealMacronutrients } from '@/ai/flows/automated-macronutrient-estimation';

export async function logMealWithAI(mealDescription: string) {
  if (!mealDescription.trim()) {
    throw new Error('Meal description cannot be empty.');
  }
  
  try {
    const result = await estimateMealMacronutrients({ mealDescription });
    if (!result || !result.mealName) {
      throw new Error('AI was unable to analyze this meal. Please try a different description.');
    }
    return result;
  } catch (error: any) {
    const errorMsg = error.message || String(error);
    console.error('AI Flow Error:', errorMsg);
    
    // Check for specific API errors
    if (errorMsg.includes('404') || errorMsg.includes('not found')) {
      throw new Error(
        "The AI model could not be found. This might be a temporary service issue or an invalid model identifier. Please try again in a few moments."
      );
    }

    if (errorMsg.includes('403') || errorMsg.includes('PERMISSION_DENIED')) {
      throw new Error(
        "AI services are currently unavailable. Please ensure the 'Generative Language API' is enabled and your API key is valid."
      );
    }
    
    throw new Error('Failed to analyze meal. Please try again.');
  }
}
