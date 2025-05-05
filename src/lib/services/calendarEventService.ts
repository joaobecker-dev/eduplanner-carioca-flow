
import { CalendarEvent, ID, Assessment, StudentAssessment, LessonPlan, TeachingPlan, EventType, EventSourceType } from '@/types';
import { handleError } from './baseService';
import { supabase } from "@/integrations/supabase/client";
import { normalizeToISO } from '@/integrations/supabase/supabaseAdapter';

// Basic CRUD operations
const getAll = async (): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from("calendar_events")
      .select('*');
    
    if (error) throw error;
    return data ? data.map(mapToCamelCaseEvent) : [];
  } catch (error) {
    handleError(error, 'buscar eventos do calendário');
    return [];
  }
};

const getById = async (id: ID): Promise<CalendarEvent | null> => {
  try {
    const { data, error } = await supabase
      .from("calendar_events")
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data ? mapToCamelCaseEvent(data) : null;
  } catch (error) {
    handleError(error, 'buscar evento do calendário por ID');
    return null;
  }
};

// Delete methods
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

// Query methods
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

// Data mapping helper - Fixed by using explicit typing
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

// Fixed: Explicit type definition for database fields with required fields
// Making database-required fields non-optional
interface CalendarEventDatabaseFields {
  title: string;
  description?: string;
  type: EventType;
  start_date: string;
  end_date?: string;
  all_day?: boolean;
  subject_id?: string;
  lesson_plan_id?: string;
  assessment_id?: string;
  teaching_plan_id?: string;
  location?: string;
  color?: string;
  source_type?: EventSourceType;
  source_id?: string;
}

// Prepare data for database operations - Fixed by using explicit types
const prepareEventData = (eventData: Partial<CalendarEvent>): CalendarEventDatabaseFields => {
  // Start with defaults for required fields to ensure they're always present
  const updateData: CalendarEventDatabaseFields = {
    title: eventData.title || '',
    type: eventData.type || 'other',
    start_date: eventData.startDate ? normalizeToISO(eventData.startDate) : ''
  };

  // Add optional fields only if they exist
  if (eventData.description !== undefined) updateData.description = eventData.description;
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

  return updateData;
};

// Create and update operations
const create = async (eventData: Omit<CalendarEvent, 'id' | 'created_at'>): Promise<CalendarEvent | null> => {
  try {
    // Create snake_case object for the database ensuring required fields are present
    const preparedData: CalendarEventDatabaseFields = {
      title: eventData.title,
      description: eventData.description,
      type: eventData.type,
      start_date: normalizeToISO(eventData.startDate) || '',
      end_date: eventData.endDate ? normalizeToISO(eventData.endDate) : undefined,
      all_day: eventData.allDay,
      subject_id: eventData.subjectId,
      lesson_plan_id: eventData.lessonPlanId,
      assessment_id: eventData.assessmentId,
      teaching_plan_id: eventData.teachingPlanId,
      location: eventData.location,
      color: eventData.color,
      source_type: eventData.sourceType || 'manual',
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

const update = async (id: ID, eventData: Partial<CalendarEvent>): Promise<CalendarEvent | null> => {
  try {
    const updateData = prepareEventData(eventData);

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

// Sync methods for different sources
const syncFromAssessment = async (assessment: Assessment): Promise<void> => {
  try {
    if (!assessment || !assessment.id) return;

    // Direct object with snake_case keys with required fields explicitly set
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

const syncFromTeachingPlan = async (teachingPlan: TeachingPlan): Promise<void> => {
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

const syncFromStudentAssessment = async (studentAssessment: StudentAssessment): Promise<void> => {
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

// Export all services directly
export const calendarEventService = {
  getAll,
  getById,
  delete: deleteEvent,
  deleteEvent,
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
