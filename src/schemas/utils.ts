
import { z } from 'zod';

interface CoerceDateOptions {
  required?: boolean;
}

// Helper function to convert various date formats to a Date object
export const coerceToDate = (options?: CoerceDateOptions) => {
  const baseSchema = z.union([
    z.date(),
    z.string().refine((value) => !isNaN(Date.parse(value)), {
      message: 'Data inválida',
    }).transform(value => new Date(value)),
    z.number().transform(value => new Date(value)),
  ]);
  
  // Handle null/undefined based on if the field is required
  if (options?.required) {
    return baseSchema;
  } else {
    return baseSchema.nullish().optional();
  }
};
