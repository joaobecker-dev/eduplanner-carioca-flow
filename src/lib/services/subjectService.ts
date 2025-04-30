
import { Subject, ID } from '@/types';
import { createService, handleError } from './baseService';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCase } from '@/types';

// Subject Service
export const subjectService = {
  ...createService<Subject>("subjects"),
  
  // Get all subjects for a specific academic period
  getByAcademicPeriod: async (academicPeriodId: ID): Promise<Subject[]> => {
    try {
      const { data, error } = await supabase
        .from("subjects")
        .select('*')
        .eq('academic_period_id', academicPeriodId);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<Subject>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar disciplinas por período acadêmico');
      return [];
    }
  }
};
