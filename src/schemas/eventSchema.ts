
import * as z from 'zod';
import { EventType } from '@/types';

// Define event category labels
export const eventCategoryLabels: Record<string, string> = {
  'class': 'Aula',
  'exam': 'Avaliação',
  'meeting': 'Reunião',
  'deadline': 'Prazo',
  'other': 'Outro'
};

// Define event categories array
export const eventCategories = ['class', 'exam', 'meeting', 'deadline', 'other'] as const;

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

// Define form default values
export const eventFormDefaults = {
  title: '',
  description: '',
  type: 'class' as const,
  color: '#3b82f6',
  subjectId: '',
  location: '',
  startDate: new Date(),
  endDate: undefined,
  allDay: false,
  sourceType: 'manual' as const,
  sourceId: undefined,
};

export type EventFormValues = z.infer<typeof eventSchema>;
