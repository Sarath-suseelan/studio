import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Explicitly using the API key provided by the user
const apiKey = "AIzaSyB7F_ueJ4GNMjKSXAtPgFz7oK3XLkmmHTc";

export const ai = genkit({
  plugins: [
    googleAI({ apiKey })
  ],
});
