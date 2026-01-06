'use server';

/**
 * @fileOverview A study schedule generation AI agent.
 *
 * - generateStudySchedule - A function that handles the study schedule generation process.
 * - GenerateStudyScheduleInput - The input type for the generateStudySchedule function.
 * - GenerateStudyScheduleOutput - The return type for the generateStudySchedule function.
 */

import {z} from 'genkit';
import {ai} from '@/ai/genkit';

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
  schedule: z
    .string()
    .describe('The generated study schedule as a detailed, descriptive, and well-formatted Markdown text.'),
  scheduleTable: z
    .string()
    .describe(
      'A summary of the study schedule in a concise Markdown table format. Columns should include: Day, Date, Time, Topic/Subject, and Activity/Goal.'
    ),
});
export type GenerateStudyScheduleOutput = z.infer<typeof GenerateStudyScheduleOutputSchema>;


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
      prompt: `You are an expert study schedule generator. Your output must be in well-formatted Markdown.

You will use the following information to generate a personalized study schedule for the student.

Availability: {{{availability}}}
Understanding: {{{understanding}}}
Constraints: {{{constraints}}}
Topics: {{{topics}}}
Exam Date: {{{examDate}}}

Your output must contain two fields: 'schedule' and 'scheduleTable'.

1.  For the 'schedule' field, generate a detailed and realistic study schedule in well-formatted Markdown. Use headings, bold text, and lists to make it easy to read. This should be easy to follow and should help the student prepare for their exams effectively. Make the study plan achievable and descriptive.

2.  For the 'scheduleTable' field, create a concise summary of the schedule in a Markdown table.
    **This is extremely important. You MUST follow this format precisely.**
    The table MUST be a valid GitHub-Flavored Markdown table.
    Each row of the table MUST be on a new line.
    The table must have EXACTLY these columns: Day, Date, Time, Topic/Subject, and Activity/Goal.

    Here is an example of the required format:
    \`\`\`
    | Day   | Date          | Time              | Topic/Subject      | Activity/Goal                |
    |-------|---------------|-------------------|--------------------|------------------------------|
    | Mon   | Jan 1, 2024   | 6:00 PM - 7:00 PM | React Hooks        | Review useState and useEffect |
    | Mon   | Jan 1, 2024   | 7:00 PM - 8:00 PM | React Hooks        | Practice with custom hooks   |
    | Tue   | Jan 2, 2024   | 6:30 PM - 8:00 PM | European History   | Read Chapter 4               |
    \`\`\`
    Ensure your output for 'scheduleTable' follows this exact structure.
`,
    });
    const {output} = await prompt(input);
    return output!;
  }
);
  
export async function generateStudySchedule(
  input: GenerateStudyScheduleInput,
): Promise<GenerateStudyScheduleOutput> {
  return generateStudyScheduleFlow(input);
}
