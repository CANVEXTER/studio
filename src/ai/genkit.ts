import {genkit, type GenkitOptions} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {openAI} from 'genkitx-openai';

export function configureAi(options: GenkitOptions) {
  return genkit(options);
}

// Default export for client-side usage where config is not available.
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
