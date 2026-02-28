import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Using the explicit API key provided for the Gemini API
const apiKey = "AIzaSyB7F_ueJ4GNMjKSXAtPgFz7oK3XLkmmHTc";

export const ai = genkit({
  plugins: [
    googleAI({ apiKey })
  ],
});
