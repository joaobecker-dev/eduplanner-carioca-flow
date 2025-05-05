
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent, ID } from '@/types';
import { mapToCamelCase, normalizeToISO, mapToSnakeCase } from "@/integrations/supabase/supabaseAdapter";
import { handleError } from "../baseService";

// Set the table name for calendar events
const tableName = "calendar_events";

export async function getAll(): Promise<CalendarEvent[]> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*');
    
    if (error) throw error;
    
    return data ? data.map(item => mapToCamelCase<CalendarEvent>(item)) : [];
  } catch (error) {
    handleError(error, 'buscar todos os eventos do calendário');
    return [];
  }
}

export async function getById(id: ID): Promise<CalendarEvent | null> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    
    return data ? mapToCamelCase<CalendarEvent>(data) : null;
  } catch (error) {
    handleError(error, 'buscar evento do calendário por ID');
    return null;
  }
}

export async function create(event: Omit<CalendarEvent, "id">): Promise<CalendarEvent | null> {
  try {
    // Convert to snake_case format
    const eventData = {
      title: event.title,
      description: event.description,
      start_date: normalizeToISO(event.startDate),
      end_date: event.endDate ? normalizeToISO(event.endDate) : null,
      all_day: event.allDay,
      type: event.type,
      subject_id: event.subjectId,
      lesson_plan_id: event.lessonPlanId,
      assessment_id: event.assessmentId,
      teaching_plan_id: event.teachingPlanId,
      location: event.location,
      color: event.color,
      source_type: event.sourceType,
      source_id: event.sourceId
    };
    
    const { data, error } = await supabase
      .from(tableName)
      .insert(eventData)
      .select()
      .single();
    
    if (error) throw error;
    
    return mapToCamelCase<CalendarEvent>(data);
  } catch (error) {
    handleError(error, 'criar evento do calendário');
    return null;
  }
}

export async function update(id: ID, event: Partial<CalendarEvent>): Promise<CalendarEvent | null> {
  try {
    // Create a properly typed update object
    const updateData: Record<string, any> = {};
    
    if (event.title !== undefined) updateData.title = event.title;
    if (event.description !== undefined) updateData.description = event.description;
    if (event.startDate !== undefined) updateData.start_date = normalizeToISO(event.startDate);
    if (event.endDate !== undefined) updateData.end_date = normalizeToISO(event.endDate);
    if (event.allDay !== undefined) updateData.all_day = event.allDay;
    if (event.type !== undefined) updateData.type = event.type;
    if (event.subjectId !== undefined) updateData.subject_id = event.subjectId;
    if (event.lessonPlanId !== undefined) updateData.lesson_plan_id = event.lessonPlanId;
    if (event.assessmentId !== undefined) updateData.assessment_id = event.assessmentId;
    if (event.teachingPlanId !== undefined) updateData.teaching_plan_id = event.teachingPlanId;
    if (event.location !== undefined) updateData.location = event.location;
    if (event.color !== undefined) updateData.color = event.color;
    
    const { data, error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return mapToCamelCase<CalendarEvent>(data);
  } catch (error) {
    handleError(error, 'atualizar evento do calendário');
    return null;
  }
}

export async function deleteEvent(id: ID): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    handleError(error, 'excluir evento do calendário');
    return false;
  }
}
