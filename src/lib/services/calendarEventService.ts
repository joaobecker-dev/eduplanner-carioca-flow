
import { CalendarEvent, ID, Assessment, StudentAssessment, LessonPlan, TeachingPlan } from '@/types';
import { createService, handleError } from './baseService';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCase, mapToSnakeCase, toISO } from '@/integrations/supabase/supabaseAdapter';

// Calendar Event Service
export const calendarEventService = {
  ...createService<CalendarEvent>("calendar_events"),
  
  // Get all events between two dates
  getByDateRange: async (startDate: string, endDate: string): Promise<CalendarEvent[]> => {
    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .select('*')
        .gte('start_date', startDate)
        .lte('start_date', endDate);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<CalendarEvent>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar eventos por período');
      return [];
    }
  },
  
  // Get all events for a specific subject
  getBySubject: async (subjectId: ID): Promise<CalendarEvent[]> => {
    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .select('*')
        .eq('subject_id', subjectId);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<CalendarEvent>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar eventos por disciplina');
      return [];
    }
  },
  
  // Sync a calendar event from an assessment
  syncFromAssessment: async (assessment: Assessment): Promise<void> => {
    try {
      // Event data preparation
      const eventData = {
        title: assessment.title,
        description: assessment.description || null,
        type: "exam" as const,
        start_date: assessment.date, // Already an ISO string
        end_date: assessment.dueDate || assessment.date, // Use dueDate if available, otherwise use date
        all_day: true, // Assessments are typically all-day events
        subject_id: assessment.subjectId,
        assessment_id: assessment.id,
        color: null, // Can be set based on assessment type if needed
      };
      
      // Upsert the event - create or update based on assessment_id
      const { error } = await supabase
        .from("calendar_events")
        .upsert(eventData, {
          onConflict: 'assessment_id',
          ignoreDuplicates: false
        });
      
      if (error) throw error;
      
    } catch (error) {
      handleError(error, 'sincronizar evento do calendário com avaliação');
    }
  },
  
  // Sync a calendar event from a student assessment
  syncFromStudentAssessment: async (studentAssessment: StudentAssessment): Promise<void> => {
    try {
      // This is a placeholder function, to be implemented in the future if needed
      console.log('Student assessment synced with calendar:', studentAssessment.id);
      
      // Example implementation could be added here when needed
      /*
      // Get the assessment details to create the event
      const { data: assessmentData } = await supabase
        .from("assessments")
        .select('*')
        .eq('id', studentAssessment.assessmentId)
        .maybeSingle();
        
      if (!assessmentData) return;
      
      const assessment = mapToCamelCase<Assessment>(assessmentData);
      
      const eventData = {
        title: `Grade for: ${assessment.title}`,
        description: studentAssessment.feedback || '',
        type: "deadline" as const,
        start_date: studentAssessment.gradedDate || assessment.date,
        all_day: true,
        student_id: studentAssessment.studentId,
        assessment_id: assessment.id,
        subject_id: assessment.subjectId,
      };
      
      await supabase
        .from("calendar_events")
        .upsert(eventData, {
          onConflict: 'student_assessment_id',
          ignoreDuplicates: false
        });
      */
    } catch (error) {
      handleError(error, 'sincronizar evento do calendário com avaliação de aluno');
    }
  },

  // Sync a calendar event from a lesson plan
  syncFromLessonPlan: async (lessonPlan: LessonPlan): Promise<void> => {
    try {
      // Skip if date is missing
      if (!lessonPlan.date) {
        console.log('Lesson plan date is missing, skipping calendar sync');
        return;
      }

      // Event data preparation
      const eventData = {
        title: `Plano de Aula: ${lessonPlan.title}`,
        description: lessonPlan.notes || null,
        type: "class" as const, // Using "class" instead of "lesson"
        start_date: lessonPlan.date, // Already an ISO string
        end_date: lessonPlan.date, // Lesson plans typically last one day
        all_day: true, // Lesson plans are typically all-day events
        subject_id: null, // Lesson plans don't have a direct subject reference
        teaching_plan_id: lessonPlan.teachingPlanId,
        lesson_plan_id: lessonPlan.id,
        color: null,
      };
      
      // Upsert the event - create or update based on lesson_plan_id
      const { error } = await supabase
        .from("calendar_events")
        .upsert(eventData, {
          onConflict: 'lesson_plan_id',
          ignoreDuplicates: false
        });
      
      if (error) throw error;
      
    } catch (error) {
      handleError(error, 'sincronizar evento do calendário com plano de aula');
    }
  },

  // Sync a calendar event from a teaching plan
  syncFromTeachingPlan: async (teachingPlan: TeachingPlan): Promise<void> => {
    try {
      // Skip if start date is missing
      if (!teachingPlan.startDate) {
        console.log('Teaching plan start date is missing, skipping calendar sync');
        return;
      }

      // Event data preparation
      const eventData = {
        title: `Plano de Ensino: ${teachingPlan.title}`,
        description: teachingPlan.description || null,
        type: "class" as const, // Using "class" instead of "teaching"
        start_date: teachingPlan.startDate, // Already an ISO string
        end_date: teachingPlan.endDate || teachingPlan.startDate, // Use endDate if available
        all_day: true, // Teaching plans are typically all-day events
        subject_id: teachingPlan.subjectId,
        teaching_plan_id: teachingPlan.id,
        lesson_plan_id: null,
        color: null,
      };
      
      // Upsert the event - create or update based on teaching_plan_id
      const { error } = await supabase
        .from("calendar_events")
        .upsert(eventData, {
          onConflict: 'teaching_plan_id',
          ignoreDuplicates: false
        });
      
      if (error) throw error;
      
    } catch (error) {
      handleError(error, 'sincronizar evento do calendário com plano de ensino');
    }
  }
};
