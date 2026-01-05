import { z } from 'zod';

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
