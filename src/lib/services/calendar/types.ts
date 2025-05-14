
import { ID, EventType } from '@/types';
import { EventSourceType } from '@/types/database';

// Database field mapping for calendar events
export interface CalendarEventDatabaseFields {
  title: string;
  description?: string;
  type: EventType;
  start_date: string;
  end_date?: string;
  all_day?: boolean; // Changed to match the database field name
  subject_id?: string;
  lesson_plan_id?: string;
  assessment_id?: string;
  teaching_plan_id?: string;
  location?: string;
  color?: string;
  source_type?: EventSourceType;
  source_id?: string;
  created_at?: string; // Added this to match CalendarEvent
}

// Add a conversion function for types
export function convertToCalendarEvent(fields: CalendarEventDatabaseFields) {
  return {
    title: fields.title,
    description: fields.description,
    type: fields.type,
    startDate: fields.start_date,
    endDate: fields.end_date,
    allDay: fields.all_day || false,
    subjectId: fields.subject_id,
    lessonPlanId: fields.lesson_plan_id,
    assessmentId: fields.assessment_id,
    teachingPlanId: fields.teaching_plan_id,
    location: fields.location,
    color: fields.color,
    sourceType: fields.source_type,
    sourceId: fields.source_id,
    created_at: fields.created_at || new Date().toISOString()
  };
}
