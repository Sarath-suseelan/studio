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
    const isPermissionError = errorMsg.includes('403') || 
                             errorMsg.includes('PERMISSION_DENIED');
    const isKeyError = errorMsg.includes('API_KEY_INVALID') || 
                       errorMsg.includes('401');

    if (isPermissionError) {
      throw new Error(
        "AI services are currently unavailable for this project. Please ensure the 'Generative Language API' is enabled in your Google Cloud Console."
      );
    }

    if (isKeyError) {
      throw new Error(
        "Invalid API Key. Please check the credentials in your configuration."
      );
    }
    
    throw new Error(errorMsg || 'Failed to analyze meal. Please try again.');
  }
}
