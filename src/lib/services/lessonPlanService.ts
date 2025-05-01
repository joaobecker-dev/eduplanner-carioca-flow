
import { LessonPlan, ID, CalendarEvent, TeachingPlan } from '@/types';
import { createService, handleError } from './baseService';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCase, mapToSnakeCase } from '@/types';

// Lesson Plan Service
export const lessonPlanService = {
  ...createService<LessonPlan>("lesson_plans"),
  
  // Get all lesson plans for a specific teaching plan
  getByTeachingPlan: async (teachingPlanId: ID): Promise<LessonPlan[]> => {
    try {
      const { data, error } = await supabase
        .from("lesson_plans")
        .select('*')
        .eq('teaching_plan_id', teachingPlanId);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<LessonPlan>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar planos de aula por plano de ensino');
      return [];
    }
  },

  // Create with calendar event
  create: async (lessonPlan: Omit<LessonPlan, 'id'>): Promise<LessonPlan | null> => {
    try {
      // Validate required fields
      if (!lessonPlan.title || !lessonPlan.date || !lessonPlan.duration || !lessonPlan.teachingPlanId) {
        throw new Error('Campos obrigatórios faltando: título, data, duração ou plano de ensino');
      }

      // Convert to snake_case with proper type assertion
      const snakeCaseData = mapToSnakeCase(lessonPlan) as Record<string, any>;
      
      // Create the lesson plan
      const { data, error } = await supabase
        .from("lesson_plans")
        .insert(snakeCaseData)
        .select()
        .single();
      
      if (error) throw error;
      
      // If created successfully and has a date, create the calendar event
      if (data && lessonPlan.date) {
        await syncCalendarEvent(mapToCamelCase<LessonPlan>(data));
      }
      
      return data ? mapToCamelCase<LessonPlan>(data) : null;
    } catch (error) {
      handleError(error, 'criar plano de aula');
      return null;
    }
  },

  // Update with calendar event
  update: async (id: ID, updates: Partial<LessonPlan>): Promise<LessonPlan | null> => {
    try {
      // Convert to snake_case with proper type assertion
      const snakeCaseData = mapToSnakeCase(updates) as Record<string, any>;
      
      // Update the lesson plan
      const { data, error } = await supabase
        .from("lesson_plans")
        .update(snakeCaseData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // If updated successfully, sync the calendar event
      if (data) {
        const lessonPlan = mapToCamelCase<LessonPlan>(data);
        await syncCalendarEvent(lessonPlan);
      }
      
      return data ? mapToCamelCase<LessonPlan>(data) : null;
    } catch (error) {
      handleError(error, 'atualizar plano de aula');
      return null;
    }
  },

  // Delete with calendar event
  delete: async (id: ID): Promise<boolean> => {
    try {
      // Delete associated calendar event first
      await deleteCalendarEvent(id);
      
      // Then delete the lesson plan
      const { error } = await supabase
        .from("lesson_plans")
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error, 'excluir plano de aula');
      return false;
    }
  }
};

// Helper function to get the subject_id from a teaching plan
const getSubjectIdFromTeachingPlan = async (teachingPlanId: ID): Promise<ID | null> => {
  try {
    const { data, error } = await supabase
      .from("teaching_plans")
      .select('subject_id')
      .eq('id', teachingPlanId)
      .maybeSingle();
    
    if (error) throw error;
    return data ? data.subject_id : null;
  } catch (error) {
    console.error('Error fetching subject ID from teaching plan:', error);
    return null;
  }
};

// Helper function to check if a calendar event already exists for a lesson plan
const getCalendarEventByLessonPlanId = async (lessonPlanId: ID): Promise<CalendarEvent | null> => {
  try {
    const { data, error } = await supabase
      .from("calendar_events")
      .select('*')
      .eq('lesson_plan_id', lessonPlanId)
      .maybeSingle();
    
    if (error) throw error;
    return data ? mapToCamelCase<CalendarEvent>(data) : null;
  } catch (error) {
    console.error('Error checking for existing calendar event:', error);
    return null;
  }
};

// Helper function to create or update calendar event for a lesson plan
const syncCalendarEvent = async (lessonPlan: LessonPlan): Promise<void> => {
  try {
    if (!lessonPlan.date) {
      console.log('Skipping calendar sync - no date provided for lesson plan');
      return;
    }
    
    // Get the subject_id from the teaching plan
    const subjectId = await getSubjectIdFromTeachingPlan(lessonPlan.teachingPlanId);
    
    // Check if a calendar event already exists for this lesson plan
    const existingEvent = await getCalendarEventByLessonPlanId(lessonPlan.id);
    
    // Prepare calendar event data
    const eventData = {
      title: lessonPlan.title,
      description: lessonPlan.objectives?.join('\n'),
      start_date: lessonPlan.date,
      end_date: lessonPlan.date,
      all_day: true,
      type: 'class' as const,
      lesson_plan_id: lessonPlan.id,
      subject_id: subjectId,
      color: 'blue'
    };
    
    if (existingEvent) {
      // Update existing event
      await supabase
        .from("calendar_events")
        .update(eventData)
        .eq('id', existingEvent.id);
    } else {
      // Create new event
      await supabase
        .from("calendar_events")
        .insert(eventData);
    }
  } catch (error) {
    console.error('Error syncing calendar event:', error);
  }
};

// Helper function to delete calendar event for a lesson plan
const deleteCalendarEvent = async (lessonPlanId: ID): Promise<void> => {
  try {
    // Delete any calendar events that reference this lesson plan
    await supabase
      .from("calendar_events")
      .delete()
      .eq('lesson_plan_id', lessonPlanId);
  } catch (error) {
    console.error('Error deleting calendar event:', error);
  }
};

export default lessonPlanService;
