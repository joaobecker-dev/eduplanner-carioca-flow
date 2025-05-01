
import { supabase } from "@/integrations/supabase/client";
import { TeachingPlan } from "@/types";
import { mapToCamelCase, mapToSnakeCase } from "@/integrations/supabase/supabaseAdapter";
import { TeachingPlanFormValues } from "@/components/forms/TeachingPlanForm";

const tableName = 'teaching_plans';

/**
 * Get all teaching plans
 * @returns Promise<TeachingPlan[]>
 */
export async function getAll(): Promise<TeachingPlan[]> {
  const { data, error } = await supabase
    .from(tableName)
    .select('*');
  
  if (error) throw error;
  return data.map(item => mapToCamelCase<TeachingPlan>(item));
}

/**
 * Get a teaching plan by id
 * @param id 
 * @returns Promise<TeachingPlan>
 */
export async function getById(id: string): Promise<TeachingPlan> {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return mapToCamelCase<TeachingPlan>(data);
}

/**
 * Create a new teaching plan
 * @param teachingPlan 
 * @returns Promise<TeachingPlan>
 */
export async function create(teachingPlan: TeachingPlanFormValues): Promise<TeachingPlan> {
  const teachingPlanData = mapToSnakeCase<Record<string, any>>(teachingPlan);
  
  const { data, error } = await supabase
    .from(tableName)
    .insert(teachingPlanData)
    .select()
    .single();
  
  if (error) throw error;
  return mapToCamelCase<TeachingPlan>(data);
}

/**
 * Update a teaching plan
 * @param id 
 * @param teachingPlan 
 * @returns Promise<TeachingPlan>
 */
export async function update(id: string, teachingPlan: Partial<TeachingPlanFormValues>): Promise<TeachingPlan> {
  const teachingPlanData = mapToSnakeCase<Record<string, any>>(teachingPlan);
  
  const { data, error } = await supabase
    .from(tableName)
    .update(teachingPlanData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return mapToCamelCase<TeachingPlan>(data);
}

/**
 * Delete a teaching plan
 * @param id 
 * @returns Promise<void>
 */
export async function deleteTeachingPlan(id: string): Promise<void> {
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export const teachingPlanService = {
  getAll,
  getById,
  create,
  update,
  delete: deleteTeachingPlan,
};
