
import { CalendarEvent, ID } from '@/types';
import { createService, handleError } from './baseService';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCase, mapToSnakeCase, normalizeToISO } from '@/integrations/supabase/supabaseAdapter';

// Define allowed event types
type EventType = 'class' | 'exam' | 'meeting' | 'deadline' | 'other';

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
  },
  
  // Sync functions for various entities
  syncFromLessonPlan: async (lessonPlan: any): Promise<void> => {
    try {
      // First, check if an event for this lesson plan already exists
      const { data: existingEvents } = await supabase
        .from("calendar_events")
        .select('*')
        .eq('lesson_plan_id', lessonPlan.id);
        
      const eventData = {
        title: `Aula: ${lessonPlan.title}`,
        description: `Plano de aula: ${lessonPlan.title}`,
        start_date: normalizeToISO(lessonPlan.date),
        end_date: normalizeToISO(lessonPlan.date), // Same day event
        all_day: true,
        type: 'class' as EventType,
        lesson_plan_id: lessonPlan.id,
        subject_id: lessonPlan.subject_id || null
      };
      
      if (existingEvents && existingEvents.length > 0) {
        // Update existing event
        await supabase
          .from("calendar_events")
          .update(eventData)
          .eq('lesson_plan_id', lessonPlan.id);
      } else {
        // Create new event
        await supabase
          .from("calendar_events")
          .insert(eventData);
      }
    } catch (error) {
      console.error('Error syncing lesson plan to calendar:', error);
    }
  },
  
  syncFromTeachingPlan: async (teachingPlan: any): Promise<void> => {
    try {
      // First, check if an event for this teaching plan already exists
      const { data: existingEvents } = await supabase
        .from("calendar_events")
        .select('*')
        .eq('teaching_plan_id', teachingPlan.id);
        
      const eventData = {
        title: `Plano: ${teachingPlan.title}`,
        description: `Plano de ensino: ${teachingPlan.title}`,
        start_date: normalizeToISO(teachingPlan.startDate || teachingPlan.start_date),
        end_date: normalizeToISO(teachingPlan.endDate || teachingPlan.end_date),
        all_day: true,
        type: 'class' as EventType,
        teaching_plan_id: teachingPlan.id,
        subject_id: teachingPlan.subject_id || teachingPlan.subjectId || null
      };
      
      if (existingEvents && existingEvents.length > 0) {
        // Update existing event
        await supabase
          .from("calendar_events")
          .update(eventData)
          .eq('teaching_plan_id', teachingPlan.id);
      } else {
        // Create new event
        await supabase
          .from("calendar_events")
          .insert(eventData);
      }
    } catch (error) {
      console.error('Error syncing teaching plan to calendar:', error);
    }
  },
  
  syncFromAssessment: async (assessment: any): Promise<void> => {
    try {
      // First, check if an event for this assessment already exists
      const { data: existingEvents } = await supabase
        .from("calendar_events")
        .select('*')
        .eq('assessment_id', assessment.id);
        
      const eventData = {
        title: `Avaliação: ${assessment.title}`,
        description: assessment.description || `Avaliação: ${assessment.title}`,
        start_date: normalizeToISO(assessment.date),
        end_date: assessment.dueDate ? normalizeToISO(assessment.dueDate) : normalizeToISO(assessment.date),
        all_day: true,
        type: 'exam' as EventType,
        assessment_id: assessment.id,
        subject_id: assessment.subject_id || assessment.subjectId || null
      };
      
      if (existingEvents && existingEvents.length > 0) {
        // Update existing event
        await supabase
          .from("calendar_events")
          .update(eventData)
          .eq('assessment_id', assessment.id);
      } else {
        // Create new event
        await supabase
          .from("calendar_events")
          .insert(eventData);
      }
    } catch (error) {
      console.error('Error syncing assessment to calendar:', error);
    }
  }
};
