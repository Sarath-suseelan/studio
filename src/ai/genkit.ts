import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Using the explicit API key provided: AIzaSyB7F_ueJ4GNMjKSXAtPgFz7oK3XLkmmHTc
const apiKey = "AIzaSyB7F_ueJ4GNMjKSXAtPgFz7oK3XLkmmHTc";

export const ai = genkit({
  plugins: [
    googleAI({ apiKey })
  ],
});
