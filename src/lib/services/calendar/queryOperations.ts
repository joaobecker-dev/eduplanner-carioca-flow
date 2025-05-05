
import { CalendarEvent, ID } from '@/types';
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
