
import { supabase } from "@/integrations/supabase/client";
import { AnnualPlan } from "@/types";
import { mapToCamelCase } from "@/integrations/supabase/supabaseAdapter";
import { AnnualPlanFormValues } from "@/components/forms/AnnualPlanForm";

const tableName = 'annual_plans';

/**
 * Get all annual plans
 * @returns Promise<AnnualPlan[]>
 */
export async function getAll(): Promise<AnnualPlan[]> {
  const { data, error } = await supabase
    .from(tableName)
    .select('*');
  
  if (error) throw error;
  return data.map(item => mapToCamelCase<AnnualPlan>(item));
}

/**
 * Get an annual plan by id
 * @param id 
 * @returns Promise<AnnualPlan>
 */
export async function getById(id: string): Promise<AnnualPlan> {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return mapToCamelCase<AnnualPlan>(data);
}

/**
 * Create a new annual plan
 * @param annualPlan 
 * @returns Promise<AnnualPlan>
 */
export async function create(annualPlan: AnnualPlanFormValues): Promise<AnnualPlan> {
  // Directly construct the object with snake_case keys
  const annualPlanData = {
    title: annualPlan.title,
    description: annualPlan.description,
    academic_period_id: annualPlan.academicPeriodId,
    subject_id: annualPlan.subjectId,
    objectives: Array.isArray(annualPlan.objectives) ? annualPlan.objectives : [],
    general_content: annualPlan.generalContent,
    methodology: annualPlan.methodology,
    evaluation: annualPlan.evaluation,
    references_materials: Array.isArray(annualPlan.referenceMaterials) ? annualPlan.referenceMaterials : []
  };
  
  const { data, error } = await supabase
    .from(tableName)
    .insert(annualPlanData)
    .select()
    .single();
  
  if (error) throw error;
  return mapToCamelCase<AnnualPlan>(data);
}

/**
 * Update an annual plan
 * @param id 
 * @param annualPlan 
 * @returns Promise<AnnualPlan>
 */
export async function update(id: string, annualPlan: Partial<AnnualPlanFormValues>): Promise<AnnualPlan> {
  // Directly construct the update object with snake_case keys
  const updateData: Record<string, any> = {};
  
  if (annualPlan.title !== undefined) updateData.title = annualPlan.title;
  if (annualPlan.description !== undefined) updateData.description = annualPlan.description;
  if (annualPlan.academicPeriodId !== undefined) updateData.academic_period_id = annualPlan.academicPeriodId;
  if (annualPlan.subjectId !== undefined) updateData.subject_id = annualPlan.subjectId;
  if (annualPlan.objectives !== undefined) {
    updateData.objectives = Array.isArray(annualPlan.objectives) ? annualPlan.objectives : [];
  }
  if (annualPlan.generalContent !== undefined) updateData.general_content = annualPlan.generalContent;
  if (annualPlan.methodology !== undefined) updateData.methodology = annualPlan.methodology;
  if (annualPlan.evaluation !== undefined) updateData.evaluation = annualPlan.evaluation;
  if (annualPlan.referenceMaterials !== undefined) {
    updateData.references_materials = Array.isArray(annualPlan.referenceMaterials) ? 
      annualPlan.referenceMaterials : [];
  }
  
  const { data, error } = await supabase
    .from(tableName)
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return mapToCamelCase<AnnualPlan>(data);
}

/**
 * Delete an annual plan
 * @param id 
 * @returns Promise<void>
 */
export async function deleteAnnualPlan(id: string): Promise<void> {
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export const annualPlanService = {
  getAll,
  getById,
  create,
  update,
  delete: deleteAnnualPlan,
};
