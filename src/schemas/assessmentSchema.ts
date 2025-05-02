
import * as z from 'zod';
import { coerceToDate } from './utils';

export const assessmentSchema = z.object({
  title: z.string().min(3, { message: 'Título deve ter pelo menos 3 caracteres' }),
  description: z.string().optional().default(''),
  subjectId: z.string().min(1, { message: 'Selecione uma disciplina' }),
  teachingPlanId: z.string().optional().default(''),
  type: z.enum(['diagnostic', 'formative', 'summative'], {
    required_error: 'Tipo de avaliação é obrigatório'
  }),
  totalPoints: z.coerce.number({ required_error: 'Total de pontos é obrigatório' })
    .min(1, { message: 'Total de pontos deve ser pelo menos 1' }),
  date: coerceToDate({ required: true }),
  dueDate: coerceToDate(),
});

export type AssessmentSchemaValues = z.infer<typeof assessmentSchema>;
