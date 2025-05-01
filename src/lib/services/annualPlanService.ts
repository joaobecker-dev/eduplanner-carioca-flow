
import { supabase } from "@/integrations/supabase/client";
import { AnnualPlan } from "@/types";
import { mapToCamelCase, mapToSnakeCase } from "@/integrations/supabase/supabaseAdapter";
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
  const annualPlanData = mapToSnakeCase<Record<string, any>>(annualPlan);
  
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
  const annualPlanData = mapToSnakeCase<Record<string, any>>(annualPlan);
  
  const { data, error } = await supabase
    .from(tableName)
    .update(annualPlanData)
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
