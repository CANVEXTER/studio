
'use server';

import { z } from 'zod';
import { generateStudySchedule } from '@/ai/flows/generate-study-schedule';
import { refineStudySchedule } from '@/ai/flows/refine-study-schedule';

export const formSchema = z.object({
  topics: z.string().min(3, "Please list the topics you need to study."),
  examDate: z.date({ required_error: "Please select your exam date."}),
  understanding: z.string().min(1, "Please select your current understanding."),
  availability: z.string().min(10, "Please describe your general availability."),
  commitments: z.string().optional(),
  studyStyle: z.string().min(1, "Please select your preferred study style."),
  sessionLength: z.string().min(1, "Please select your preferred session length."),
  blockoutDays: z.string().optional(),
  goals: z.string().min(3, "Please tell us your main goal."),
  additionalInfo: z.string().optional(),
});

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

    const result = await generateStudySchedule({
      topics,
      examDate: examDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      understanding,
      availability,
      constraints,
    });

    if (!result.schedule) {
       return { success: false, error: "The AI failed to generate a schedule. Please try again." };
    }

    return { success: true, schedule: result.schedule };
  } catch (error) {
    console.error("Error in createScheduleAction:", error);
    return { success: false, error: "An unexpected error occurred while generating the schedule. Please try again." };
  }
}

export async function refineScheduleAction(initialSchedule: string, feedback: string) {
  if (!feedback.trim()) {
    return { success: false, error: "Please provide feedback for refinement." };
  }

  try {
    const result = await refineStudySchedule({
      initialSchedule,
      feedback,
    });

    if (!result.refinedSchedule) {
      return { success: false, error: "The AI failed to refine the schedule. Please try again." };
    }
    
    return { success: true, schedule: result.refinedSchedule };
  } catch (error) {
    console.error("Error in refineScheduleAction:", error);
    return { success: false, error: "An unexpected error occurred while refining the schedule. Please try again." };
  }
}
