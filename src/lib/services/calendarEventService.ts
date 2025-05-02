
import { CalendarEvent, ID } from '@/types';
import { createService, handleError } from './baseService';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCase, mapToSnakeCase } from '@/integrations/supabase/supabaseAdapter';

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
      // Convert date objects to ISO strings if needed and enforce required fields
      const processedData = mapToSnakeCase({
        title: eventData.title,
        start_date: eventData.start_date || eventData.startDate,
        type: eventData.type,
        description: eventData.description || null,
        end_date: eventData.end_date || eventData.endDate || eventData.start_date || eventData.startDate,
        all_day: eventData.all_day || eventData.allDay || false,
        color: eventData.color || null,
        subject_id: eventData.subject_id || eventData.subjectId || null,
        assessment_id: eventData.assessment_id || eventData.assessmentId || null,
        lesson_plan_id: eventData.lesson_plan_id || eventData.lessonPlanId || null,
        location: eventData.location || null
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
      // Prepare update data with explicit type checking
      const updateData: Record<string, any> = {};
      
      if (eventData.title !== undefined) updateData.title = eventData.title;
      if (eventData.description !== undefined) updateData.description = eventData.description;
      if (eventData.startDate || eventData.start_date) updateData.start_date = eventData.startDate || eventData.start_date;
      if (eventData.endDate || eventData.end_date) updateData.end_date = eventData.endDate || eventData.end_date;
      if (eventData.allDay !== undefined || eventData.all_day !== undefined) 
        updateData.all_day = eventData.allDay !== undefined ? eventData.allDay : eventData.all_day;
      if (eventData.type !== undefined) updateData.type = eventData.type;
      if (eventData.color !== undefined) updateData.color = eventData.color;
      if (eventData.subjectId || eventData.subject_id) updateData.subject_id = eventData.subjectId || eventData.subject_id;
      if (eventData.assessmentId || eventData.assessment_id) updateData.assessment_id = eventData.assessmentId || eventData.assessment_id;
      if (eventData.lessonPlanId || eventData.lesson_plan_id) updateData.lesson_plan_id = eventData.lessonPlanId || eventData.lesson_plan_id;
      if (eventData.location !== undefined) updateData.location = eventData.location;
      
      // Convert to snake_case
      const processedData = mapToSnakeCase(updateData);
      
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
        
      const eventData: Record<string, any> = {
        title: `Aula: ${lessonPlan.title}`,
        description: `Plano de aula: ${lessonPlan.title}`,
        start_date: typeof lessonPlan.date === 'string' ? lessonPlan.date : new Date(lessonPlan.date).toISOString(),
        end_date: typeof lessonPlan.date === 'string' ? lessonPlan.date : new Date(lessonPlan.date).toISOString(),
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
        
      const eventData: Record<string, any> = {
        title: `Plano: ${teachingPlan.title}`,
        description: `Plano de ensino: ${teachingPlan.title}`,
        start_date: typeof teachingPlan.startDate === 'string' ? teachingPlan.startDate :
                   typeof teachingPlan.start_date === 'string' ? teachingPlan.start_date :
                   new Date(teachingPlan.startDate || teachingPlan.start_date).toISOString(),
        end_date: typeof teachingPlan.endDate === 'string' ? teachingPlan.endDate :
                 typeof teachingPlan.end_date === 'string' ? teachingPlan.end_date :
                 new Date(teachingPlan.endDate || teachingPlan.end_date).toISOString(),
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
        
      const eventData: Record<string, any> = {
        title: `Avaliação: ${assessment.title}`,
        description: assessment.description || `Avaliação: ${assessment.title}`,
        start_date: typeof assessment.date === 'string' ? assessment.date : new Date(assessment.date).toISOString(),
        end_date: assessment.dueDate ? 
                 (typeof assessment.dueDate === 'string' ? assessment.dueDate : new Date(assessment.dueDate).toISOString()) :
                 (typeof assessment.date === 'string' ? assessment.date : new Date(assessment.date).toISOString()),
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
