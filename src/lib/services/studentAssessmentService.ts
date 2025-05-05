
import { StudentAssessment, ID } from '@/types';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCase, normalizeToISO } from '@/integrations/supabase/supabaseAdapter';
import { handleError } from './baseService';
import { calendarEventService } from './calendar';

const tableName = "student_assessments";

export async function getAll(): Promise<StudentAssessment[]> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*');
    if (error) throw error;
    return data ? data.map(item => mapToCamelCase<StudentAssessment>(item)) : [];
  } catch (error) {
    handleError(error, 'buscar todas as avaliações de alunos');
    return [];
  }
}

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
    await calendarEventService.syncFromStudentAssessment(created);
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
    await calendarEventService.syncFromStudentAssessment(updated);
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

// New method to get performance summary by students
export async function getSummaryByStudent(subjectId?: ID): Promise<StudentPerformanceSummary[]> {
  try {
    // Join student_assessments with students
    let query = supabase
      .from('student_assessments')
      .select(`
        id,
        score,
        graded_date,
        student_id,
        assessment_id,
        assessments(subject_id),
        students(id, name, registration)
      `);
    
    // Apply subject filter if provided
    if (subjectId) {
      query = query.eq('assessments.subject_id', subjectId);
    }

    const { data, error } = await query;
    if (error) throw error;

    if (!data || data.length === 0) return [];
    
    // Aggregate data by student_id
    const studentMap = new Map<string, {
      id: string;
      name: string;
      registration: string;
      assessments: { id: string, score: number, gradedDate?: string }[];
    }>();

    data.forEach(item => {
      if (!item.students) return;
      
      const studentId = item.student_id;
      const studentEntry = studentMap.get(studentId) || {
        id: studentId,
        name: item.students.name,
        registration: item.students.registration,
        assessments: []
      };
      
      studentEntry.assessments.push({
        id: item.id,
        score: Number(item.score),
        gradedDate: item.graded_date
      });
      
      studentMap.set(studentId, studentEntry);
    });
    
    // Calculate performance metrics
    return Array.from(studentMap.values()).map(student => {
      // Calculate average score
      const totalScore = student.assessments.reduce((sum, assessment) => sum + assessment.score, 0);
      const averageScore = student.assessments.length > 0 ? 
        parseFloat((totalScore / student.assessments.length).toFixed(2)) : 
        0;
      
      // Find last graded date
      let lastGradedDate: string | undefined;
      student.assessments.forEach(assessment => {
        if (assessment.gradedDate) {
          if (!lastGradedDate || new Date(assessment.gradedDate) > new Date(lastGradedDate)) {
            lastGradedDate = assessment.gradedDate;
          }
        }
      });
      
      return {
        id: student.id,
        name: student.name,
        registration: student.registration,
        totalAssessments: student.assessments.length,
        averageScore,
        lastGradedDate
      };
    });
  } catch (error) {
    handleError(error, 'calcular resumo de desempenho dos alunos');
    return [];
  }
}

// Define the type for student performance summary
export interface StudentPerformanceSummary {
  id: string;
  name: string;
  registration: string;
  totalAssessments: number;
  averageScore: number;
  lastGradedDate?: string;
}

export const studentAssessmentService = {
  getAll,
  getByStudent,
  getByAssessment,
  getById,
  create,
  update,
  delete: deleteStudentAssessment,
  getAssessmentAverage,
  getSummaryByStudent
};
