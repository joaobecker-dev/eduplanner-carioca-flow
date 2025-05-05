
import { supabase } from "@/integrations/supabase/client";
import { LessonPlan } from "@/types";
import { mapToCamelCase, normalizeToISO } from "@/integrations/supabase/supabaseAdapter";
import { LessonPlanFormValues } from "@/components/forms/LessonPlanForm";
import { calendarEventService } from "./calendar";

const tableName = 'lesson_plans';

/**
 * Get all lesson plans
 * @returns Promise<LessonPlan[]>
 */
export async function getAll(): Promise<LessonPlan[]> {
  const { data, error } = await supabase
    .from(tableName)
    .select('*');
  
  if (error) throw error;
  return data.map(item => mapToCamelCase<LessonPlan>(item));
}

/**
 * Get a lesson plan by id
 * @param id 
 * @returns Promise<LessonPlan>
 */
export async function getById(id: string): Promise<LessonPlan> {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return mapToCamelCase<LessonPlan>(data);
}

/**
 * Create a new lesson plan
 * @param lessonPlanForm Form values from the lesson plan form
 * @returns Promise<LessonPlan>
 */
export async function create(lessonPlanForm: Partial<LessonPlanFormValues>): Promise<LessonPlan> {
  // Convert form values to proper DB structure
  const lessonPlanData = {
    title: lessonPlanForm.title,
    teaching_plan_id: lessonPlanForm.teachingPlanId,
    date: lessonPlanForm.date ? normalizeToISO(lessonPlanForm.date) : null,
    duration: lessonPlanForm.duration,
    objectives: typeof lessonPlanForm.objectives === 'string' ? 
      lessonPlanForm.objectives.split('\n').filter(item => item.trim() !== '') : [],
    contents: typeof lessonPlanForm.contents === 'string' ? 
      lessonPlanForm.contents.split('\n').filter(item => item.trim() !== '') : [],
    activities: typeof lessonPlanForm.activities === 'string' ? 
      lessonPlanForm.activities.split('\n').filter(item => item.trim() !== '') : [],
    resources: typeof lessonPlanForm.resources === 'string' ? 
      lessonPlanForm.resources.split('\n').filter(item => item.trim() !== '') : [],
    homework: lessonPlanForm.homework,
    evaluation: lessonPlanForm.evaluation,
    notes: lessonPlanForm.notes
  };
  
  const { data, error } = await supabase
    .from(tableName)
    .insert(lessonPlanData)
    .select()
    .single();
  
  if (error) throw error;
  
  const createdLessonPlan = mapToCamelCase<LessonPlan>(data);
  
  // Sync with calendar events
  await calendarEventService.syncFromLessonPlan(createdLessonPlan);
  
  return createdLessonPlan;
}

/**
 * Update a lesson plan
 * @param id 
 * @param lessonPlanForm 
 * @returns Promise<LessonPlan>
 */
export async function update(id: string, lessonPlanForm: Partial<LessonPlanFormValues>): Promise<LessonPlan> {
  // Build update data object
  const updateData: Record<string, any> = {};
  
  if (lessonPlanForm.title !== undefined) updateData.title = lessonPlanForm.title;
  if (lessonPlanForm.teachingPlanId !== undefined) updateData.teaching_plan_id = lessonPlanForm.teachingPlanId;
  
  if (lessonPlanForm.date !== undefined) {
    updateData.date = normalizeToISO(lessonPlanForm.date);
  }
  
  if (lessonPlanForm.duration !== undefined) updateData.duration = lessonPlanForm.duration;
  
  // Handle field that might be string from form input
  if (lessonPlanForm.objectives !== undefined) {
    updateData.objectives = typeof lessonPlanForm.objectives === 'string' ? 
      lessonPlanForm.objectives.split('\n').filter(item => item.trim() !== '') : [];
  }
  
  if (lessonPlanForm.contents !== undefined) {
    updateData.contents = typeof lessonPlanForm.contents === 'string' ? 
      lessonPlanForm.contents.split('\n').filter(item => item.trim() !== '') : [];
  }
  
  if (lessonPlanForm.activities !== undefined) {
    updateData.activities = typeof lessonPlanForm.activities === 'string' ? 
      lessonPlanForm.activities.split('\n').filter(item => item.trim() !== '') : [];
  }
  
  if (lessonPlanForm.resources !== undefined) {
    updateData.resources = typeof lessonPlanForm.resources === 'string' ? 
      lessonPlanForm.resources.split('\n').filter(item => item.trim() !== '') : [];
  }
  
  // Optional string fields
  if (lessonPlanForm.homework !== undefined) updateData.homework = lessonPlanForm.homework;
  if (lessonPlanForm.evaluation !== undefined) updateData.evaluation = lessonPlanForm.evaluation;
  if (lessonPlanForm.notes !== undefined) updateData.notes = lessonPlanForm.notes;
  
  const { data, error } = await supabase
    .from(tableName)
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  const updatedLessonPlan = mapToCamelCase<LessonPlan>(data);
  
  // Sync with calendar events
  await calendarEventService.syncFromLessonPlan(updatedLessonPlan);
  
  return updatedLessonPlan;
}

/**
 * Delete a lesson plan
 * @param id 
 * @returns Promise<void>
 */
export async function deleteLesson(id: string): Promise<void> {
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export const lessonPlanService = {
  getAll,
  getById,
  create,
  update,
  delete: deleteLesson,
};
