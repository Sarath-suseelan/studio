
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
    
    // 404: Model not found
    if (errorMsg.includes('404') || errorMsg.includes('not found')) {
      throw new Error(
        "AI model not found (404). This usually means the 'Generative Language API' is not enabled or the API key does not have access to Gemini 1.5 Flash. Please check your Google Cloud Console."
      );
    }

    // 403: Permission denied
    if (errorMsg.includes('403') || errorMsg.includes('PERMISSION_DENIED')) {
      throw new Error(
        "AI services are currently unavailable (403). Check if your API key has IP, Referrer, or API restrictions in the Google Cloud Console (Credentials section)."
      );
    }
    
    throw new Error(`Failed to analyze meal: ${errorMsg.slice(0, 150)}`);
  }
}
