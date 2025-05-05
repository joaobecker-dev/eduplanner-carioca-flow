import { CalendarEvent } from '@/types';
import { createService, handleError } from '../baseService';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCase, normalizeToISO } from '@/integrations/supabase/supabaseAdapter';
import { deleteBySourceEvent } from './wrapperOperations';
import { syncFromAssessment, syncFromLessonPlan, syncFromTeachingPlan, syncFromStudentAssessment } from './syncOperations';

const tableName = "calendar_events";

// Basic operations (CRUD)
const basicOperations = {
  getAll: async (): Promise<CalendarEvent[]> => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*');
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<CalendarEvent>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar todos os eventos da agenda');
      return [];
    }
  },

  getById: async (id: string): Promise<CalendarEvent | null> => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data ? mapToCamelCase<CalendarEvent>(data) : null;
    } catch (error) {
      handleError(error, 'buscar evento da agenda por ID');
      return null;
    }
  },

  create: async (calendarEvent: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent | null> => {
    try {
      const eventData = {
        title: calendarEvent.title,
        description: calendarEvent.description,
        start_date: normalizeToISO(calendarEvent.startDate),
        end_date: normalizeToISO(calendarEvent.endDate),
        all_day: calendarEvent.allDay,
        type: calendarEvent.type,
        subject_id: calendarEvent.subjectId,
        lesson_plan_id: calendarEvent.lessonPlanId,
        assessment_id: calendarEvent.assessmentId,
        teaching_plan_id: calendarEvent.teachingPlanId,
        location: calendarEvent.location,
        color: calendarEvent.color,
        source_type: calendarEvent.sourceType,
        source_id: calendarEvent.sourceId
      };

      const { data, error } = await supabase
        .from(tableName)
        .insert([eventData])
        .select()
        .single();
      if (error) throw error;
      return data ? mapToCamelCase<CalendarEvent>(data) : null;
    } catch (error) {
      handleError(error, 'criar evento da agenda');
      return null;
    }
  },

  update: async (id: string, calendarEvent: Partial<CalendarEvent>): Promise<CalendarEvent | null> => {
    try {
      const updateData: Record<string, any> = {};
      if (calendarEvent.title !== undefined) updateData.title = calendarEvent.title;
      if (calendarEvent.description !== undefined) updateData.description = calendarEvent.description;
      if (calendarEvent.startDate !== undefined) updateData.start_date = normalizeToISO(calendarEvent.startDate);
      if (calendarEvent.endDate !== undefined) updateData.end_date = normalizeToISO(calendarEvent.endDate);
      if (calendarEvent.allDay !== undefined) updateData.all_day = calendarEvent.allDay;
      if (calendarEvent.type !== undefined) updateData.type = calendarEvent.type;
      if (calendarEvent.subjectId !== undefined) updateData.subject_id = calendarEvent.subjectId;
      if (calendarEvent.lessonPlanId !== undefined) updateData.lesson_plan_id = calendarEvent.lessonPlanId;
      if (calendarEvent.assessmentId !== undefined) updateData.assessment_id = calendarEvent.assessmentId;
      if (calendarEvent.teachingPlanId !== undefined) updateData.teaching_plan_id = calendarEvent.teachingPlanId;
      if (calendarEvent.location !== undefined) updateData.location = calendarEvent.location;
       if (calendarEvent.color !== undefined) updateData.color = calendarEvent.color;
      if (calendarEvent.sourceType !== undefined) updateData.source_type = calendarEvent.sourceType;
      if (calendarEvent.sourceId !== undefined) updateData.source_id = calendarEvent.sourceId;

      const { data, error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data ? mapToCamelCase<CalendarEvent>(data) : null;
    } catch (error) {
      handleError(error, 'atualizar evento da agenda');
      return null;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error, 'excluir evento da agenda');
      return false;
    }
  }
};

// Query operations
const queryOperations = {
  getByDateRange: async (startDate: string, endDate: string): Promise<CalendarEvent[]> => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .gte('start_date', startDate)
        .lte('start_date', endDate);
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<CalendarEvent>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar eventos da agenda por período');
      return [];
    }
  },

  getBySubject: async (subjectId: string): Promise<CalendarEvent[]> => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('subject_id', subjectId);
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<CalendarEvent>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar eventos da agenda por disciplina');
      return [];
    }
  }
};

// Export the calendar event service
export const calendarEventService = {
  // Regular CRUD operations
  ...basicOperations,
  
  // Query operations
  ...queryOperations,
  
  // Synchronization operations
  syncFromAssessment,
  syncFromLessonPlan,
  syncFromTeachingPlan,
  syncFromStudentAssessment,
  deleteBySource: deleteBySourceEvent,
  
  // Add proper delete event function that was expected by other components
  deleteEvent: async (id: string) => {
    return await basicOperations.delete(id);
  }
};
