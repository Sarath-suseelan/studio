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
    const errorMsg = error.message || String(error);
    console.error('GENKIT_FLOW_ERROR_LOG:', errorMsg);
    
    // Check for 404 specifically
    if (errorMsg.includes('404') || errorMsg.includes('not found')) {
      throw new Error(
        `AI Model Error: ${errorMsg}. Please ensure 'Generative Language API' is enabled for project studio-9575638122-44bb6.`
      );
    }

    // Check for 403
    if (errorMsg.includes('403') || errorMsg.includes('PERMISSION_DENIED')) {
      throw new Error(
        "AI access denied (403). Your API key might have restrictions or the API is not enabled."
      );
    }
    
    throw new Error(`Analysis Failed: ${errorMsg}`);
  }
}
