import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent, ID } from '@/types';
import { mapToCamelCase } from "@/integrations/supabase/supabaseAdapter";
import { handleError } from "../baseService";

const tableName = 'calendar_events';

/**
 * Create a calendar event
 */
export async function create(event: Omit<CalendarEvent, "id">): Promise<CalendarEvent | null> {
  try {
    // Manually create a properly typed object instead of using mapToSnakeCase
    const eventData = {
      title: event.title,
      description: event.description,
      start_date: event.startDate,
      end_date: event.endDate,
      all_day: event.allDay,
      type: event.type,
      location: event.location,
      color: event.color,
      subject_id: event.subjectId,
      lesson_plan_id: event.lessonPlanId,
      assessment_id: event.assessmentId,
      teaching_plan_id: event.teachingPlanId,
      source_type: event.sourceType,
      source_id: event.sourceId
    };

    const { data, error } = await supabase
      .from(tableName)
      .insert(eventData)
      .select()
      .single();
    
    if (error) throw error;
    return data ? mapToCamelCase<CalendarEvent>(data) : null;
  } catch (error) {
    handleError(error, 'criar evento');
    return null;
  }
}

/**
 * Update a calendar event
 */
export async function update(id: ID, event: Partial<CalendarEvent>): Promise<CalendarEvent | null> {
  try {
    // Create a properly typed update object
    const updateData: Record<string, any> = {};
    
    if (event.title !== undefined) updateData.title = event.title;
    if (event.description !== undefined) updateData.description = event.description;
    if (event.startDate !== undefined) updateData.start_date = event.startDate;
    if (event.endDate !== undefined) updateData.end_date = event.endDate;
    if (event.allDay !== undefined) updateData.all_day = event.allDay;
    if (event.type !== undefined) updateData.type = event.type;
    if (event.location !== undefined) updateData.location = event.location;
    if (event.color !== undefined) updateData.color = event.color;
    if (event.subjectId !== undefined) updateData.subject_id = event.subjectId;
    if (event.lessonPlanId !== undefined) updateData.lesson_plan_id = event.lessonPlanId;
    if (event.assessmentId !== undefined) updateData.assessment_id = event.assessmentId;
    if (event.teachingPlanId !== undefined) updateData.teaching_plan_id = event.teachingPlanId;
    if (event.sourceType !== undefined) updateData.source_type = event.sourceType;
    if (event.sourceId !== undefined) updateData.source_id = event.sourceId;

    const { data, error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data ? mapToCamelCase<CalendarEvent>(data) : null;
  } catch (error) {
    handleError(error, 'atualizar evento');
    return null;
  }
}

/**
 * Delete a calendar event
 */
export async function deleteEvent(id: ID): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    handleError(error, 'excluir evento');
    return false;
  }
}

/**
 * Get all calendar events
 */
export async function getAll(): Promise<CalendarEvent[]> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*');
    
    if (error) throw error;
    return data ? data.map(item => mapToCamelCase<CalendarEvent>(item)) : [];
  } catch (error) {
    handleError(error, 'buscar todos os eventos');
    return [];
  }
}

/**
 * Get a calendar event by id
 */
export async function getById(id: ID): Promise<CalendarEvent | null> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data ? mapToCamelCase<CalendarEvent>(data) : null;
  } catch (error) {
    handleError(error, 'buscar evento por ID');
    return null;
  }
}
