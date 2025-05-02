
import * as z from 'zod';
import { coerceToDate } from './utils';

export const teachingPlanSchema = z.object({
  title: z.string().min(3, { message: 'Título deve ter pelo menos 3 caracteres' }),
  description: z.string().optional().default(''),
  annualPlanId: z.string().min(1, { message: 'Selecione um plano anual' }),
  subjectId: z.string().min(1, { message: 'Selecione uma disciplina' }),
  startDate: coerceToDate({ required: true }),
  endDate: coerceToDate({ required: true }),
  objectives: z.string().optional().default(''),
  bnccReferences: z.string().optional().default(''),
  contents: z.string().optional().default(''),
  methodology: z.string().optional().default(''),
  resources: z.string().optional().default(''),
  evaluation: z.string().optional().default(''),
});

export type TeachingPlanSchemaValues = z.infer<typeof teachingPlanSchema>;
