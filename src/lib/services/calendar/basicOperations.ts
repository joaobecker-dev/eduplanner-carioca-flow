
import { CalendarEvent } from '@/types';
import { EventSourceType } from '@/types/database';
import { CalendarEventDatabaseFields } from './types';
import { handleError } from '../baseService';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCaseEvent } from './utils';

// Export the createCalendarEvent and updateCalendarEvent functions needed by syncOperations.ts
export const createCalendarEvent = async (eventData: CalendarEventDatabaseFields): Promise<CalendarEvent | null> => {
  try {
    // Ensure required fields are present
    if (!eventData.title || !eventData.type || !eventData.start_date) {
      throw new Error("Missing required fields for calendar event");
    }

    // Create a new object with only the fields we want to insert
    // This avoids the deep instantiation issue
    const dataToInsert = {
      title: eventData.title,
      type: eventData.type,
      start_date: eventData.start_date,
      end_date: eventData.end_date,
      description: eventData.description,
      all_day: eventData.all_day,
      subject_id: eventData.subject_id,
      lesson_plan_id: eventData.lesson_plan_id,
      assessment_id: eventData.assessment_id,
      location: eventData.location,
      color: eventData.color,
      source_type: eventData.source_type,
      source_id: eventData.source_id
    };

    const { data, error } = await supabase
      .from('calendar_events')
      .insert(dataToInsert)
      .select()
      .single();

    if (error) throw error;
    return data ? mapToCamelCaseEvent(data) : null;
  } catch (error) {
    handleError(error, 'criar evento do calendário');
    return null;
  }
};

export const updateCalendarEvent = async (id: string, eventData: Partial<CalendarEventDatabaseFields>): Promise<CalendarEvent | null> => {
  try {
    // Manually create the update object instead of using type mappings
    // to avoid deep recursion in type instantiation
    const updateData: Record<string, any> = {};
    
    if (eventData.title !== undefined) updateData.title = eventData.title;
    if (eventData.description !== undefined) updateData.description = eventData.description;
    if (eventData.start_date !== undefined) updateData.start_date = eventData.start_date;
    if (eventData.end_date !== undefined) updateData.end_date = eventData.end_date;
    if (eventData.all_day !== undefined) updateData.all_day = eventData.all_day;
    if (eventData.type !== undefined) updateData.type = eventData.type;
    if (eventData.subject_id !== undefined) updateData.subject_id = eventData.subject_id;
    if (eventData.lesson_plan_id !== undefined) updateData.lesson_plan_id = eventData.lesson_plan_id;
    if (eventData.assessment_id !== undefined) updateData.assessment_id = eventData.assessment_id;
    if (eventData.location !== undefined) updateData.location = eventData.location;
    if (eventData.color !== undefined) updateData.color = eventData.color;
    if (eventData.source_type !== undefined) updateData.source_type = eventData.source_type;
    if (eventData.source_id !== undefined) updateData.source_id = eventData.source_id;

    const { data, error } = await supabase
      .from('calendar_events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data ? mapToCamelCaseEvent(data) : null;
  } catch (error) {
    handleError(error, 'atualizar evento do calendário');
    return null;
  }
};

// Add a deleteBySource function that was missing
export const deleteBySource = async (sourceType: EventSourceType, sourceId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('source_type', sourceType)
      .eq('source_id', sourceId);

    if (error) throw error;
    return true;
  } catch (error) {
    handleError(error, `excluir eventos de origem (${sourceType})`);
    return false;
  }
};
