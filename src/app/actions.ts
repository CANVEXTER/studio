'use server';

import {z} from 'zod';
import {generateStudySchedule, type GenerateStudyScheduleInput} from '@/ai/flows/generate-study-schedule';
import {refineStudySchedule, type RefineStudyScheduleInput} from '@/ai/flows/refine-study-schedule';
import {formSchema} from '@/lib/schema';
import { configureAi } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { openAI } from 'genkitx-openai';
import 'dotenv/config';

const aiConfigSchema = z.object({
  provider: z.enum(['google', 'openai']),
  apiKey: z.string().optional(),
  model: z.string().optional(),
  baseURL: z.string().optional(),
});

type AiConfig = z.infer<typeof aiConfigSchema>;

function getAi(config?: AiConfig) {
  if (config?.provider === 'openai') {
    return configureAi({
      plugins: [openAI({
        apiKey: config.apiKey || process.env.OPENAI_API_KEY!,
        baseURL: config.baseURL,
      })],
      model: config.model || 'openai/gpt-4o',
    });
  }
  
  // Default to Google AI
  return configureAi({
    plugins: [googleAI({apiKey: config?.apiKey || process.env.GEMINI_API_KEY})],
    model: config?.model || 'googleai/gemini-2.5-flash',
  });
}

export async function createScheduleAction(values: z.infer<typeof formSchema>, aiConfig?: AiConfig) {
  try {
    const { 
      topics,
      examDate,
      understanding,
      availability,
      commitments,
      studyStyle,
      sessionLength,
      blockoutDays,
      goals,
      additionalInfo
    } = values;

    const constraints = `
      - Fixed commitments: ${commitments || 'None'}
      - Preferred study style: ${studyStyle}
      - Preferred session length: ${sessionLength}
      - Days/times unavailable: ${blockoutDays || 'None'}
      - Main goal: ${goals}
      - Other notes: ${additionalInfo || 'None'}
    `.trim();

    const input: GenerateStudyScheduleInput = {
      topics,
      examDate: examDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      understanding,
      availability,
      constraints,
    };

    const ai = getAi(aiConfig);
    const result = await generateStudySchedule(input, ai);

    if (!result.schedule) {
       return { success: false, error: "The AI failed to generate a schedule. Please try again." };
    }

    return { success: true, schedule: result.schedule };
  } catch (error) {
    console.error("Error in createScheduleAction:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, error: `An unexpected error occurred while generating the schedule: ${errorMessage}. Please check your API key and configuration.` };
  }
}

export async function refineScheduleAction(initialSchedule: string, feedback: string, aiConfig?: AiConfig) {
  if (!feedback.trim()) {
    return { success: false, error: "Please provide feedback for refinement." };
  }

  try {
     const input: RefineStudyScheduleInput = {
      initialSchedule,
      feedback,
    };

    const ai = getAi(aiConfig);
    const result = await refineStudySchedule(input, ai);

    if (!result.refinedSchedule) {
      return { success: false, error: "The AI failed to refine the schedule. Please try again." };
    }
    
    return { success: true, schedule: result.refinedSchedule };
  } catch (error) {
    console.error("Error in refineScheduleAction:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, error: `An unexpected error occurred while refining the schedule: ${errorMessage}. Please check your API key and configuration.` };
  }
}
