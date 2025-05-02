
import { supabase } from "@/integrations/supabase/client";
import { Assessment, ID } from '@/types';
import { mapToCamelCase, mapToSnakeCase, normalizeToISO } from "@/integrations/supabase/supabaseAdapter";
import { calendarEventService } from "./calendarEventService";

const tableName = 'assessments';

/**
 * Get all assessments
 * @returns Promise<Assessment[]>
 */
export async function getAll(): Promise<Assessment[]> {
  const { data, error } = await supabase
    .from(tableName)
    .select('*');
  
  if (error) throw error;
  return data.map(item => mapToCamelCase<Assessment>(item));
}

/**
 * Get an assessment by id
 * @param id 
 * @returns Promise<Assessment>
 */
export async function getById(id: ID): Promise<Assessment> {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return mapToCamelCase<Assessment>(data);
}

/**
 * Get all assessments for a specific subject
 * @param subjectId 
 * @returns Promise<Assessment[]>
 */
export async function getBySubject(subjectId: ID): Promise<Assessment[]> {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('subject_id', subjectId);
  
  if (error) throw error;
  return data.map(item => mapToCamelCase<Assessment>(item));
}

/**
 * Get all assessments for a specific teaching plan
 * @param teachingPlanId 
 * @returns Promise<Assessment[]>
 */
export async function getByTeachingPlan(teachingPlanId: ID): Promise<Assessment[]> {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('teaching_plan_id', teachingPlanId);
  
  if (error) throw error;
  return data.map(item => mapToCamelCase<Assessment>(item));
}

/**
 * Create a new assessment
 * @param assessment 
 * @returns Promise<Assessment>
 */
export async function create(assessment: Omit<Assessment, "id">): Promise<Assessment> {
  // Instead of using mapToSnakeCase, create a properly typed object
  const assessmentData = {
    title: assessment.title,
    description: assessment.description,
    subject_id: assessment.subjectId,
    teaching_plan_id: assessment.teachingPlanId,
    type: assessment.type,
    total_points: assessment.totalPoints,
    date: normalizeToISO(assessment.date),
    due_date: normalizeToISO(assessment.dueDate)
  };
  
  // Ensure required fields
  if (!assessmentData.title || !assessmentData.type || !assessmentData.date || 
      !assessmentData.subject_id || assessmentData.total_points === undefined) {
    throw new Error("Missing required fields for assessment");
  }

  const { data, error } = await supabase
    .from(tableName)
    .insert(assessmentData)
    .select()
    .single();
  
  if (error) throw error;

  const createdAssessment = mapToCamelCase<Assessment>(data);
  await calendarEventService.syncFromAssessment(createdAssessment);

  return createdAssessment;
}

/**
 * Update an assessment
 * @param id 
 * @param assessment 
 * @returns Promise<Assessment>
 */
export async function update(id: ID, assessment: Partial<Assessment>): Promise<Assessment> {
  // Create a properly typed update object instead of using mapToSnakeCase
  const updateData: Record<string, any> = {};
  
  if (assessment.title !== undefined) updateData.title = assessment.title;
  if (assessment.description !== undefined) updateData.description = assessment.description;
  if (assessment.subjectId !== undefined) updateData.subject_id = assessment.subjectId;
  if (assessment.teachingPlanId !== undefined) updateData.teaching_plan_id = assessment.teachingPlanId;
  if (assessment.type !== undefined) updateData.type = assessment.type;
  if (assessment.totalPoints !== undefined) updateData.total_points = assessment.totalPoints;
  if (assessment.date !== undefined) updateData.date = normalizeToISO(assessment.date);
  if (assessment.dueDate !== undefined) updateData.due_date = normalizeToISO(assessment.dueDate);

  const { data, error } = await supabase
    .from(tableName)
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  const updatedAssessment = mapToCamelCase<Assessment>(data);
  await calendarEventService.syncFromAssessment(updatedAssessment);

  return updatedAssessment;
}

/**
 * Delete an assessment
 * @param id 
 * @returns Promise<void>
 */
export async function deleteAssessment(id: ID): Promise<void> {
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export const assessmentService = {
  getAll,
  getById,
  getBySubject,
  getByTeachingPlan,
  create,
  update,
  delete: deleteAssessment,
};
