
import { StudentAssessment, ID } from '@/types';
import { createService, handleError } from './baseService';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCase } from '@/types';

// Student Assessment Service
export const studentAssessmentService = {
  ...createService<StudentAssessment>("student_assessments"),
  
  // Get all assessments for a specific student
  getByStudent: async (studentId: ID): Promise<StudentAssessment[]> => {
    try {
      const { data, error } = await supabase
        .from("student_assessments")
        .select('*')
        .eq('student_id', studentId);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<StudentAssessment>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar avaliações por aluno');
      return [];
    }
  },
  
  // Get all student assessments for a specific assessment
  getByAssessment: async (assessmentId: ID): Promise<StudentAssessment[]> => {
    try {
      const { data, error } = await supabase
        .from("student_assessments")
        .select('*')
        .eq('assessment_id', assessmentId);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<StudentAssessment>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar notas de alunos por avaliação');
      return [];
    }
  },
  
  // Get average score for a specific assessment
  getAssessmentAverage: async (assessmentId: ID): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from("student_assessments")
        .select('score')
        .eq('assessment_id', assessmentId);
      
      if (error) throw error;
      
      if (!data || data.length === 0) return 0;
      
      const sum = data.reduce((acc, curr) => acc + Number(curr.score), 0);
      return sum / data.length;
    } catch (error) {
      handleError(error, 'calcular média da avaliação');
      return 0;
    }
  }
};
