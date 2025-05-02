
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
  create: async (assessment: Omit<Assessment, 'id' | 'created_at'>): Promise<Assessment | null> => {
    try {
      const processedData = mapToSnakeCase(assessment);
      
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
      const processedData = mapToSnakeCase(updates);
      
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
