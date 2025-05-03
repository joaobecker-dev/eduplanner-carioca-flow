import { CalendarEvent, ID, Assessment, StudentAssessment, LessonPlan, TeachingPlan, EventType, EventSourceType } from '@/types';
import { createService, handleError } from './baseService';
import { supabase } from "@/integrations/supabase/client";
import { normalizeToISO } from '@/integrations/supabase/supabaseAdapter';
import { mapToCamelCase } from '@/lib/utils/caseConverters';

// Create base service with fully exposed implementation
const baseService = createService<CalendarEvent>("calendar_events");

// Function to map DB response to camelCase object
const mapToCamelCaseEvent = (data: any): CalendarEvent => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    startDate: data.start_date,
    endDate: data.end_date,
    allDay: data.all_day,
    type: data.type as EventType,
    subjectId: data.subject_id,
    lessonPlanId: data.lesson_plan_id,
    assessmentId: data.assessment_id,
    teachingPlanId: data.teaching_plan_id,
    location: data.location,
    color: data.color,
    sourceType: data.source_type as EventSourceType,
    sourceId: data.source_id,
    created_at: data.created_at
  };
};

// Custom deleteEvent method (distinct from baseService.delete)
const deleteEvent = async (id: ID): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("calendar_events")
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    handleError(error, 'excluir evento do calendário');
    return false;
  }
};

// Get events by date range
const getByDateRange = async (startDate: string, endDate: string): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from("calendar_events")
      .select('*')
      .gte('start_date', startDate)
      .lte('start_date', endDate);

    if (error) throw error;
    return data ? data.map(mapToCamelCaseEvent) : [];
  } catch (error) {
    handleError(error, 'buscar eventos por período');
    return [];
  }
};

// Get events by subject
const getBySubject = async (subjectId: ID): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from("calendar_events")
      .select('*')
      .eq('subject_id', subjectId);

    if (error) throw error;
    return data ? data.map(mapToCamelCaseEvent) : [];
  } catch (error) {
    handleError(error, 'buscar eventos por disciplina');
    return [];
  }
};

// Create new event with proper typing
const create = async (eventData: Omit<CalendarEvent, 'id' | 'created_at'>): Promise<CalendarEvent | null> => {
  try {
    // Use direct object construction with snake_case keys
    const preparedData = {
      title: eventData.title,
      description: eventData.description,
      type: eventData.type as EventType,
      start_date: normalizeToISO(eventData.startDate),
      end_date: normalizeToISO(eventData.endDate),
      all_day: eventData.allDay,
      subject_id: eventData.subjectId,
      lesson_plan_id: eventData.lessonPlanId,
      assessment_id: eventData.assessmentId,
      teaching_plan_id: eventData.teachingPlanId,
      location: eventData.location,
      color: eventData.color,
      source_type: eventData.sourceType as EventSourceType || 'manual',
      source_id: eventData.sourceId
    };

    if (!preparedData.title || !preparedData.type || !preparedData.start_date) {
      throw new Error("Missing required fields for calendar event");
    }

    const { data, error } = await supabase
      .from("calendar_events")
      .insert(preparedData)
      .select()
      .single();

    if (error) throw error;
    return mapToCamelCaseEvent(data);
  } catch (error) {
    handleError(error, 'criar evento do calendário');
    throw error;
  }
};

// Update event with proper typing
const update = async (id: ID, eventData: Partial<CalendarEvent>): Promise<CalendarEvent | null> => {
  try {
    // Use direct object construction with snake_case keys
    const updateData: Record<string, any> = {};

    if (eventData.title !== undefined) updateData.title = eventData.title;
    if (eventData.description !== undefined) updateData.description = eventData.description;
    if (eventData.type !== undefined) updateData.type = eventData.type as EventType;
    if (eventData.startDate !== undefined) updateData.start_date = normalizeToISO(eventData.startDate);
    if (eventData.endDate !== undefined) updateData.end_date = normalizeToISO(eventData.endDate);
    if (eventData.allDay !== undefined) updateData.all_day = eventData.allDay;
    if (eventData.subjectId !== undefined) updateData.subject_id = eventData.subjectId;
    if (eventData.lessonPlanId !== undefined) updateData.lesson_plan_id = eventData.lessonPlanId;
    if (eventData.assessmentId !== undefined) updateData.assessment_id = eventData.assessmentId;
    if (eventData.teachingPlanId !== undefined) updateData.teaching_plan_id = eventData.teachingPlanId;
    if (eventData.location !== undefined) updateData.location = eventData.location;
    if (eventData.color !== undefined) updateData.color = eventData.color;
    if (eventData.sourceType !== undefined) updateData.source_type = eventData.sourceType as EventSourceType;
    if (eventData.sourceId !== undefined) updateData.source_id = eventData.sourceId;

    const { data, error } = await supabase
      .from("calendar_events")
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapToCamelCaseEvent(data);
  } catch (error) {
    handleError(error, 'atualizar evento do calendário');
    throw error;
  }
};

// Delete events by source
const deleteBySource = async (sourceType: string, sourceId: ID): Promise<boolean> => {
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
};

// Sync from assessment
const syncFromAssessment = async (assessment: Assessment): Promise<void> => {
  try {
    if (!assessment || !assessment.id) return;

    // Direct object with snake_case keys
    const eventData = {
      title: `Avaliação: ${assessment.title}`,
      description: assessment.description || '',
      type: "exam" as EventType,
      start_date: normalizeToISO(assessment.date) || '',
      end_date: normalizeToISO(assessment.dueDate || assessment.date) || '',
      all_day: true,
      subject_id: assessment.subjectId,
      assessment_id: assessment.id,
      color: '#e67c73',
      source_type: 'assessment' as EventSourceType,
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

// Sync from lesson plan 
const syncFromLessonPlan = async (lessonPlan: LessonPlan): Promise<void> => {
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

    // Direct object construction with explicit snake_case keys
    const eventData = {
      title: `Aula: ${lessonPlan.title}`,
      description: lessonPlan.notes || '',
      type: "class" as EventType,
      start_date: startDate,
      end_date: endDate,
      all_day: false,
      teaching_plan_id: lessonPlan.teachingPlanId,
      lesson_plan_id: lessonPlan.id,
      color: '#9b87f5',
      source_type: 'lesson_plan' as EventSourceType,
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

// Sync from teaching plan
const syncFromTeachingPlan = async (teachingPlan: TeachingPlan): Promise<void> => {
  try {
    if (!teachingPlan || !teachingPlan.startDate || !teachingPlan.id) return;

    // Direct object construction with explicit snake_case keys
    const eventData = {
      title: `Plano de Ensino: ${teachingPlan.title}`,
      description: teachingPlan.description || '',
      type: "class" as EventType,
      start_date: normalizeToISO(teachingPlan.startDate) || '',
      end_date: normalizeToISO(teachingPlan.endDate) || '',
      all_day: true,
      subject_id: teachingPlan.subjectId,
      teaching_plan_id: teachingPlan.id,
      color: '#7E69AB',
      source_type: 'teaching_plan' as EventSourceType,
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

// Implement syncFromStudentAssessment
const syncFromStudentAssessment = async (studentAssessment: StudentAssessment): Promise<void> => {
  try {
    if (!studentAssessment || !studentAssessment.id) return;
    
    // Direct object with snake_case keys
    const eventData = {
      title: `Prova Individual: ${studentAssessment.assessmentId}`,
      description: studentAssessment.feedback || '',
      type: "exam" as EventType,
      start_date: normalizeToISO(studentAssessment.submittedDate) || '',
      end_date: normalizeToISO(studentAssessment.gradedDate || studentAssessment.submittedDate) || '',
      all_day: true,
      assessment_id: studentAssessment.assessmentId,
      color: '#e67c73',
      source_type: 'student_assessment' as EventSourceType,
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

// Export service with explicit method definitions - avoid using spread operator
export const calendarEventService = {
  // Methods from base service
  getAll: baseService.getAll,
  getById: baseService.getById,
  delete: baseService.delete, // Original delete method from base service
  
  // Custom delete method - ensure it's explicitly exported
  deleteEvent,
  
  // Custom methods
  getByDateRange,
  getBySubject,
  create,
  update,
  deleteBySource,
  syncFromAssessment,
  syncFromLessonPlan,
  syncFromTeachingPlan,
  syncFromStudentAssessment
};
