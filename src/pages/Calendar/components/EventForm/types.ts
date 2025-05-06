
import { CalendarEvent } from '@/types';
import { EventFormValues } from '@/schemas/eventSchema';

export interface EventFormProps {
  onSubmit: (values: EventFormValues) => Promise<void>;
  eventToEdit?: CalendarEvent | null;
  isSubmitting?: boolean;
  subjects?: any[];
}
