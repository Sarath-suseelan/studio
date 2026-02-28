import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const apiKey = process.env.GOOGLE_GENAI_API_KEY;

if (!apiKey) {
  console.warn('Genkit: GOOGLE_GENAI_API_KEY is not set in the environment.');
}

export const ai = genkit({
  plugins: [
    googleAI({ apiKey })
  ],
  model: 'googleai/gemini-1.5-flash', // Using the string identifier which is more stable
});
