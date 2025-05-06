
import { ID, StudentAssessment } from '@/types';
import { createService } from './baseService';
import { supabase } from '@/integrations/supabase/client';
import { calendarEventService } from './calendar';
import { mapStudentAssessmentToDb } from '@/lib/utils/dataMappers';

// Type for grades update batch
interface GradeBatch {
  id: ID;
  score: number;
  feedback?: string;
}

export const studentAssessmentService = {
  ...createService<StudentAssessment>('student_assessments'),

  // Get all assessments for a student
  getByStudent: async (studentId: ID): Promise<StudentAssessment[]> => {
    try {
      const { data, error } = await supabase
        .from('student_assessments')
        .select(`
          *,
          students!inner(*),
          assessments!inner(*)
        `)
        .eq('student_id', studentId);

      if (error) throw error;

      return data.map((item) => ({
        id: item.id,
        studentId: item.student_id,
        assessmentId: item.assessment_id,
        score: item.score,
        feedback: item.feedback,
        submittedDate: item.submitted_date,
        gradedDate: item.graded_date,
        status: item.graded_date ? 'graded' : (item.submitted_date ? 'submitted' : 'pending'),
        created_at: item.created_at,
        // Include assessment and student information if needed
      }));
    } catch (error) {
      console.error('Error getting student assessments:', error);
      return [];
    }
  },

  // Get all student assessments for an assessment
  getByAssessment: async (assessmentId: ID): Promise<StudentAssessment[]> => {
    try {
      const { data, error } = await supabase
        .from('student_assessments')
        .select(`
          *,
          students(*),
          assessments(*)
        `)
        .eq('assessment_id', assessmentId);

      if (error) throw error;

      return data.map((item) => ({
        id: item.id,
        studentId: item.student_id,
        assessmentId: item.assessment_id,
        score: item.score,
        feedback: item.feedback,
        submittedDate: item.submitted_date,
        gradedDate: item.graded_date,
        status: item.graded_date ? 'graded' : (item.submitted_date ? 'submitted' : 'pending'),
        created_at: item.created_at,
        // Include assessment and student information if needed
      }));
    } catch (error) {
      console.error('Error getting assessment students:', error);
      return [];
    }
  },

  // Update grades in batch
  updateGrades: async (grades: GradeBatch[]): Promise<boolean> => {
    try {
      // Update each grade individually to ensure proper validation
      for (const grade of grades) {
        const { error } = await supabase
          .from('student_assessments')
          .update({
            score: grade.score,
            feedback: grade.feedback || null,
            graded_date: new Date().toISOString(),
          })
          .eq('id', grade.id);

        if (error) throw error;

        // Use syncFromAssessment instead of syncFromStudentAssessment
        // First get the assessment ID for this student assessment
        const { data: assessmentData } = await supabase
          .from('student_assessments')
          .select('assessment_id')
          .eq('id', grade.id)
          .single();

        if (assessmentData && assessmentData.assessment_id) {
          // Now sync the calendar using the assessment ID
          await calendarEventService.syncFromAssessment(assessmentData.assessment_id);
        }
      }

      return true;
    } catch (error) {
      console.error('Error updating grades:', error);
      return false;
    }
  },

  // Create a new student assessment
  createStudentAssessment: async (studentAssessment: Omit<StudentAssessment, 'id' | 'created_at'>): Promise<StudentAssessment | null> => {
    try {
      // Map to database format
      const dbStudentAssessment = mapStudentAssessmentToDb(studentAssessment);
      
      // Ensure required fields
      if (!dbStudentAssessment.student_id || !dbStudentAssessment.assessment_id) {
        throw new Error("Student assessment must have student_id and assessment_id");
      }
      
      const { data, error } = await supabase
        .from('student_assessments')
        .insert({
          student_id: dbStudentAssessment.student_id,
          assessment_id: dbStudentAssessment.assessment_id,
          score: dbStudentAssessment.score || null,
          feedback: dbStudentAssessment.feedback || null,
          submitted_date: dbStudentAssessment.submitted_date || null,
          graded_date: dbStudentAssessment.graded_date || null
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        // Use syncFromAssessment instead of syncFromStudentAssessment
        await calendarEventService.syncFromAssessment(data.assessment_id);
        
        return {
          id: data.id,
          studentId: data.student_id,
          assessmentId: data.assessment_id,
          score: data.score,
          feedback: data.feedback,
          submittedDate: data.submitted_date,
          gradedDate: data.graded_date,
          status: data.graded_date ? 'graded' : (data.submitted_date ? 'submitted' : 'pending'),
          created_at: data.created_at
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error creating student assessment:', error);
      return null;
    }
  }
};
