
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
      // Create a properly typed object for insertion
      const preparedData = {
        title: eventData.title,
        description: eventData.description,
        type: eventData.type,
        start_date: normalizeToISO(eventData.startDate),
        end_date: normalizeToISO(eventData.endDate),
        all_day: eventData.allDay,
        subject_id: eventData.subjectId,
        lesson_plan_id: eventData.lessonPlanId,
        assessment_id: eventData.assessmentId,
        teaching_plan_id: eventData.teachingPlanId,
        location: eventData.location,
        color: eventData.color,
        source_type: eventData.sourceType || 'manual', // Default to manual if not specified
        source_id: eventData.sourceId
      };
      
      // Ensure required fields are present
      if (!preparedData.title || !preparedData.type || !preparedData.start_date) {
        throw new Error("Missing required fields for calendar event");
      }

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
      // Create a properly typed update object
      const updateData: Record<string, any> = {};
      
      if (eventData.title !== undefined) updateData.title = eventData.title;
      if (eventData.description !== undefined) updateData.description = eventData.description;
      if (eventData.type !== undefined) updateData.type = eventData.type;
      if (eventData.startDate !== undefined) updateData.start_date = normalizeToISO(eventData.startDate);
      if (eventData.endDate !== undefined) updateData.end_date = normalizeToISO(eventData.endDate);
      if (eventData.allDay !== undefined) updateData.all_day = eventData.allDay;
      if (eventData.subjectId !== undefined) updateData.subject_id = eventData.subjectId;
      if (eventData.lessonPlanId !== undefined) updateData.lesson_plan_id = eventData.lessonPlanId;
      if (eventData.assessmentId !== undefined) updateData.assessment_id = eventData.assessmentId;
      if (eventData.teachingPlanId !== undefined) updateData.teaching_plan_id = eventData.teachingPlanId;
      if (eventData.location !== undefined) updateData.location = eventData.location;
      if (eventData.color !== undefined) updateData.color = eventData.color;
      if (eventData.sourceType !== undefined) updateData.source_type = eventData.sourceType;
      if (eventData.sourceId !== undefined) updateData.source_id = eventData.sourceId;

      const { data, error } = await supabase
        .from("calendar_events")
        .update(updateData)
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

  // Implement the delete method
  deleteEvent: async (id: ID): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("calendar_events")
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error, 'excluir evento do calendário');
      throw error;
    }
  },

  // Delete events by source
  deleteBySource: async (sourceType: string, sourceId: ID): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("calendar_events")
        .delete()
        .eq('source_type', sourceType)
        .eq('source_id', sourceId);

      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error, `excluir eventos do calendário por fonte (${sourceType})`);
      return false;
    }
  },

  syncFromAssessment: async (assessment: Assessment): Promise<void> => {
    try {
      if (!assessment || !assessment.id) {
        console.log('Assessment data is missing, skipping calendar sync');
        return;
      }

      // Create the event object with all required fields
      const eventData = {
        title: `Avaliação: ${assessment.title}`,
        description: assessment.description || '',
        type: "exam" as const,
        startDate: normalizeToISO(assessment.date) || '',
        endDate: normalizeToISO(assessment.dueDate || assessment.date) || '',
        allDay: true,
        subjectId: assessment.subjectId,
        assessmentId: assessment.id,
        color: '#e67c73', // Reddish color for exams
        sourceType: 'assessment' as const,
        sourceId: assessment.id
      };

      // Use upsert with onConflict to prevent duplication
      const { error } = await supabase
        .from("calendar_events")
        .upsert(mapToSnakeCase(eventData), {
          onConflict: 'source_id,source_type',
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
      // Currently not creating calendar events for student assessments
    } catch (error) {
      handleError(error, 'sincronizar evento do calendário com avaliação de aluno');
    }
  },

  syncFromLessonPlan: async (lessonPlan: LessonPlan): Promise<void> => {
    try {
      if (!lessonPlan || !lessonPlan.date || !lessonPlan.id) {
        console.log('Lesson plan data is missing, skipping calendar sync');
        return;
      }

      const startDate = normalizeToISO(lessonPlan.date) || '';
      
      // Calculate end date based on duration (in minutes)
      let endDate = startDate;
      if (lessonPlan.duration) {
        const date = new Date(lessonPlan.date);
        date.setMinutes(date.getMinutes() + lessonPlan.duration);
        endDate = normalizeToISO(date) || startDate;
      }

      // Create the event object with all required fields
      const eventData = {
        title: `Aula: ${lessonPlan.title}`,
        description: lessonPlan.notes || '',
        type: "class" as const,
        startDate: startDate,
        endDate: endDate,
        allDay: false, // Lesson plans typically have a duration
        teachingPlanId: lessonPlan.teachingPlanId,
        lessonPlanId: lessonPlan.id,
        color: '#9b87f5', // Purple color for classes
        sourceType: 'lesson_plan' as const,
        sourceId: lessonPlan.id
      };

      // Use upsert with onConflict to prevent duplication
      const { error } = await supabase
        .from("calendar_events")
        .upsert(mapToSnakeCase(eventData), {
          onConflict: 'source_id,source_type',
          ignoreDuplicates: false
        });

      if (error) throw error;
    } catch (error) {
      handleError(error, 'sincronizar evento do calendário com plano de aula');
    }
  },

  syncFromTeachingPlan: async (teachingPlan: TeachingPlan): Promise<void> => {
    try {
      if (!teachingPlan || !teachingPlan.startDate || !teachingPlan.id) {
        console.log('Teaching plan data is missing, skipping calendar sync');
        return;
      }

      // Create the event object with all required fields
      const eventData = {
        title: `Plano de Ensino: ${teachingPlan.title}`,
        description: teachingPlan.description || '',
        type: "class" as const,
        startDate: normalizeToISO(teachingPlan.startDate) || '',
        endDate: normalizeToISO(teachingPlan.endDate) || '',
        allDay: true,
        subjectId: teachingPlan.subjectId,
        teachingPlanId: teachingPlan.id,
        color: '#7E69AB', // Darker purple for teaching plans
        sourceType: 'teaching_plan' as const,
        sourceId: teachingPlan.id
      };

      // Use upsert with onConflict to prevent duplication
      const { error } = await supabase
        .from("calendar_events")
        .upsert(mapToSnakeCase(eventData), {
          onConflict: 'source_id,source_type',
          ignoreDuplicates: false
        });

      if (error) throw error;
    } catch (error) {
      handleError(error, 'sincronizar evento do calendário com plano de ensino');
    }
  }
};
