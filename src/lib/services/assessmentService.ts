
import { supabase } from "@/integrations/supabase/client";
import { Assessment, ID } from '@/types';
import { mapToCamelCase, mapToSnakeCase } from "@/integrations/supabase/supabaseAdapter";
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
  // Convert form data to database structure with snake_case
  const assessmentData = mapToSnakeCase<any>(assessment);
  
  // Ensure date formats are ISO strings
  if (assessment.date) {
    if (typeof assessment.date === 'object' && 'toISOString' in assessment.date) {
      assessmentData.date = assessment.date.toISOString();
    }
  }
  
  if (assessment.dueDate) {
    if (typeof assessment.dueDate === 'object' && 'toISOString' in assessment.dueDate) {
      assessmentData.due_date = assessment.dueDate.toISOString();
    }
  }
  
  const { data, error } = await supabase
    .from(tableName)
    .insert(assessmentData)
    .select()
    .single();
  
  if (error) throw error;
  
  const createdAssessment = mapToCamelCase<Assessment>(data);
  
  // Sync with calendar events
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
  // Convert form data to database structure with snake_case
  const assessmentData = mapToSnakeCase<any>(assessment);
  
  // Ensure date formats are ISO strings
  if (assessment.date) {
    if (typeof assessment.date === 'object' && 'toISOString' in assessment.date) {
      assessmentData.date = assessment.date.toISOString();
    }
  }
  
  if (assessment.dueDate) {
    if (typeof assessment.dueDate === 'object' && 'toISOString' in assessment.dueDate) {
      assessmentData.due_date = assessment.dueDate.toISOString();
    }
  }
  
  const { data, error } = await supabase
    .from(tableName)
    .update(assessmentData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  const updatedAssessment = mapToCamelCase<Assessment>(data);
  
  // Sync with calendar events
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
