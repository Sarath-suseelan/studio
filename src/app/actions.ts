'use server';

import { estimateMealMacronutrients } from '@/ai/flows/automated-macronutrient-estimation';

export async function logMealWithAI(mealDescription: string) {
  if (!mealDescription.trim()) {
    throw new Error('Meal description cannot be empty.');
  }
  
  try {
    const result = await estimateMealMacronutrients({ mealDescription });
    if (!result || !result.mealName) {
      throw new Error('AI returned an invalid response. Please try describing the meal differently.');
    }
    return result;
  } catch (error: any) {
    const errorMsg = error.message || String(error);
    console.error('Detailed AI Error:', errorMsg);
    
    // Check if it's specifically a permission/enablement error
    const isPermissionError = errorMsg.includes('403') || 
                             errorMsg.includes('Generative Language API') ||
                             errorMsg.includes('PERMISSION_DENIED');

    if (isPermissionError) {
      // If it's still failing after enablement, it might be propagation delay
      throw new Error('AI service is still initializing. Since you just enabled it, please wait 1-2 minutes and try again. If it persists, ensure your API key has no restrictions.');
    }
    
    throw new Error(errorMsg || 'Failed to analyze meal. Please try a different description.');
  }
}
