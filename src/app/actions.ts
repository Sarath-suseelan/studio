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
    // Show the raw error for better diagnostics
    const errorMsg = error.message || String(error);
    console.error('GENKIT_FLOW_ERROR:', error);
    
    throw new Error(`Analysis Failed: ${errorMsg}`);
  }
}
