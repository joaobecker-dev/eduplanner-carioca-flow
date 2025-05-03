
import * as z from "zod";

export const eventCategories = ["class", "exam", "meeting", "other", "deadline"] as const;
export const eventCategoryLabels: Record<string, string> = {
  class: "Aula",
  exam: "Avaliação",
  meeting: "Reunião", 
  other: "Outro",
  deadline: "Prazo"
};

export const eventSourceTypes = ["manual", "assessment", "lesson_plan", "teaching_plan"] as const;

export const eventSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().optional(),
  type: z.enum(eventCategories),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
  allDay: z.boolean().default(false),
  color: z.string().optional(),
  subjectId: z.string().uuid().optional().nullable(),
  sourceType: z.enum(eventSourceTypes).optional().default("manual"),
  sourceId: z.string().uuid().optional().nullable()
});

export type EventFormValues = z.infer<typeof eventSchema>;

export const eventFormDefaults: Partial<EventFormValues> = {
  title: '',
  description: '',
  type: "class",
  startDate: new Date(),
  endDate: new Date(),
  allDay: true,
  color: "#3b82f6", // blue
  sourceType: "manual",
  subjectId: null
};
