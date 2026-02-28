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
    
    const errorMsg = error.message || '';
    // Specifically looking for 403 Forbidden which indicates API not enabled
    const isApiNotEnabled = errorMsg.includes('403') || 
                           errorMsg.includes('Generative Language API') ||
                           errorMsg.includes('PERMISSION_DENIED');

    if (isApiNotEnabled) {
      // The project ID/number is derived from your Firebase config (268822938094)
      throw new Error('AI services are disabled. Please go to https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com?project=268822938094 and click ENABLE to fix this. It takes about a minute to activate.');
    }
    
    throw new Error(error.message || 'Failed to analyze meal. Please try a different description.');
  }
}
