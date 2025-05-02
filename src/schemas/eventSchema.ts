
import * as z from "zod";

export const eventCategories = ["class", "exam", "meeting", "other"] as const;
export const eventCategoryLabels: Record<string, string> = {
  class: "Aula",
  exam: "Avaliação",
  meeting: "Reunião", 
  other: "Outro"
};

export const eventSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().optional(),
  type: z.enum(eventCategories),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
  allDay: z.boolean().default(false),
  color: z.string().optional(),
  subjectId: z.string().uuid().optional().nullable()
});

export type EventFormValues = z.infer<typeof eventSchema>;

export const eventFormDefaults: Partial<EventFormValues> = {
  type: "class",
  allDay: true,
  color: "#3b82f6" // blue
};
