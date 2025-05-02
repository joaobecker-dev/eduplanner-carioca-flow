
import { z } from 'zod';

/**
 * Helper function for coercing values to Date objects
 * Accepts string, Date, or null and transforms to a valid Date or undefined
 */
export const coerceToDate = (options?: { required?: boolean }) => {
  const schema = z.union([z.string(), z.date(), z.null()])
    .transform(value => {
      if (!value) return undefined;
      
      try {
        const date = new Date(value);
        // Ensure it's a valid date
        if (isNaN(date.getTime())) return undefined;
        return date;
      } catch (e) {
        return undefined;
      }
    });
    
  return options?.required 
    ? schema.refine(val => val !== undefined, { message: "Date is required" })
    : schema;
};
