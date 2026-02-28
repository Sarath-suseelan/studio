import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// We prioritize the key provided by the user for reliability
const apiKey = process.env.GOOGLE_GENAI_API_KEY || "AIzaSyB7F_ueJ4GNMjKSXAtPgFz7oK3XLkmmHTc";

export const ai = genkit({
  plugins: [
    googleAI({ apiKey })
  ],
});
