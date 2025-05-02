
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
  create: async (lessonPlanData: Omit<LessonPlan, 'id' | 'created_at'>): Promise<LessonPlan | null> => {
    try {
      // Ensure arrays for array fields
      const objectives = Array.isArray(lessonPlanData.objectives) ? lessonPlanData.objectives : 
                        (typeof lessonPlanData.objectives === 'string' ? [lessonPlanData.objectives] : []);
      const contents = Array.isArray(lessonPlanData.contents) ? lessonPlanData.contents : 
                      (typeof lessonPlanData.contents === 'string' ? [lessonPlanData.contents] : []);
      const activities = Array.isArray(lessonPlanData.activities) ? lessonPlanData.activities : 
                        (typeof lessonPlanData.activities === 'string' ? [lessonPlanData.activities] : []);
      const resources = Array.isArray(lessonPlanData.resources) ? lessonPlanData.resources : 
                       (typeof lessonPlanData.resources === 'string' ? [lessonPlanData.resources] : []);
      
      // Convert date if necessary
      const date = typeof lessonPlanData.date === 'object' && lessonPlanData.date instanceof Date
                   ? lessonPlanData.date.toISOString() : lessonPlanData.date;
      
      // Prepare structured data
      const processedData = mapToSnakeCase({
        title: lessonPlanData.title,
        teaching_plan_id: lessonPlanData.teachingPlanId || lessonPlanData.teaching_plan_id,
        date,
        duration: lessonPlanData.duration,
        objectives,
        contents,
        activities,
        resources,
        homework: lessonPlanData.homework || null,
        evaluation: lessonPlanData.evaluation || null,
        notes: lessonPlanData.notes || null,
        material_ids: lessonPlanData.materialIds || lessonPlanData.material_ids || null,
      });
      
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
      const updateData: Record<string, any> = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.teachingPlanId !== undefined || updates.teaching_plan_id !== undefined) 
        updateData.teaching_plan_id = updates.teachingPlanId || updates.teaching_plan_id;
      
      // Convert date if it's a Date object
      if (updates.date !== undefined) {
        updateData.date = updates.date instanceof Date ? updates.date.toISOString() : updates.date;
      }
      
      if (updates.duration !== undefined) updateData.duration = updates.duration;
      
      // Handle arrays properly
      if (updates.objectives !== undefined) {
        updateData.objectives = Array.isArray(updates.objectives) ? updates.objectives : 
                              (typeof updates.objectives === 'string' ? [updates.objectives] : []);
      }
      
      if (updates.contents !== undefined) {
        updateData.contents = Array.isArray(updates.contents) ? updates.contents : 
                            (typeof updates.contents === 'string' ? [updates.contents] : []);
      }
      
      if (updates.activities !== undefined) {
        updateData.activities = Array.isArray(updates.activities) ? updates.activities : 
                              (typeof updates.activities === 'string' ? [updates.activities] : []);
      }
      
      if (updates.resources !== undefined) {
        updateData.resources = Array.isArray(updates.resources) ? updates.resources : 
                             (typeof updates.resources === 'string' ? [updates.resources] : []);
      }
      
      if (updates.homework !== undefined) updateData.homework = updates.homework;
      if (updates.evaluation !== undefined) updateData.evaluation = updates.evaluation;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      if (updates.materialIds !== undefined || updates.material_ids !== undefined)
        updateData.material_ids = updates.materialIds || updates.material_ids;
      
      const processedData = mapToSnakeCase(updateData);
      
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
