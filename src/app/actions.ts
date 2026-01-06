'use server';

import {z} from 'zod';
import {generateStudySchedule, type GenerateStudyScheduleInput} from '@/ai/flows/generate-study-schedule';
import {refineStudySchedule, type RefineStudyScheduleInput} from '@/ai/flows/refine-study-schedule';
import {formSchema} from '@/lib/schema';
import 'dotenv/config';

export async function createScheduleAction(values: z.infer<typeof formSchema>) {
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

    const result = await generateStudySchedule(input);

    if (!result.schedule || !result.scheduleTable) {
       return { success: false, error: "The AI failed to generate a schedule. Please try again." };
    }

    return { success: true, schedule: result.schedule, scheduleTable: result.scheduleTable };
  } catch (error) {
    console.error("Error in createScheduleAction:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, error: `An unexpected error occurred while generating the schedule: ${errorMessage}. Please check your API key and configuration.` };
  }
}

export async function refineScheduleAction(initialSchedule: string, initialScheduleTable: string, feedback: string) {
  if (!feedback.trim()) {
    return { success: false, error: "Please provide feedback for refinement." };
  }

  try {
     const input: RefineStudyScheduleInput = {
      initialSchedule,
      initialScheduleTable,
      feedback,
    };

    const result = await refineStudySchedule(input);

    if (!result.refinedSchedule || !result.refinedScheduleTable) {
      return { success: false, error: "The AI failed to refine the schedule. Please try again." };
    }
    
    return { success: true, schedule: result.refinedSchedule, scheduleTable: result.refinedScheduleTable };
  } catch (error) {
    console.error("Error in refineScheduleAction:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, error: `An unexpected error occurred while refining the schedule: ${errorMessage}. Please check your API key and configuration.` };
  }
}
