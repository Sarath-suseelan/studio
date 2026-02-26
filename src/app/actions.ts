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
    // Propagate a more descriptive error message to the UI
    throw new Error(error.message || 'Failed to estimate macronutrients. Please check your meal description and try again.');
  }
}
