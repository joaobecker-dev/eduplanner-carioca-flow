
import { supabase } from "@/integrations/supabase/client";
import { LessonPlan } from "@/types";
import { mapToCamelCase, mapToSnakeCase } from "@/integrations/supabase/supabaseAdapter";
import { LessonPlanFormValues } from "@/components/forms/LessonPlanForm";

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
 * @param lessonPlan 
 * @returns Promise<LessonPlan>
 */
export async function create(lessonPlan: LessonPlanFormValues): Promise<LessonPlan> {
  // Convert data to snake_case and ensure it meets the required structure
  const lessonPlanData = mapToSnakeCase<Record<string, any>>(lessonPlan);
  
  const { data, error } = await supabase
    .from(tableName)
    .insert(lessonPlanData)
    .select()
    .single();
  
  if (error) throw error;
  return mapToCamelCase<LessonPlan>(data);
}

/**
 * Update a lesson plan
 * @param id 
 * @param lessonPlan 
 * @returns Promise<LessonPlan>
 */
export async function update(id: string, lessonPlan: Partial<LessonPlanFormValues>): Promise<LessonPlan> {
  const lessonPlanData = mapToSnakeCase<Record<string, any>>(lessonPlan);
  
  const { data, error } = await supabase
    .from(tableName)
    .update(lessonPlanData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return mapToCamelCase<LessonPlan>(data);
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
