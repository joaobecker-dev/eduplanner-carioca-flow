
import * as z from 'zod';
import { coerceToDate } from './utils';

export const lessonPlanSchema = z.object({
  title: z.string().min(3, { message: 'Título deve ter pelo menos 3 caracteres' }),
  teachingPlanId: z.string().min(1, { message: 'Selecione um plano de ensino' }),
  date: coerceToDate({ required: true }),
  duration: z.number({ required_error: 'Duração é obrigatória' })
    .min(1, { message: 'Duração deve ser pelo menos 1 minuto' }),
  objectives: z.string().optional().default(''),
  contents: z.string().optional().default(''),
  activities: z.string().optional().default(''),
  resources: z.string().optional().default(''),
  homework: z.string().optional(),
  evaluation: z.string().optional(),
  notes: z.string().optional(),
});

export type LessonPlanSchemaValues = z.infer<typeof lessonPlanSchema>;
