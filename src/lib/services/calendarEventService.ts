import { CalendarEvent, ID } from '@/types';
import { createService, handleError } from './baseService';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCase, mapToSnakeCase, normalizeToISO } from '@/integrations/supabase/supabaseAdapter';

// Calendar Event Service
export const calendarEventService = {
  ...createService<CalendarEvent>("calendar_events"),

  getByDateRange: async (startDate: string, endDate: string): Promise<CalendarEvent[]> => {
    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .select('*')
        .gte('start_date', startDate)
        .lte('start_date', endDate);

      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<CalendarEvent>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar eventos por período');
      return [];
    }
  },

  getByMonth: async (year: number, month: number): Promise<CalendarEvent[]> => {
    try {
      // Create date range for the entire month
      const startDate = new Date(year, month - 1, 1).toISOString();
      const endDate = new Date(year, month, 0).toISOString(); // Last day of month

      const { data, error } = await supabase
        .from("calendar_events")
        .select('*')
        .or(`start_date.gte.${startDate},end_date.gte.${startDate}`)
        .or(`start_date.lte.${endDate},end_date.lte.${endDate}`);

      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<CalendarEvent>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar eventos por mês');
      return [];
    }
  },

  createEvent: async (eventData: Omit<CalendarEvent, 'id' | 'created_at'>): Promise<CalendarEvent | null> => {
    try {
      // Convert date objects to ISO strings if needed
      const processedData = mapToSnakeCase({
        ...eventData,
        start_date: normalizeToISO(eventData.startDate || eventData.start_date),
        end_date: normalizeToISO(eventData.endDate || eventData.end_date),
      });

      const { data, error } = await supabase
        .from("calendar_events")
        .insert(processedData)
        .select()
        .single();
      
      if (error) throw error;
      return data ? mapToCamelCase<CalendarEvent>(data) : null;
    } catch (error) {
      handleError(error, 'criar evento no calendário');
      return null;
    }
  },

  updateEvent: async (id: ID, eventData: Partial<CalendarEvent>): Promise<CalendarEvent | null> => {
    try {
      // Convert date objects to ISO strings if needed
      const processedData = mapToSnakeCase({
        ...eventData,
        start_date: eventData.startDate ? normalizeToISO(eventData.startDate) : 
                   (eventData.start_date ? normalizeToISO(eventData.start_date) : undefined),
        end_date: eventData.endDate ? normalizeToISO(eventData.endDate) : 
                  (eventData.end_date ? normalizeToISO(eventData.end_date) : undefined),
      });

      const { data, error } = await supabase
        .from("calendar_events")
        .update(processedData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data ? mapToCamelCase<CalendarEvent>(data) : null;
    } catch (error) {
      handleError(error, 'atualizar evento no calendário');
      return null;
    }
  }
};
