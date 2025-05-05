
import { Student, ID } from '@/types';
import { createService, handleError } from './baseService';
import { supabase } from "@/integrations/supabase/client";

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
    
    // Use direct object construction to avoid type recursion
    return data ? data.map(item => ({
      id: item.id,
      name: item.name,
      registration: item.registration
    })) : [];
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
