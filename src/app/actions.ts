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
    
    // Check for common permission/configuration errors
    const isPermissionError = errorMsg.includes('403') || 
                             errorMsg.includes('PERMISSION_DENIED') ||
                             errorMsg.includes('API_KEY_INVALID');

    if (isPermissionError) {
      throw new Error(
        "AI Authentication Error. Please verify that your API Key is correctly configured and that the 'Generative Language API' is enabled in your Google Cloud Console."
      );
    }
    
    throw new Error(errorMsg || 'Failed to analyze meal. Please try again.');
  }
}
