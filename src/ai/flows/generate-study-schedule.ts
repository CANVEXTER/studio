'use server';

/**
 * @fileOverview A study schedule generation AI agent.
 *
 * - generateStudySchedule - A function that handles the study schedule generation process.
 * - GenerateStudyScheduleInput - The input type for the generateStudySchedule function.
 * - GenerateStudyScheduleOutput - The return type for the generateStudySchedule function.
 */

import {type Genkit} from 'genkit';
import {z} from 'genkit';
import {ai as defaultAi} from '@/ai/genkit';

const GenerateStudyScheduleInputSchema = z.object({
  availability: z
    .string()
    .describe('The availability of the student, including specific days and times.'),
  understanding: z
    .string()
    .describe('The current understanding of the student regarding the topics.'),
  constraints: z
    .string()
    .describe('Any constraints or limitations the student has, such as work or family obligations.'),
  topics: z.string().describe('The topics the student needs to study.'),
  examDate: z.string().describe('The date of the exam.'),
});
export type GenerateStudyScheduleInput = z.infer<typeof GenerateStudyScheduleInputSchema>;

const GenerateStudyScheduleOutputSchema = z.object({
  schedule: z.string().describe('The generated study schedule.'),
});
export type GenerateStudyScheduleOutput = z.infer<typeof GenerateStudyScheduleOutputSchema>;

export async function generateStudySchedule(
  input: GenerateStudyScheduleInput,
  ai: Genkit = defaultAi,
): Promise<GenerateStudyScheduleOutput> {
  const generateStudyScheduleFlow = ai.defineFlow(
    {
      name: 'generateStudyScheduleFlow',
      inputSchema: GenerateStudyScheduleInputSchema,
      outputSchema: GenerateStudyScheduleOutputSchema,
    },
    async input => {
      const prompt = ai.definePrompt({
        name: 'generateStudySchedulePrompt',
        input: {schema: GenerateStudyScheduleInputSchema},
        output: {schema: GenerateStudyScheduleOutputSchema},
        prompt: `You are an expert study schedule generator.

You will use the following information to generate a personalized study schedule for the student.

Availability: {{{availability}}}
Understanding: {{{understanding}}}
Constraints: {{{constraints}}}
Topics: {{{topics}}}
Exam Date: {{{examDate}}}

Generate a detailed and realistic study schedule that takes into account all of the above information. The schedule should be easy to follow and should help the student to prepare for their exams effectively. Make sure the study plan is achievable.
`,
      });
      const {output} = await prompt(input);
      return output!;
    }
  );
  return generateStudyScheduleFlow(input);
}
