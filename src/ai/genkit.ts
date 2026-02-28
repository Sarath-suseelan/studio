import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// We read the API key directly from the environment
const apiKey = process.env.GOOGLE_GENAI_API_KEY;

export const ai = genkit({
  plugins: [
    googleAI({ apiKey })
  ],
});
