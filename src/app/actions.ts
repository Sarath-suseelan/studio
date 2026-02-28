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
    // Log the full error to the server console for deep debugging
    console.error('GENKIT_FLOW_ERROR_DIAGNOSTIC:', error);
    
    // Check for 404 (Model Not Found)
    if (errorMsg.includes('404') || errorMsg.includes('not found')) {
      throw new Error(
        `AI Model Error: ${errorMsg}. This usually means the model identifier is correct but the Generative Language API is still propagating or restricted for your key. Verify here: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com?project=studio-9575638122-44bb6`
      );
    }

    // Check for 403 (Permission Denied)
    if (errorMsg.includes('403') || errorMsg.includes('PERMISSION_DENIED')) {
      throw new Error(
        `AI access denied (403). Your API key might have restrictions or the project is not set up correctly. Check credentials at: https://console.cloud.google.com/apis/credentials?project=studio-9575638122-44bb6`
      );
    }
    
    throw new Error(`Analysis Failed: ${errorMsg}`);
  }
}
