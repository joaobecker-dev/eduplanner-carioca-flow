
import { CalendarEvent } from '@/types';
import { CalendarEventRow } from '@/types/database';

// Helper to map database rows to frontend models
export const mapToCamelCaseEvent = (row: CalendarEventRow): CalendarEvent => {
  return {
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    startDate: row.start_date,
    endDate: row.end_date || undefined,
    allDay: row.all_day || false,
    type: row.type,
    subjectId: row.subject_id || undefined,
    lessonPlanId: row.lesson_plan_id || undefined,
    assessmentId: row.assessment_id || undefined,
    // teachingPlanId field removed as it doesn't exist in the database schema
    location: row.location || undefined,
    color: row.color || undefined,
    sourceType: (row as any).source_type,
    sourceId: (row as any).source_id,
    created_at: row.created_at
  };
};
