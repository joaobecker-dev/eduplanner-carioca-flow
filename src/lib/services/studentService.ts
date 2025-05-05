
import { Student, ID } from '@/types';
import { createService, handleError } from './baseService';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCase } from '@/integrations/supabase/supabaseAdapter';

/**
 * Get students by subject ID
 * @param subjectId 
 * @returns Promise<Student[]>
 */
async function getBySubject(subjectId: ID): Promise<Student[]> {
  try {
    // This query assumes there's a relation between students and subjects
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('subject_id', subjectId);
    
    if (error) throw error;
    
    // Use mapToCamelCase directly without type recursion
    return data ? data.map(item => {
      const student: Student = {
        id: item.id,
        name: item.name,
        registration: item.registration
      };
      return student;
    }) : [];
  } catch (error) {
    handleError(error, 'buscar alunos por disciplina');
    return [];
  }
}

// Student Service
export const studentService = {
  ...createService<Student>("students"),
  getBySubject
};
