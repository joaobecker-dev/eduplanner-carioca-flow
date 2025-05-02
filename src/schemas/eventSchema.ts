import * as z from 'zod';

// Define event categories as a string literal type
const eventCategories = ['Aula', 'Avaliação', 'Reunião', 'Outro'] as const;

export const eventSchema = z.object({
  title: z.string().min(1, { message: "O título é obrigatório" }),
  description: z.string().optional(),
  start_date: z.date({ required_error: "A data de início é obrigatória" }),
  end_date: z.date({ required_error: "A data de término é obrigatória" }).nullable().optional(),
  category: z.enum(eventCategories, {
    errorMap: () => ({ message: "Selecione uma categoria válida" })
  }),
  color: z.string().optional(),
  all_day: z.boolean().default(false),
  subject_id: z.string().uuid().nullable().optional(),
});

export type EventFormValues = z.infer<typeof eventSchema>;

export const eventCategoryOptions = eventCategories.map(category => ({
  label: category,
  value: category
}));

// Helper function to map category to type
export const mapCategoryToType = (category: string): 'class' | 'exam' | 'meeting' | 'other' => {
  switch (category) {
    case 'Aula':
      return 'class';
    case 'Avaliação':
      return 'exam';
    case 'Reunião':
      return 'meeting';
    default:
      return 'other';
  }
};

// Helper function to map type to category
export const mapTypeToCategory = (type: string): string => {
  switch (type) {
    case 'class':
      return 'Aula';
    case 'exam':
      return 'Avaliação';
    case 'meeting':
      return 'Reunião';
    default:
      return 'Outro';
  }
};
