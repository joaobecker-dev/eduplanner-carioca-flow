
import { TeachingPlan, ID } from '@/types';
import { createService, handleError } from './baseService';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCase, mapToSnakeCase } from '@/integrations/supabase/supabaseAdapter';
import { calendarEventService } from './calendarEventService';

// Custom query functions specific to teaching plans
const teachingPlanSpecificQueries = {
  getByAnnualPlan: async (annualPlanId: ID): Promise<TeachingPlan[]> => {
    try {
      const { data, error } = await supabase
        .from("teaching_plans")
        .select('*')
        .eq('annual_plan_id', annualPlanId);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<TeachingPlan>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar planos de ensino por plano anual');
      return [];
    }
  },
  
  getBySubject: async (subjectId: ID): Promise<TeachingPlan[]> => {
    try {
      const { data, error } = await supabase
        .from("teaching_plans")
        .select('*')
        .eq('subject_id', subjectId);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<TeachingPlan>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar planos de ensino por disciplina');
      return [];
    }
  },
  
  // Override the create method to add calendar event sync
  create: async (teachingPlan: Omit<TeachingPlan, 'id' | 'created_at'>): Promise<TeachingPlan | null> => {
    try {
      const processedData = mapToSnakeCase(teachingPlan);
      
      const { data, error } = await supabase
        .from("teaching_plans")
        .insert(processedData)
        .select()
        .single();
      
      if (error) throw error;
      
      const newTeachingPlan = data ? mapToCamelCase<TeachingPlan>(data) : null;
      
      // Sync with calendar
      if (newTeachingPlan) {
        try {
          await calendarEventService.syncFromTeachingPlan(newTeachingPlan);
        } catch (syncError) {
          console.error('Error syncing to calendar:', syncError);
          // Don't let sync errors prevent teaching plan creation
        }
      }
      
      return newTeachingPlan;
    } catch (error) {
      handleError(error, 'criar plano de ensino');
      return null;
    }
  },
  
  // Override the update method to add calendar event sync
  update: async (id: ID, updates: Partial<TeachingPlan>): Promise<TeachingPlan | null> => {
    try {
      const processedData = mapToSnakeCase(updates);
      
      const { data, error } = await supabase
        .from("teaching_plans")
        .update(processedData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      const updatedTeachingPlan = data ? mapToCamelCase<TeachingPlan>(data) : null;
      
      // Sync with calendar
      if (updatedTeachingPlan) {
        try {
          await calendarEventService.syncFromTeachingPlan(updatedTeachingPlan);
        } catch (syncError) {
          console.error('Error syncing to calendar:', syncError);
          // Don't let sync errors prevent teaching plan update
        }
      }
      
      return updatedTeachingPlan;
    } catch (error) {
      handleError(error, 'atualizar plano de ensino');
      return null;
    }
  }
};

// Combine base service with teaching plan-specific queries
export const teachingPlanService = {
  ...createService<TeachingPlan>("teaching_plans"),
  ...teachingPlanSpecificQueries
};
