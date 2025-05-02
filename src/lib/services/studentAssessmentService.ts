
import { StudentAssessment, ID } from '@/types';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCase, mapToSnakeCase } from '@/integrations/supabase/supabaseAdapter';
import { handleError } from './baseService';
import { calendarEventService } from './calendarEventService';

const tableName = "student_assessments";

/**
 * Get all student assessments for a specific student
 * @param studentId 
 * @returns Promise<StudentAssessment[]>
 */
export async function getByStudent(studentId: ID): Promise<StudentAssessment[]> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('student_id', studentId);
    
    if (error) throw error;
    return data ? data.map(item => mapToCamelCase<StudentAssessment>(item)) : [];
  } catch (error) {
    handleError(error, 'buscar avaliações por aluno');
    return [];
  }
}

/**
 * Get all student assessments for a specific assessment
 * @param assessmentId 
 * @returns Promise<StudentAssessment[]>
 */
export async function getByAssessment(assessmentId: ID): Promise<StudentAssessment[]> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('assessment_id', assessmentId);
    
    if (error) throw error;
    return data ? data.map(item => mapToCamelCase<StudentAssessment>(item)) : [];
  } catch (error) {
    handleError(error, 'buscar notas de alunos por avaliação');
    return [];
  }
}

/**
 * Get a specific student assessment by id
 * @param id
 * @returns Promise<StudentAssessment | null>
 */
export async function getById(id: ID): Promise<StudentAssessment | null> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data ? mapToCamelCase<StudentAssessment>(data) : null;
  } catch (error) {
    handleError(error, 'buscar nota de aluno por ID');
    return null;
  }
}

/**
 * Create a new student assessment
 * @param studentAssessment 
 * @returns Promise<StudentAssessment | null>
 */
export async function create(studentAssessment: Omit<StudentAssessment, "id">): Promise<StudentAssessment | null> {
  try {
    // Convert form data to database structure with snake_case
    const assessmentData = mapToSnakeCase<any>(studentAssessment);
    
    // Ensure date formats are ISO strings
    if (studentAssessment.submittedDate) {
      if (typeof studentAssessment.submittedDate === 'object' && studentAssessment.submittedDate !== null && 'toISOString' in studentAssessment.submittedDate) {
        assessmentData.submitted_date = studentAssessment.submittedDate.toISOString();
      }
    }
    
    if (studentAssessment.gradedDate) {
      if (typeof studentAssessment.gradedDate === 'object' && studentAssessment.gradedDate !== null && 'toISOString' in studentAssessment.gradedDate) {
        assessmentData.graded_date = studentAssessment.gradedDate.toISOString();
      }
    }
    
    const { data, error } = await supabase
      .from(tableName)
      .insert(assessmentData)
      .select()
      .single();
    
    if (error) throw error;
    
    const createdStudentAssessment = mapToCamelCase<StudentAssessment>(data);
    
    // If calendar sync is needed in the future
    // await calendarEventService.syncFromStudentAssessment(createdStudentAssessment);
    
    return createdStudentAssessment;
  } catch (error) {
    handleError(error, 'criar avaliação de aluno');
    return null;
  }
}

/**
 * Update a student assessment
 * @param id 
 * @param studentAssessment 
 * @returns Promise<StudentAssessment | null>
 */
export async function update(id: ID, studentAssessment: Partial<StudentAssessment>): Promise<StudentAssessment | null> {
  try {
    // Convert form data to database structure with snake_case
    const assessmentData = mapToSnakeCase<any>(studentAssessment);
    
    // Ensure date formats are ISO strings
    if (studentAssessment.submittedDate) {
      if (typeof studentAssessment.submittedDate === 'object' && studentAssessment.submittedDate !== null && 'toISOString' in studentAssessment.submittedDate) {
        assessmentData.submitted_date = studentAssessment.submittedDate.toISOString();
      }
    }
    
    if (studentAssessment.gradedDate) {
      if (typeof studentAssessment.gradedDate === 'object' && studentAssessment.gradedDate !== null && 'toISOString' in studentAssessment.gradedDate) {
        assessmentData.graded_date = studentAssessment.gradedDate.toISOString();
      }
    }
    
    const { data, error } = await supabase
      .from(tableName)
      .update(assessmentData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    const updatedStudentAssessment = mapToCamelCase<StudentAssessment>(data);
    
    // If calendar sync is needed in the future
    // await calendarEventService.syncFromStudentAssessment(updatedStudentAssessment);
    
    return updatedStudentAssessment;
  } catch (error) {
    handleError(error, 'atualizar avaliação de aluno');
    return null;
  }
}

/**
 * Delete a student assessment
 * @param id 
 * @returns Promise<boolean>
 */
export async function deleteStudentAssessment(id: ID): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    handleError(error, 'excluir avaliação de aluno');
    return false;
  }
}

/**
 * Get average score for a specific assessment
 * @param assessmentId 
 * @returns Promise<number>
 */
export async function getAssessmentAverage(assessmentId: ID): Promise<number> {
  try {
    const { data, error } = await supabase
      .from(tableName)
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

export const studentAssessmentService = {
  getByStudent,
  getByAssessment,
  getById,
  create,
  update,
  delete: deleteStudentAssessment,
  getAssessmentAverage
};
