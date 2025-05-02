
import { CalendarEvent, ID, Assessment, StudentAssessment, LessonPlan, TeachingPlan } from '@/types';
import { createService, handleError } from './baseService';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCase, mapToSnakeCase, normalizeToISO, toISO } from '@/integrations/supabase/supabaseAdapter';

// Calendar Event Service
export const calendarEventService = {
  ...createService<CalendarEvent>("calendar_events"),

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

  create: async (eventData: Omit<CalendarEvent, 'id' | 'created_at'>): Promise<CalendarEvent> => {
    try {
      // Convert camelCase to snake_case and handle date conversion
      const preparedData = mapToSnakeCase<Record<string, any>>(eventData);

      const { data, error } = await supabase
        .from("calendar_events")
        .insert(preparedData)
        .select()
        .single();

      if (error) throw error;
      return mapToCamelCase<CalendarEvent>(data);
    } catch (error) {
      handleError(error, 'criar evento do calendário');
      throw error;
    }
  },

  update: async (id: ID, eventData: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    try {
      // Convert camelCase to snake_case and handle date conversion
      const preparedData = mapToSnakeCase<Record<string, any>>(eventData);

      const { data, error } = await supabase
        .from("calendar_events")
        .update(preparedData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapToCamelCase<CalendarEvent>(data);
    } catch (error) {
      handleError(error, 'atualizar evento do calendário');
      throw error;
    }
  },

  syncFromAssessment: async (assessment: Assessment): Promise<void> => {
    try {
      if (!assessment) return;

      const eventData = {
        title: assessment.title,
        description: assessment.description || null,
        type: "exam" as const,
        start_date: normalizeToISO(assessment.date),
        end_date: normalizeToISO(assessment.dueDate || assessment.date),
        all_day: true,
        subject_id: assessment.subjectId,
        assessment_id: assessment.id,
        color: null,
      };

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

  syncFromStudentAssessment: async (studentAssessment: StudentAssessment): Promise<void> => {
    try {
      if (!studentAssessment) return;
      console.log('Student assessment synced with calendar:', studentAssessment.id);
    } catch (error) {
      handleError(error, 'sincronizar evento do calendário com avaliação de aluno');
    }
  },

  syncFromLessonPlan: async (lessonPlan: LessonPlan): Promise<void> => {
    try {
      if (!lessonPlan || !lessonPlan.date) {
        console.log('Lesson plan date is missing, skipping calendar sync');
        return;
      }

      const eventData = {
        title: `Plano de Aula: ${lessonPlan.title}`,
        description: lessonPlan.notes || null,
        type: "class" as const,
        start_date: normalizeToISO(lessonPlan.date),
        end_date: normalizeToISO(lessonPlan.date),
        all_day: true,
        subject_id: null,
        teaching_plan_id: lessonPlan.teachingPlanId,
        lesson_plan_id: lessonPlan.id,
        color: null,
      };

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

  syncFromTeachingPlan: async (teachingPlan: TeachingPlan): Promise<void> => {
    try {
      if (!teachingPlan || !teachingPlan.startDate) {
        console.log('Teaching plan start date is missing, skipping calendar sync');
        return;
      }

      const eventData = {
        title: `Plano de Ensino: ${teachingPlan.title}`,
        description: teachingPlan.description || null,
        type: "class" as const,
        start_date: normalizeToISO(teachingPlan.startDate),
        end_date: normalizeToISO(teachingPlan.endDate || teachingPlan.startDate),
        all_day: true,
        subject_id: teachingPlan.subjectId,
        teaching_plan_id: teachingPlan.id,
        lesson_plan_id: null,
        color: null,
      };

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
