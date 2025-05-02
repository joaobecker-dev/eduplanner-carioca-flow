
import { CalendarEvent, ID, Assessment, StudentAssessment } from '@/types';
import { createService, handleError } from './baseService';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCase, mapToSnakeCase } from '@/integrations/supabase/supabaseAdapter';

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
  
  // Sync a calendar event from a student assessment (placeholder for future implementation)
  syncFromStudentAssessment: async (studentAssessment: StudentAssessment): Promise<void> => {
    try {
      // This is a placeholder function, not actively used in current implementation
      // In a future version, this could create personal calendar events for students
      // when their assessments are graded or when they have submissions due
      
      console.log('Student assessment synced with calendar:', studentAssessment.id);
      
      // Example implementation if needed in the future:
      /*
      // Get the assessment details to create the event
      const { data: assessmentData } = await supabase
        .from("assessments")
        .select('*')
        .eq('id', studentAssessment.assessmentId)
        .single();
        
      if (!assessmentData) return;
      
      const assessment = mapToCamelCase<Assessment>(assessmentData);
      
      const eventData = {
        title: `Grade for: ${assessment.title}`,
        description: studentAssessment.feedback || '',
        type: "deadline" as const,
        start_date: studentAssessment.gradedDate || assessment.date,
        all_day: true,
        student_id: studentAssessment.studentId, // Would need to add this field to calendar_events
        assessment_id: assessment.id,
        subject_id: assessment.subjectId,
      };
      
      await supabase
        .from("calendar_events")
        .upsert(eventData, {
          onConflict: 'student_assessment_id', // Would need to add this field and constraint
          ignoreDuplicates: false
        });
      */
    } catch (error) {
      handleError(error, 'sincronizar evento do calendário com avaliação de aluno');
    }
  }
};
