
import { Assessment, ID } from '@/types';
import { createService, handleError } from './baseService';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCase, mapToSnakeCase } from '@/integrations/supabase/supabaseAdapter';
import { calendarEventService } from './calendarEventService';

// Custom query functions specific to assessments
const assessmentSpecificQueries = {
  getBySubject: async (subjectId: ID): Promise<Assessment[]> => {
    try {
      const { data, error } = await supabase
        .from("assessments")
        .select('*')
        .eq('subject_id', subjectId);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<Assessment>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar avaliações por disciplina');
      return [];
    }
  },
  
  getByTeachingPlan: async (teachingPlanId: ID): Promise<Assessment[]> => {
    try {
      const { data, error } = await supabase
        .from("assessments")
        .select('*')
        .eq('teaching_plan_id', teachingPlanId);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<Assessment>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar avaliações por plano de ensino');
      return [];
    }
  },
  
  // Override the create method to add calendar event sync
  create: async (assessmentData: Omit<Assessment, 'id' | 'created_at'>): Promise<Assessment | null> => {
    try {
      // Ensure proper types for all fields
      const processedData = mapToSnakeCase({
        title: assessmentData.title,
        description: assessmentData.description || null,
        subject_id: assessmentData.subjectId || assessmentData.subject_id,
        teaching_plan_id: assessmentData.teachingPlanId || assessmentData.teaching_plan_id || null,
        type: assessmentData.type,
        total_points: assessmentData.totalPoints || assessmentData.total_points,
        date: assessmentData.date instanceof Date ? assessmentData.date.toISOString() : assessmentData.date,
        due_date: assessmentData.dueDate instanceof Date ? 
                assessmentData.dueDate.toISOString() : 
                assessmentData.dueDate || assessmentData.due_date || null
      });
      
      const { data, error } = await supabase
        .from("assessments")
        .insert(processedData)
        .select()
        .single();
      
      if (error) throw error;
      
      const newAssessment = data ? mapToCamelCase<Assessment>(data) : null;
      
      // Sync with calendar
      if (newAssessment) {
        try {
          await calendarEventService.syncFromAssessment(newAssessment);
        } catch (syncError) {
          console.error('Error syncing to calendar:', syncError);
          // Don't let sync errors prevent assessment creation
        }
      }
      
      return newAssessment;
    } catch (error) {
      handleError(error, 'criar avaliação');
      return null;
    }
  },
  
  // Override the update method to add calendar event sync
  update: async (id: ID, updates: Partial<Assessment>): Promise<Assessment | null> => {
    try {
      const updateData: Record<string, any> = {};
      
      // Only include fields that are present in the updates
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.subjectId !== undefined || updates.subject_id !== undefined)
        updateData.subject_id = updates.subjectId || updates.subject_id;
      if (updates.teachingPlanId !== undefined || updates.teaching_plan_id !== undefined)
        updateData.teaching_plan_id = updates.teachingPlanId || updates.teaching_plan_id;
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.totalPoints !== undefined || updates.total_points !== undefined)
        updateData.total_points = updates.totalPoints || updates.total_points;
      
      // Handle date fields
      if (updates.date !== undefined) {
        updateData.date = updates.date instanceof Date ? updates.date.toISOString() : updates.date;
      }
      
      if (updates.dueDate !== undefined || updates.due_date !== undefined) {
        const dueDate = updates.dueDate || updates.due_date;
        updateData.due_date = dueDate instanceof Date ? dueDate.toISOString() : dueDate;
      }
      
      const processedData = mapToSnakeCase(updateData);
      
      const { data, error } = await supabase
        .from("assessments")
        .update(processedData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      const updatedAssessment = data ? mapToCamelCase<Assessment>(data) : null;
      
      // Sync with calendar
      if (updatedAssessment) {
        try {
          await calendarEventService.syncFromAssessment(updatedAssessment);
        } catch (syncError) {
          console.error('Error syncing to calendar:', syncError);
          // Don't let sync errors prevent assessment update
        }
      }
      
      return updatedAssessment;
    } catch (error) {
      handleError(error, 'atualizar avaliação');
      return null;
    }
  }
};

// Combine base service with assessment-specific queries
export const assessmentService = {
  ...createService<Assessment>("assessments"),
  ...assessmentSpecificQueries
};
