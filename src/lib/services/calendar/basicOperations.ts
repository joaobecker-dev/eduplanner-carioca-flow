
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

    const { data, error } = await supabase
      .from('calendar_events')
      .insert(eventData)
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
    const { data, error } = await supabase
      .from('calendar_events')
      .update(eventData)
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
