
import { AnnualPlan, ID } from '@/types';
import { createService, handleError } from './baseService';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCase } from '@/types';

// Annual Plan Service
export const annualPlanService = {
  ...createService<AnnualPlan>("annual_plans"),
  
  // Get all annual plans for a specific subject
  getBySubject: async (subjectId: ID): Promise<AnnualPlan[]> => {
    try {
      const { data, error } = await supabase
        .from("annual_plans")
        .select('*')
        .eq('subject_id', subjectId);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<AnnualPlan>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar planos anuais por disciplina');
      return [];
    }
  }
};
