'use server';

import { estimateMealMacronutrients } from '@/ai/flows/automated-macronutrient-estimation';

export async function logMealWithAI(mealDescription: string) {
  if (!mealDescription.trim()) {
    throw new Error('Meal description cannot be empty.');
  }
  
  try {
    const result = await estimateMealMacronutrients({ mealDescription });
    if (!result || !result.mealName) {
      throw new Error('AI returned an empty response. Please try describing the meal differently.');
    }
    return result;
  } catch (error: any) {
    const errorMsg = error.message || String(error);
    console.error('AI Flow Error:', errorMsg);
    
    // Check for 403 Forbidden / Permission Denied errors
    const isPermissionError = errorMsg.includes('403') || 
                             errorMsg.includes('Generative Language API') ||
                             errorMsg.includes('PERMISSION_DENIED') ||
                             errorMsg.includes('API_KEY_INVALID');

    if (isPermissionError) {
      throw new Error(
        "AI Permission Error. Please check these two things:\n\n" +
        "1. API Key Restrictions: Go to the Google Cloud Console (APIs & Services > Credentials), find your API key, and ensure 'Generative Language API' is NOT restricted, or explicitly allowed.\n\n" +
        "2. API Enablement: Ensure the 'Generative Language API' is enabled for project 268822938094.\n\n" +
        "If both are correct, it may take a few more minutes to sync."
      );
    }
    
    throw new Error(errorMsg || 'Failed to analyze meal. Please try again.');
  }
}
