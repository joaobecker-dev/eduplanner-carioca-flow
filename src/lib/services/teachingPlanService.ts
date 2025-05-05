
import { supabase } from "@/integrations/supabase/client";
import { TeachingPlan } from "@/types";
import { mapToCamelCase, normalizeToISO } from "@/integrations/supabase/supabaseAdapter";
import { TeachingPlanFormValues } from "@/components/forms/TeachingPlanForm";
import { calendarEventService } from "./calendar";

const tableName = 'teaching_plans';

export async function getAll(): Promise<TeachingPlan[]> {
  const { data, error } = await supabase
    .from(tableName)
    .select('*');

  if (error) throw error;
  return data.map(item => mapToCamelCase<TeachingPlan>(item));
}

export async function getById(id: string): Promise<TeachingPlan> {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return mapToCamelCase<TeachingPlan>(data);
}

export async function create(teachingPlanForm: Partial<TeachingPlanFormValues>): Promise<TeachingPlan> {
  const teachingPlanData = {
    title: teachingPlanForm.title,
    description: teachingPlanForm.description || null,
    annual_plan_id: teachingPlanForm.annualPlanId,
    subject_id: teachingPlanForm.subjectId,
    start_date: teachingPlanForm.startDate ? normalizeToISO(teachingPlanForm.startDate) : null,
    end_date: teachingPlanForm.endDate ? normalizeToISO(teachingPlanForm.endDate) : null,
    objectives: Array.isArray(teachingPlanForm.objectives) ? teachingPlanForm.objectives : [],
    bncc_references: Array.isArray(teachingPlanForm.bnccReferences) ? teachingPlanForm.bnccReferences : [],
    contents: Array.isArray(teachingPlanForm.contents) ? teachingPlanForm.contents : [],
    methodology: teachingPlanForm.methodology || '',
    resources: Array.isArray(teachingPlanForm.resources) ? teachingPlanForm.resources : [],
    evaluation: teachingPlanForm.evaluation || ''
  };

  const { data, error } = await supabase
    .from(tableName)
    .insert(teachingPlanData)
    .select()
    .single();

  if (error) throw error;

  const createdTeachingPlan = mapToCamelCase<TeachingPlan>(data);
  await calendarEventService.syncFromTeachingPlan(createdTeachingPlan);

  return createdTeachingPlan;
}

export async function update(id: string, teachingPlanForm: Partial<TeachingPlanFormValues>): Promise<TeachingPlan> {
  const updateData: Record<string, any> = {};

  if (teachingPlanForm.title !== undefined) updateData.title = teachingPlanForm.title;
  if (teachingPlanForm.description !== undefined) updateData.description = teachingPlanForm.description;
  if (teachingPlanForm.annualPlanId !== undefined) updateData.annual_plan_id = teachingPlanForm.annualPlanId;
  if (teachingPlanForm.subjectId !== undefined) updateData.subject_id = teachingPlanForm.subjectId;
  
  if (teachingPlanForm.startDate !== undefined) {
    updateData.start_date = normalizeToISO(teachingPlanForm.startDate);
  }
  
  if (teachingPlanForm.endDate !== undefined) {
    updateData.end_date = normalizeToISO(teachingPlanForm.endDate);
  }
  
  if (teachingPlanForm.objectives !== undefined)
    updateData.objectives = Array.isArray(teachingPlanForm.objectives) ? teachingPlanForm.objectives : [];
  if (teachingPlanForm.bnccReferences !== undefined)
    updateData.bncc_references = Array.isArray(teachingPlanForm.bnccReferences) ? teachingPlanForm.bnccReferences : [];
  if (teachingPlanForm.contents !== undefined)
    updateData.contents = Array.isArray(teachingPlanForm.contents) ? teachingPlanForm.contents : [];
  if (teachingPlanForm.methodology !== undefined) updateData.methodology = teachingPlanForm.methodology;
  if (teachingPlanForm.resources !== undefined)
    updateData.resources = Array.isArray(teachingPlanForm.resources) ? teachingPlanForm.resources : [];
  if (teachingPlanForm.evaluation !== undefined) updateData.evaluation = teachingPlanForm.evaluation;

  const { data, error } = await supabase
    .from(tableName)
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  const updatedTeachingPlan = mapToCamelCase<TeachingPlan>(data);
  await calendarEventService.syncFromTeachingPlan(updatedTeachingPlan);

  return updatedTeachingPlan;
}

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
