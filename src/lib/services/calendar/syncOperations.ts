import { Assessment, CalendarEvent, LessonPlan, TeachingPlan } from '@/types';
import { handleError } from '../baseService';
import { getCalendarEventsBySource } from './queryOperations';
import { createEvent as createCalendarEvent, updateEvent as updateCalendarEvent, deleteBySource } from './basicOperations';

// Function to synchronize an assessment with calendar events
export const syncFromAssessment = async (assessmentOrId: Assessment | string): Promise<void> => {
  try {
    let assessment: Assessment;
    
    // If we received an ID, fetch the assessment
    if (typeof assessmentOrId === 'string') {
      // We would need to import the assessment service, but to avoid circular dependencies,
      // we'll assume the caller has already fetched the assessment
      throw new Error('Assessment ID provided instead of Assessment object. Please provide the full Assessment object.');
    } else {
      assessment = assessmentOrId;
    }
    
    // First, get any existing calendar events for this assessment
    const existingEvents = await getCalendarEventsBySource('assessment', assessment.id);
    
    // Create or update the main assessment event
    const eventData: Omit<CalendarEvent, 'id'> = {
      title: assessment.title,
      description: assessment.description,
      startDate: assessment.date,
      endDate: assessment.dueDate,
      allDay: true, // Assessments are typically all-day events
      type: 'exam', // Default type for assessments
      subjectId: assessment.subjectId,
      color: '#e11d48', // Red color for assessments
      location: '',
      sourceType: 'assessment',
      sourceId: assessment.id,
      created_at: new Date().toISOString()
    };
    
    if (existingEvents.length > 0) {
      // Update the existing event
      await updateCalendarEvent(existingEvents[0].id, eventData);
    } else {
      // Create a new event
      await createCalendarEvent(eventData);
    }
  } catch (error) {
    handleError(error, 'sincronizar avaliação com calendário');
  }
};

// Function to synchronize a lesson plan with calendar events
export const syncFromLessonPlan = async (lessonPlanOrId: LessonPlan | string): Promise<void> => {
  try {
    let lessonPlan: LessonPlan;
    
    // If we received an ID, fetch the lesson plan
    if (typeof lessonPlanOrId === 'string') {
      // We would need to import the lesson plan service, but to avoid circular dependencies,
      // we'll assume the caller has already fetched the lesson plan
      throw new Error('Lesson Plan ID provided instead of Lesson Plan object. Please provide the full Lesson Plan object.');
    } else {
      lessonPlan = lessonPlanOrId;
    }
    
    // First, get any existing calendar events for this lesson plan
    const existingEvents = await getCalendarEventsBySource('lesson_plan', lessonPlan.id);
    
    // Create or update the main lesson plan event
    const eventData: Omit<CalendarEvent, 'id'> = {
      title: lessonPlan.title,
      description: `Plano de Aula: ${lessonPlan.title}`,
      startDate: lessonPlan.date,
      endDate: lessonPlan.duration ? new Date(new Date(lessonPlan.date).getTime() + lessonPlan.duration * 60000).toISOString() : undefined,
      allDay: false,
      type: 'class',
      subjectId: '', // We don't have subject ID directly in lesson plan, would need to get from teaching plan
      color: '#3b82f6', // Blue color for classes
      location: '',
      sourceType: 'lesson_plan',
      sourceId: lessonPlan.id,
      created_at: new Date().toISOString()
    };
    
    if (existingEvents.length > 0) {
      // Update the existing event
      await updateCalendarEvent(existingEvents[0].id, eventData);
    } else {
      // Create a new event
      await createCalendarEvent(eventData);
    }
  } catch (error) {
    handleError(error, 'sincronizar plano de aula com calendário');
  }
};

// Function to synchronize a teaching plan with calendar events
export const syncFromTeachingPlan = async (teachingPlanOrId: TeachingPlan | string): Promise<void> => {
  try {
    let teachingPlan: TeachingPlan;
    
    // If we received an ID, fetch the teaching plan
    if (typeof teachingPlanOrId === 'string') {
      // We would need to import the teaching plan service, but to avoid circular dependencies,
      // we'll assume the caller has already fetched the teaching plan
      throw new Error('Teaching Plan ID provided instead of Teaching Plan object. Please provide the full Teaching Plan object.');
    } else {
      teachingPlan = teachingPlanOrId;
    }
    
    // First, get any existing calendar events for this teaching plan
    const existingEvents = await getCalendarEventsBySource('teaching_plan', teachingPlan.id);
    
    // Create or update the main teaching plan event
    const eventData: Omit<CalendarEvent, 'id'> = {
      title: teachingPlan.title,
      description: teachingPlan.description || `Plano de Ensino: ${teachingPlan.title}`,
      startDate: teachingPlan.startDate,
      endDate: teachingPlan.endDate,
      allDay: true, // Teaching plans typically span multiple days
      type: 'other',
      subjectId: teachingPlan.subjectId,
      color: '#8b5cf6', // Purple color for teaching plans
      location: '',
      sourceType: 'teaching_plan',
      sourceId: teachingPlan.id,
      created_at: new Date().toISOString()
    };
    
    if (existingEvents.length > 0) {
      // Update the existing event
      await updateCalendarEvent(existingEvents[0].id, eventData);
    } else {
      // Create a new event
      await createCalendarEvent(eventData);
    }
  } catch (error) {
    handleError(error, 'sincronizar plano de ensino com calendário');
  }
};
