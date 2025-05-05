
import { ID, EventType, EventSourceType } from '@/types';

// Database field mapping for calendar events
export interface CalendarEventDatabaseFields {
  title: string;
  description?: string;
  type: EventType;
  start_date: string;
  end_date?: string;
  all_day?: boolean;
  subject_id?: string;
  lesson_plan_id?: string;
  assessment_id?: string;
  teaching_plan_id?: string;
  location?: string;
  color?: string;
  source_type?: EventSourceType;
  source_id?: string;
}
