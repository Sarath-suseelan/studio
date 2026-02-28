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
    console.error('AI Flow Error Details:', error);
    
    // Check for specific API errors
    if (errorMsg.includes('404') || errorMsg.includes('not found')) {
      throw new Error(
        "The AI model could not be found. This is usually an authentication or model availability issue. Please ensure your API key is correctly configured and has access to Gemini 1.5 Flash."
      );
    }

    if (errorMsg.includes('403') || errorMsg.includes('PERMISSION_DENIED')) {
      throw new Error(
        "AI services are currently unavailable (403). Please ensure the 'Generative Language API' is enabled and your API key has no IP or referrer restrictions."
      );
    }
    
    throw new Error(`Failed to analyze meal: ${errorMsg.slice(0, 100)}`);
  }
}
