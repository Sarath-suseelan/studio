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
    console.error('GENKIT_FLOW_ERROR_DIAGNOSTIC:', error);
    
    // Check for 404 (Model Not Found) or 403 (Permission Denied)
    if (errorMsg.includes('404') || errorMsg.includes('not found') || errorMsg.includes('403') || errorMsg.includes('PERMISSION_DENIED')) {
      throw new Error(
        `AI Access Error: ${errorMsg}. Since you have enabled the API, please ensure the project ID in your Firebase console matches the one in the URL: studio-9575638122-44bb6. If it matches, wait 2-5 minutes for Google's API settings to fully propagate.`
      );
    }
    
    throw new Error(`Analysis Failed: ${errorMsg}`);
  }
}
