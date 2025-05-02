
import * as z from 'zod';
import { coerceToDate } from './utils';

export const teachingPlanSchema = z.object({
  title: z.string().min(3, { message: 'Título deve ter pelo menos 3 caracteres' }),
  description: z.string().optional().default(''),
  annualPlanId: z.string().min(1, { message: 'Selecione um plano anual' }),
  subjectId: z.string().min(1, { message: 'Selecione uma disciplina' }),
  startDate: coerceToDate({ required: true }),
  endDate: coerceToDate({ required: true }),
  objectives: z.array(z.string()).default([]),
  bnccReferences: z.array(z.string()).default([]),
  contents: z.array(z.string()).default([]),
  methodology: z.string().min(10, { message: 'A metodologia deve ter pelo menos 10 caracteres' }),
  resources: z.array(z.string()).default([]),
  evaluation: z.string().min(10, { message: 'Os métodos de avaliação devem ser descritos' }),
});

export type TeachingPlanSchemaValues = z.infer<typeof teachingPlanSchema>;
