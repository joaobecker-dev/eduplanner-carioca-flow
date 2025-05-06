
import * as z from 'zod';
import { coerceToDate } from './utils';

export const studentAssessmentSchema = z.object({
  studentId: z.string().min(1, { message: 'Selecione um estudante' }),
  assessmentId: z.string().min(1, { message: 'Selecione uma avaliação' }),
  score: z.coerce.number()
    .min(0, { message: 'A nota não pode ser negativa' })
    .max(10, { message: 'A nota não pode ser maior que 10' }),
  feedback: z.string().optional().default(''),
  submittedDate: coerceToDate(),
  gradedDate: coerceToDate(),
});

export type StudentAssessmentFormValues = z.infer<typeof studentAssessmentSchema>;
