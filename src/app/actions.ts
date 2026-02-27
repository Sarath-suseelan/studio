'use server';

import { estimateMealMacronutrients } from '@/ai/flows/automated-macronutrient-estimation';

export async function logMealWithAI(mealDescription: string) {
  if (!mealDescription.trim()) {
    throw new Error('Meal description cannot be empty.');
  }
  
  try {
    const result = await estimateMealMacronutrients({ mealDescription });
    return result;
  } catch (error: any) {
    console.error('AI Action Error:', error);
    
    // Check for specific API enablement error (403 Forbidden)
    const errorMsg = error.message || '';
    const isApiNotEnabled = errorMsg.includes('403') || 
                           errorMsg.includes('Generative Language API') ||
                           errorMsg.includes('not been used') ||
                           errorMsg.includes('PERMISSION_DENIED');

    if (isApiNotEnabled) {
      throw new Error('AI services are disabled. Please go to https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com and click ENABLE to fix this. It may take a minute to activate.');
    }
    
    // Propagate a more descriptive error message to the UI
    throw new Error(error.message || 'Failed to estimate macronutrients. Please check your meal description and try again.');
  }
}
