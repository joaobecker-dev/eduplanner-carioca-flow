
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
 * @param teachingPlanForm 
 * @returns Promise<TeachingPlan>
 */
export async function create(teachingPlanForm: TeachingPlanFormValues): Promise<TeachingPlan> {
  // Convert form data to database structure
  const teachingPlanData = {
    title: teachingPlanForm.title,
    description: teachingPlanForm.description,
    annual_plan_id: teachingPlanForm.annualPlanId,
    subject_id: teachingPlanForm.subjectId,
    start_date: teachingPlanForm.startDate.toISOString(),
    end_date: teachingPlanForm.endDate.toISOString(),
    objectives: Array.isArray(teachingPlanForm.objectives) ? teachingPlanForm.objectives : [],
    bncc_references: Array.isArray(teachingPlanForm.bnccReferences) ? teachingPlanForm.bnccReferences : [],
    contents: Array.isArray(teachingPlanForm.contents) ? teachingPlanForm.contents : [],
    methodology: teachingPlanForm.methodology,
    resources: Array.isArray(teachingPlanForm.resources) ? teachingPlanForm.resources : [],
    evaluation: teachingPlanForm.evaluation
  };
  
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
 * @param teachingPlanForm 
 * @returns Promise<TeachingPlan>
 */
export async function update(id: string, teachingPlanForm: Partial<TeachingPlanFormValues>): Promise<TeachingPlan> {
  // Build the update data object
  const updateData: Record<string, any> = {};
  
  if (teachingPlanForm.title) updateData.title = teachingPlanForm.title;
  if (teachingPlanForm.description !== undefined) updateData.description = teachingPlanForm.description;
  if (teachingPlanForm.annualPlanId) updateData.annual_plan_id = teachingPlanForm.annualPlanId;
  if (teachingPlanForm.subjectId) updateData.subject_id = teachingPlanForm.subjectId;
  if (teachingPlanForm.startDate) updateData.start_date = teachingPlanForm.startDate.toISOString();
  if (teachingPlanForm.endDate) updateData.end_date = teachingPlanForm.endDate.toISOString();
  
  if (teachingPlanForm.objectives) updateData.objectives = Array.isArray(teachingPlanForm.objectives) ? 
    teachingPlanForm.objectives : [];
    
  if (teachingPlanForm.bnccReferences) updateData.bncc_references = Array.isArray(teachingPlanForm.bnccReferences) ? 
    teachingPlanForm.bnccReferences : [];
    
  if (teachingPlanForm.contents) updateData.contents = Array.isArray(teachingPlanForm.contents) ? 
    teachingPlanForm.contents : [];
    
  if (teachingPlanForm.methodology) updateData.methodology = teachingPlanForm.methodology;
  
  if (teachingPlanForm.resources) updateData.resources = Array.isArray(teachingPlanForm.resources) ? 
    teachingPlanForm.resources : [];
    
  if (teachingPlanForm.evaluation) updateData.evaluation = teachingPlanForm.evaluation;
  
  const { data, error } = await supabase
    .from(tableName)
    .update(updateData)
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
