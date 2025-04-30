
import { Assessment, ID } from '@/types';
import { createService, handleError } from './baseService';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCase } from '@/types';

// Assessment Service
export const assessmentService = {
  ...createService<Assessment>("assessments"),
  
  // Get all assessments for a specific subject
  getBySubject: async (subjectId: ID): Promise<Assessment[]> => {
    try {
      const { data, error } = await supabase
        .from("assessments")
        .select('*')
        .eq('subject_id', subjectId);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<Assessment>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar avaliações por disciplina');
      return [];
    }
  },
  
  // Get all assessments for a specific teaching plan
  getByTeachingPlan: async (teachingPlanId: ID): Promise<Assessment[]> => {
    try {
      const { data, error } = await supabase
        .from("assessments")
        .select('*')
        .eq('teaching_plan_id', teachingPlanId);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<Assessment>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar avaliações por plano de ensino');
      return [];
    }
  }
};
