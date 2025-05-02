
import { StudentAssessment, ID } from '@/types';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCase, mapToSnakeCase, normalizeToISO } from '@/integrations/supabase/supabaseAdapter';
import { handleError } from './baseService';
import { calendarEventService } from './calendarEventService';

const tableName = "student_assessments";

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

export async function create(studentAssessment: Omit<StudentAssessment, "id">): Promise<StudentAssessment | null> {
  try {
    // Create a properly typed object instead of using mapToSnakeCase
    const assessmentData = {
      student_id: studentAssessment.studentId,
      assessment_id: studentAssessment.assessmentId,
      score: studentAssessment.score,
      feedback: studentAssessment.feedback,
      submitted_date: normalizeToISO(studentAssessment.submittedDate),
      graded_date: normalizeToISO(studentAssessment.gradedDate)
    };

    const { data, error } = await supabase
      .from(tableName)
      .insert(assessmentData)
      .select()
      .single();
    if (error) throw error;

    const created = mapToCamelCase<StudentAssessment>(data);
    // await calendarEventService.syncFromStudentAssessment(created);
    return created;
  } catch (error) {
    handleError(error, 'criar avaliação de aluno');
    return null;
  }
}

export async function update(id: ID, studentAssessment: Partial<StudentAssessment>): Promise<StudentAssessment | null> {
  try {
    // Create a properly typed update object
    const updateData: Record<string, any> = {};
    
    if (studentAssessment.studentId !== undefined) updateData.student_id = studentAssessment.studentId;
    if (studentAssessment.assessmentId !== undefined) updateData.assessment_id = studentAssessment.assessmentId;
    if (studentAssessment.score !== undefined) updateData.score = studentAssessment.score;
    if (studentAssessment.feedback !== undefined) updateData.feedback = studentAssessment.feedback;
    if (studentAssessment.submittedDate !== undefined) updateData.submitted_date = normalizeToISO(studentAssessment.submittedDate);
    if (studentAssessment.gradedDate !== undefined) updateData.graded_date = normalizeToISO(studentAssessment.gradedDate);

    const { data, error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;

    const updated = mapToCamelCase<StudentAssessment>(data);
    // await calendarEventService.syncFromStudentAssessment(updated);
    return updated;
  } catch (error) {
    handleError(error, 'atualizar avaliação de aluno');
    return null;
  }
}

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
