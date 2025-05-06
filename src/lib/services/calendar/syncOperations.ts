
import { Assessment, LessonPlan, TeachingPlan, EventType } from '@/types';
import { EventSourceType } from '@/types/database';
import { CalendarEventDatabaseFields } from './types';
import { getCalendarEventsBySource, deleteCalendarEventsBySource } from './queryOperations';
import { createCalendarEvent, updateCalendarEvent } from './basicOperations';
import { mapAssessmentFromDb, mapLessonPlanFromDb, mapTeachingPlanFromDb } from '@/lib/utils/dataMappers';
import { supabase } from '@/integrations/supabase/client';

// Helper to get the subject ID for a given teaching plan ID
const getSubjectIdForTeachingPlan = async (teachingPlanId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('teaching_plans')
      .select('subject_id')
      .eq('id', teachingPlanId)
      .single();
    
    if (error) throw error;
    return data?.subject_id || null;
  } catch (error) {
    console.error("Error getting subject ID for teaching plan:", error);
    return null;
  }
};

// Sync calendar events from an assessment
export const syncFromAssessment = async (assessmentOrId: Assessment | string): Promise<void> => {
  try {
    let assessment: Assessment | null = null;
    
    // If we have an ID, fetch the assessment
    if (typeof assessmentOrId === 'string') {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', assessmentOrId)
        .single();
        
      if (error) throw error;
      if (!data) return;
      
      // Convert to our frontend type
      assessment = mapAssessmentFromDb(data);
    } else {
      assessment = assessmentOrId;
    }
    
    // Get existing calendar events for this assessment
    const existingEvents = await getCalendarEventsBySource('assessment', assessment.id);
    
    // Basic assessment event data
    const eventData: CalendarEventDatabaseFields = {
      title: assessment.title,
      description: assessment.description,
      type: 'exam',
      start_date: assessment.date,
      subject_id: assessment.subjectId,
      source_type: 'assessment' as EventSourceType,
      source_id: assessment.id
    };
    
    // Add due date if present
    if (assessment.dueDate && assessment.dueDate !== assessment.date) {
      eventData.end_date = assessment.dueDate;
    }
    
    if (existingEvents.length === 0) {
      // Create new calendar event
      await createCalendarEvent(eventData);
    } else {
      // Update existing calendar event
      await updateCalendarEvent(existingEvents[0].id, eventData);
    }
  } catch (error) {
    console.error('Error syncing assessment to calendar:', error);
  }
};

// Sync calendar events from a lesson plan
export const syncFromLessonPlan = async (lessonPlanOrId: LessonPlan | string): Promise<void> => {
  try {
    let lessonPlan: LessonPlan | null = null;
    
    // If we have an ID, fetch the lesson plan
    if (typeof lessonPlanOrId === 'string') {
      const { data, error } = await supabase
        .from('lesson_plans')
        .select('*')
        .eq('id', lessonPlanOrId)
        .single();
        
      if (error) throw error;
      if (!data) return;
      
      // Convert to our frontend type
      lessonPlan = mapLessonPlanFromDb(data);
    } else {
      lessonPlan = lessonPlanOrId;
    }
    
    // Get existing calendar events for this lesson plan
    const existingEvents = await getCalendarEventsBySource('lesson_plan', lessonPlan.id);
    
    // Get the subject ID from the teaching plan
    const subjectId = await getSubjectIdForTeachingPlan(lessonPlan.teachingPlanId);
    
    // Calculate end time based on duration (in minutes)
    const startDate = new Date(lessonPlan.date);
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + (lessonPlan.duration || 0));
    
    // Basic lesson plan event data
    const eventData: CalendarEventDatabaseFields = {
      title: lessonPlan.title,
      description: lessonPlan.notes,
      type: 'class',
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      subject_id: subjectId || undefined,
      lesson_plan_id: lessonPlan.id,
      source_type: 'lesson_plan' as EventSourceType,
      source_id: lessonPlan.id
    };
    
    if (existingEvents.length === 0) {
      // Create new calendar event
      await createCalendarEvent(eventData);
    } else {
      // Update existing calendar event
      await updateCalendarEvent(existingEvents[0].id, eventData);
    }
  } catch (error) {
    console.error('Error syncing lesson plan to calendar:', error);
  }
};

// Sync calendar events from a teaching plan
export const syncFromTeachingPlan = async (teachingPlanOrId: TeachingPlan | string): Promise<void> => {
  try {
    let teachingPlan: TeachingPlan | null = null;
    
    // If we have an ID, fetch the teaching plan
    if (typeof teachingPlanOrId === 'string') {
      const { data, error } = await supabase
        .from('teaching_plans')
        .select('*')
        .eq('id', teachingPlanOrId)
        .single();
        
      if (error) throw error;
      if (!data) return;
      
      // Convert to our frontend type
      teachingPlan = mapTeachingPlanFromDb(data);
    } else {
      teachingPlan = teachingPlanOrId;
    }
    
    // Get existing calendar events for this teaching plan
    const existingEvents = await getCalendarEventsBySource('teaching_plan', teachingPlan.id);
    
    // Basic teaching plan event data
    const eventData: CalendarEventDatabaseFields = {
      title: `Período: ${teachingPlan.title}`,
      description: teachingPlan.description,
      type: 'other',
      start_date: teachingPlan.startDate,
      end_date: teachingPlan.endDate,
      all_day: true,
      subject_id: teachingPlan.subjectId,
      teaching_plan_id: teachingPlan.id,
      source_type: 'teaching_plan' as EventSourceType,
      source_id: teachingPlan.id
    };
    
    if (existingEvents.length === 0) {
      // Create new calendar event
      await createCalendarEvent(eventData);
    } else {
      // Update existing calendar event
      await updateCalendarEvent(existingEvents[0].id, eventData);
    }
  } catch (error) {
    console.error('Error syncing teaching plan to calendar:', error);
  }
};

// Delete all calendar events for a specific source
export const deleteCalendarEventsForSource = async (
  sourceType: EventSourceType,
  sourceId: string
): Promise<void> => {
  try {
    await deleteCalendarEventsBySource(sourceType, sourceId);
  } catch (error) {
    console.error(`Error deleting calendar events for ${sourceType} ${sourceId}:`, error);
  }
};
