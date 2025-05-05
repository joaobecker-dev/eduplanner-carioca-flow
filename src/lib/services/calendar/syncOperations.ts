
import { Assessment, LessonPlan, StudentAssessment, TeachingPlan } from '@/types';
import { handleError } from '../baseService';
import { supabase } from "@/integrations/supabase/client";
import { CalendarEventDatabaseFields } from './types';
import { normalizeToISO } from '@/integrations/supabase/supabaseAdapter';

// Sync methods for different sources
export const syncFromAssessment = async (assessment: Assessment | string): Promise<void> => {
  try {
    // If we received an ID instead of an Assessment object, fetch the assessment first
    let assessmentData: Assessment;
    
    if (typeof assessment === 'string') {
      const { data, error } = await supabase
        .from("assessments")
        .select('*')
        .eq('id', assessment)
        .single();
        
      if (error) throw error;
      if (!data) return;
      
      assessmentData = data as Assessment;
    } else {
      assessmentData = assessment;
    }

    if (!assessmentData || !assessmentData.id) return;

    const eventData: CalendarEventDatabaseFields = {
      title: `Avaliação: ${assessmentData.title}`,
      description: assessmentData.description || '',
      type: "exam",
      start_date: normalizeToISO(assessmentData.date) || '',
      end_date: assessmentData.dueDate ? normalizeToISO(assessmentData.dueDate) : normalizeToISO(assessmentData.date),
      all_day: true,
      subject_id: assessmentData.subjectId,
      assessment_id: assessmentData.id,
      color: '#e67c73',
      source_type: 'assessment',
      source_id: assessmentData.id
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

export const syncFromLessonPlan = async (lessonPlan: LessonPlan | string): Promise<void> => {
  try {
    // If we received an ID instead of a LessonPlan object, fetch the lesson plan first
    let lessonPlanData: LessonPlan;
    
    if (typeof lessonPlan === 'string') {
      const { data, error } = await supabase
        .from("lesson_plans")
        .select('*')
        .eq('id', lessonPlan)
        .single();
        
      if (error) throw error;
      if (!data) return;
      
      lessonPlanData = data as LessonPlan;
    } else {
      lessonPlanData = lessonPlan;
    }

    if (!lessonPlanData || !lessonPlanData.date || !lessonPlanData.id) return;

    const startDate = normalizeToISO(lessonPlanData.date) || '';
    let endDate = startDate;
    
    // Calculate end date based on duration in minutes
    if (lessonPlanData.duration) {
      const date = new Date(lessonPlanData.date);
      date.setMinutes(date.getMinutes() + lessonPlanData.duration);
      endDate = normalizeToISO(date) || startDate;
    }

    const eventData: CalendarEventDatabaseFields = {
      title: `Aula: ${lessonPlanData.title}`,
      description: lessonPlanData.notes || '',
      type: "class",
      start_date: startDate,
      end_date: endDate,
      all_day: false,
      teaching_plan_id: lessonPlanData.teachingPlanId,
      lesson_plan_id: lessonPlanData.id,
      color: '#9b87f5',
      source_type: 'lesson_plan',
      source_id: lessonPlanData.id
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

export const syncFromTeachingPlan = async (teachingPlan: TeachingPlan | string): Promise<void> => {
  try {
    // If we received an ID instead of a TeachingPlan object, fetch the teaching plan first
    let teachingPlanData: TeachingPlan;
    
    if (typeof teachingPlan === 'string') {
      const { data, error } = await supabase
        .from("teaching_plans")
        .select('*')
        .eq('id', teachingPlan)
        .single();
        
      if (error) throw error;
      if (!data) return;
      
      teachingPlanData = data as TeachingPlan;
    } else {
      teachingPlanData = teachingPlan;
    }

    if (!teachingPlanData || !teachingPlanData.startDate || !teachingPlanData.id) return;

    const eventData: CalendarEventDatabaseFields = {
      title: `Plano de Ensino: ${teachingPlanData.title}`,
      description: teachingPlanData.description || '',
      type: "class",
      start_date: normalizeToISO(teachingPlanData.startDate) || '',
      end_date: normalizeToISO(teachingPlanData.endDate),
      all_day: true,
      subject_id: teachingPlanData.subjectId,
      teaching_plan_id: teachingPlanData.id,
      color: '#7E69AB',
      source_type: 'teaching_plan',
      source_id: teachingPlanData.id
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
