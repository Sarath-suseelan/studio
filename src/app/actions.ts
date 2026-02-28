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
    console.error('GENKIT_FLOW_ERROR_DEBUG:', error);
    
    // Check for 404 specifically
    if (errorMsg.includes('404') || errorMsg.includes('not found')) {
      throw new Error(
        "AI model not found (404). Please ensure 'Generative Language API' is enabled at: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com?project=studio-9575638122-44bb6"
      );
    }

    // Check for 403
    if (errorMsg.includes('403') || errorMsg.includes('PERMISSION_DENIED')) {
      throw new Error(
        "AI access denied (403). Ensure your API key has no restrictions and the API is enabled."
      );
    }
    
    throw new Error(`AI Analysis Failed: ${errorMsg.slice(0, 100)}`);
  }
}
