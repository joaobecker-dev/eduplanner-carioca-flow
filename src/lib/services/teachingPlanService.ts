
import { TeachingPlan, ID } from '@/types';
import { createService, handleError } from './baseService';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCase } from '@/types';

// Teaching Plan Service
export const teachingPlanService = {
  ...createService<TeachingPlan>("teaching_plans"),
  
  // Get all teaching plans for a specific annual plan
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
  
  // Get all teaching plans for a specific subject
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
  }
};
