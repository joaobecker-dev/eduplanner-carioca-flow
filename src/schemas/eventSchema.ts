
import * as z from 'zod';
import { EventType } from '@/types';

// Define the form validation schema using zod
export const eventSchema = z.object({
  title: z.string().min(1, { message: "Título é obrigatório" }),
  description: z.string().optional(),
  type: z.enum(['class', 'exam', 'meeting', 'deadline', 'other'], {
    required_error: "Tipo de evento é obrigatório",
  }),
  color: z.string().optional(),
  subjectId: z.string().optional(),
  location: z.string().optional(),
  startDate: z.date({
    required_error: "Data de início é obrigatória",
  }),
  endDate: z.date().optional(),
  allDay: z.boolean().default(false),
  sourceType: z.enum(['assessment', 'lesson_plan', 'teaching_plan', 'manual']).optional(),
  sourceId: z.string().optional(),
});

export type EventFormValues = z.infer<typeof eventSchema>;
