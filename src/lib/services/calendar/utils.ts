
import { CalendarEvent } from '@/types';
import { CalendarEventDatabaseFields } from './types';
import { normalizeToISO } from '@/integrations/supabase/supabaseAdapter';

// Data mapping helper for converting DB rows to CalendarEvent objects
export const mapToCamelCaseEvent = (data: any): CalendarEvent => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    startDate: data.start_date,
    endDate: data.end_date,
    allDay: data.all_day,
    type: data.type,
    subjectId: data.subject_id,
    lessonPlanId: data.lesson_plan_id,
    assessmentId: data.assessment_id,
    teachingPlanId: data.teaching_plan_id,
    location: data.location,
    color: data.color,
    sourceType: data.source_type,
    sourceId: data.source_id,
    created_at: data.created_at
  };
};

// Prepare data for database operations with explicit typing
export const prepareEventData = (eventData: Partial<CalendarEvent>): CalendarEventDatabaseFields => {
  // Create a base object with required fields
  const updateData: Partial<CalendarEventDatabaseFields> = {};
  
  // Add required fields
  if (eventData.title !== undefined) updateData.title = eventData.title;
  if (eventData.type !== undefined) updateData.type = eventData.type;
  if (eventData.startDate !== undefined) updateData.start_date = normalizeToISO(eventData.startDate);
  
  // Add optional fields only if they exist
  if (eventData.description !== undefined) updateData.description = eventData.description;
  if (eventData.endDate !== undefined) updateData.end_date = normalizeToISO(eventData.endDate);
  if (eventData.allDay !== undefined) updateData.all_day = eventData.allDay;
  if (eventData.subjectId !== undefined) updateData.subject_id = eventData.subjectId;
  if (eventData.lessonPlanId !== undefined) updateData.lesson_plan_id = eventData.lessonPlanId;
  if (eventData.assessmentId !== undefined) updateData.assessment_id = eventData.assessmentId;
  if (eventData.teachingPlanId !== undefined) updateData.teaching_plan_id = eventData.teachingPlanId;
  if (eventData.location !== undefined) updateData.location = eventData.location;
  if (eventData.color !== undefined) updateData.color = eventData.color;
  if (eventData.sourceType !== undefined) updateData.source_type = eventData.sourceType;
  if (eventData.sourceId !== undefined) updateData.source_id = eventData.sourceId;

  // Cast to complete type to ensure we have required fields
  return updateData as CalendarEventDatabaseFields;
};
