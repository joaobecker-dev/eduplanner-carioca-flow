
import { LessonPlan, ID } from '@/types';
import { createService, handleError } from './baseService';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCase, mapToSnakeCase } from '@/integrations/supabase/supabaseAdapter';
import { calendarEventService } from './calendarEventService';

// Custom query functions specific to lesson plans
const lessonPlanSpecificQueries = {
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
  
  // Override the create method to add calendar event sync
  create: async (lessonPlan: Omit<LessonPlan, 'id' | 'created_at'>): Promise<LessonPlan | null> => {
    try {
      // Handle arrays in lesson plan
      const processedLessonPlan = {
        ...lessonPlan,
        objectives: Array.isArray(lessonPlan.objectives) ? lessonPlan.objectives : 
                   (typeof lessonPlan.objectives === 'string' ? [lessonPlan.objectives] : []),
        contents: Array.isArray(lessonPlan.contents) ? lessonPlan.contents : 
                 (typeof lessonPlan.contents === 'string' ? [lessonPlan.contents] : []),
        activities: Array.isArray(lessonPlan.activities) ? lessonPlan.activities : 
                   (typeof lessonPlan.activities === 'string' ? [lessonPlan.activities] : []),
        resources: Array.isArray(lessonPlan.resources) ? lessonPlan.resources : 
                  (typeof lessonPlan.resources === 'string' ? [lessonPlan.resources] : []),
      };
      
      const processedData = mapToSnakeCase(processedLessonPlan);
      
      const { data, error } = await supabase
        .from("lesson_plans")
        .insert(processedData)
        .select()
        .single();
      
      if (error) throw error;
      
      const newLessonPlan = data ? mapToCamelCase<LessonPlan>(data) : null;
      
      // Sync with calendar
      if (newLessonPlan) {
        try {
          await calendarEventService.syncFromLessonPlan(newLessonPlan);
        } catch (syncError) {
          console.error('Error syncing to calendar:', syncError);
          // Don't let sync errors prevent lesson plan creation
        }
      }
      
      return newLessonPlan;
    } catch (error) {
      handleError(error, 'criar plano de aula');
      return null;
    }
  },
  
  // Override the update method to add calendar event sync
  update: async (id: ID, updates: Partial<LessonPlan>): Promise<LessonPlan | null> => {
    try {
      // Handle arrays in lesson plan updates
      const processedUpdates = { ...updates };
      
      if (updates.objectives) {
        processedUpdates.objectives = Array.isArray(updates.objectives) ? updates.objectives : 
                                      (typeof updates.objectives === 'string' ? [updates.objectives] : []);
      }
      
      if (updates.contents) {
        processedUpdates.contents = Array.isArray(updates.contents) ? updates.contents : 
                                    (typeof updates.contents === 'string' ? [updates.contents] : []);
      }
      
      if (updates.activities) {
        processedUpdates.activities = Array.isArray(updates.activities) ? updates.activities : 
                                      (typeof updates.activities === 'string' ? [updates.activities] : []);
      }
      
      if (updates.resources) {
        processedUpdates.resources = Array.isArray(updates.resources) ? updates.resources : 
                                     (typeof updates.resources === 'string' ? [updates.resources] : []);
      }
      
      const processedData = mapToSnakeCase(processedUpdates);
      
      const { data, error } = await supabase
        .from("lesson_plans")
        .update(processedData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      const updatedLessonPlan = data ? mapToCamelCase<LessonPlan>(data) : null;
      
      // Sync with calendar
      if (updatedLessonPlan) {
        try {
          await calendarEventService.syncFromLessonPlan(updatedLessonPlan);
        } catch (syncError) {
          console.error('Error syncing to calendar:', syncError);
          // Don't let sync errors prevent lesson plan update
        }
      }
      
      return updatedLessonPlan;
    } catch (error) {
      handleError(error, 'atualizar plano de aula');
      return null;
    }
  }
};

// Combine base service with lesson plan-specific queries
export const lessonPlanService = {
  ...createService<LessonPlan>("lesson_plans"),
  ...lessonPlanSpecificQueries
};
