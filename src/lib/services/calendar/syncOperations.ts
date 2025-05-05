
import { Assessment, LessonPlan, StudentAssessment, TeachingPlan } from '@/types';
import { handleError } from '../baseService';
import { supabase } from "@/integrations/supabase/client";
import { CalendarEventDatabaseFields } from './types';
import { normalizeToISO } from '@/integrations/supabase/supabaseAdapter';

// Sync methods for different sources
export const syncFromAssessment = async (assessment: Assessment): Promise<void> => {
  try {
    if (!assessment || !assessment.id) return;

    const eventData: CalendarEventDatabaseFields = {
      title: `Avaliação: ${assessment.title}`,
      description: assessment.description || '',
      type: "exam",
      start_date: normalizeToISO(assessment.date) || '',
      end_date: assessment.dueDate ? normalizeToISO(assessment.dueDate) : normalizeToISO(assessment.date),
      all_day: true,
      subject_id: assessment.subjectId,
      assessment_id: assessment.id,
      color: '#e67c73',
      source_type: 'assessment',
      source_id: assessment.id
    };

    const { error } = await supabase
      .from("calendar_events")
      .upsert(eventData, {
        onConflict: 'source_id,source_type',
        ignoreDuplicates: false
      });

    if (error) throw error;
  } catch (error) {
    handleError(error, 'sincronizar evento do calendário com avaliação');
  }
};

export const syncFromLessonPlan = async (lessonPlan: LessonPlan): Promise<void> => {
  try {
    if (!lessonPlan || !lessonPlan.date || !lessonPlan.id) return;

    const startDate = normalizeToISO(lessonPlan.date) || '';
    let endDate = startDate;
    
    // Calculate end date based on duration in minutes
    if (lessonPlan.duration) {
      const date = new Date(lessonPlan.date);
      date.setMinutes(date.getMinutes() + lessonPlan.duration);
      endDate = normalizeToISO(date) || startDate;
    }

    const eventData: CalendarEventDatabaseFields = {
      title: `Aula: ${lessonPlan.title}`,
      description: lessonPlan.notes || '',
      type: "class",
      start_date: startDate,
      end_date: endDate,
      all_day: false,
      teaching_plan_id: lessonPlan.teachingPlanId,
      lesson_plan_id: lessonPlan.id,
      color: '#9b87f5',
      source_type: 'lesson_plan',
      source_id: lessonPlan.id
    };

    const { error } = await supabase
      .from("calendar_events")
      .upsert(eventData, {
        onConflict: 'source_id,source_type',
        ignoreDuplicates: false
      });

    if (error) throw error;
  } catch (error) {
    handleError(error, 'sincronizar evento do calendário com plano de aula');
  }
};

export const syncFromTeachingPlan = async (teachingPlan: TeachingPlan): Promise<void> => {
  try {
    if (!teachingPlan || !teachingPlan.startDate || !teachingPlan.id) return;

    const eventData: CalendarEventDatabaseFields = {
      title: `Plano de Ensino: ${teachingPlan.title}`,
      description: teachingPlan.description || '',
      type: "class",
      start_date: normalizeToISO(teachingPlan.startDate) || '',
      end_date: normalizeToISO(teachingPlan.endDate),
      all_day: true,
      subject_id: teachingPlan.subjectId,
      teaching_plan_id: teachingPlan.id,
      color: '#7E69AB',
      source_type: 'teaching_plan',
      source_id: teachingPlan.id
    };

    const { error } = await supabase
      .from("calendar_events")
      .upsert(eventData, {
        onConflict: 'source_id,source_type',
        ignoreDuplicates: false
      });

    if (error) throw error;
  } catch (error) {
    handleError(error, 'sincronizar evento do calendário com plano de ensino');
  }
};

export const syncFromStudentAssessment = async (studentAssessment: StudentAssessment): Promise<void> => {
  try {
    if (!studentAssessment || !studentAssessment.id) return;
    
    const eventData: CalendarEventDatabaseFields = {
      title: `Prova Individual: ${studentAssessment.assessmentId}`,
      description: studentAssessment.feedback || '',
      type: "exam",
      start_date: normalizeToISO(studentAssessment.submittedDate) || '',
      end_date: studentAssessment.gradedDate ? normalizeToISO(studentAssessment.gradedDate) : undefined,
      all_day: true,
      assessment_id: studentAssessment.assessmentId,
      color: '#e67c73',
      source_type: 'student_assessment',
      source_id: studentAssessment.id
    };

    const { error } = await supabase
      .from("calendar_events")
      .upsert(eventData, {
        onConflict: 'source_id,source_type',
        ignoreDuplicates: false
      });

    if (error) throw error;
  } catch (error) {
    handleError(error, 'sincronizar evento do calendário com avaliação do estudante');
  }
};
