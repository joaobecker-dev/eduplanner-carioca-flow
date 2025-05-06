
import { CalendarEvent, ID } from '@/types';
import { EventSourceType } from '@/types/database';
import { handleError } from '../baseService';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCaseEvent } from './utils';

// Query methods
export const getByDateRange = async (startDate: string, endDate: string): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from("calendar_events")
      .select('*')
      .gte('start_date', startDate)
      .lte('start_date', endDate);

    if (error) throw error;
    return data ? data.map(mapToCamelCaseEvent) : [];
  } catch (error) {
    handleError(error, 'buscar eventos por período');
    return [];
  }
};

export const getBySubject = async (subjectId: ID): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from("calendar_events")
      .select('*')
      .eq('subject_id', subjectId);

    if (error) throw error;
    return data ? data.map(mapToCamelCaseEvent) : [];
  } catch (error) {
    handleError(error, 'buscar eventos por disciplina');
    return [];
  }
};

// Add the missing functions needed by syncOperations.ts
export const getCalendarEventsBySource = async (
  sourceType: EventSourceType,
  sourceId: string
): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from("calendar_events")
      .select('*')
      .eq('source_type', sourceType)
      .eq('source_id', sourceId);

    if (error) throw error;
    return data ? data.map(event => mapToCamelCaseEvent(event)) : [];
  } catch (error) {
    handleError(error, `buscar eventos por fonte (${sourceType})`);
    return [];
  }
};

export const deleteCalendarEventsBySource = async (
  sourceType: EventSourceType,
  sourceId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("calendar_events")
      .delete()
      .eq('source_type', sourceType)
      .eq('source_id', sourceId);

    if (error) throw error;
    return true;
  } catch (error) {
    handleError(error, `excluir eventos por fonte (${sourceType})`);
    return false;
  }
};
