
import { TeachingPlan, ID } from '@/types';
import { createService, handleError } from './baseService';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCase, mapToSnakeCase } from '@/integrations/supabase/supabaseAdapter';
import { calendarEventService } from './calendarEventService';

// Custom query functions specific to teaching plans
const teachingPlanSpecificQueries = {
  getByAnnualPlan: async (annualPlanId: ID): Promise<TeachingPlan[]> => {
    try {
      const { data, error } = await supabase
        .from("teaching_plans")
        .select('*')
        .eq('annual_plan_id', annualPlanId);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<TeachingPlan>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar planos de ensino por plano anual');
      return [];
    }
  },
  
  getBySubject: async (subjectId: ID): Promise<TeachingPlan[]> => {
    try {
      const { data, error } = await supabase
        .from("teaching_plans")
        .select('*')
        .eq('subject_id', subjectId);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<TeachingPlan>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar planos de ensino por disciplina');
      return [];
    }
  },
  
  // Override the create method to add calendar event sync
  create: async (teachingPlanData: Omit<TeachingPlan, 'id' | 'created_at'>): Promise<TeachingPlan | null> => {
    try {
      // Ensure we have all required fields and proper types
      const processedData = mapToSnakeCase({
        title: teachingPlanData.title,
        description: teachingPlanData.description || null,
        annual_plan_id: teachingPlanData.annualPlanId || teachingPlanData.annual_plan_id,
        subject_id: teachingPlanData.subjectId || teachingPlanData.subject_id,
        start_date: teachingPlanData.startDate instanceof Date ? 
                   teachingPlanData.startDate.toISOString() : teachingPlanData.startDate || teachingPlanData.start_date,
        end_date: teachingPlanData.endDate instanceof Date ? 
                 teachingPlanData.endDate.toISOString() : teachingPlanData.endDate || teachingPlanData.end_date,
        objectives: Array.isArray(teachingPlanData.objectives) ? teachingPlanData.objectives : [],
        bncc_references: Array.isArray(teachingPlanData.bnccReferences || teachingPlanData.bncc_references) ? 
                         (teachingPlanData.bnccReferences || teachingPlanData.bncc_references) : [],
        contents: Array.isArray(teachingPlanData.contents) ? teachingPlanData.contents : [],
        methodology: teachingPlanData.methodology,
        resources: Array.isArray(teachingPlanData.resources) ? teachingPlanData.resources : [],
        evaluation: teachingPlanData.evaluation
      });
      
      const { data, error } = await supabase
        .from("teaching_plans")
        .insert(processedData)
        .select()
        .single();
      
      if (error) throw error;
      
      const newTeachingPlan = data ? mapToCamelCase<TeachingPlan>(data) : null;
      
      // Sync with calendar
      if (newTeachingPlan) {
        try {
          await calendarEventService.syncFromTeachingPlan(newTeachingPlan);
        } catch (syncError) {
          console.error('Error syncing to calendar:', syncError);
          // Don't let sync errors prevent teaching plan creation
        }
      }
      
      return newTeachingPlan;
    } catch (error) {
      handleError(error, 'criar plano de ensino');
      return null;
    }
  },
  
  // Override the update method to add calendar event sync
  update: async (id: ID, updates: Partial<TeachingPlan>): Promise<TeachingPlan | null> => {
    try {
      const updateData: Record<string, any> = {};
      
      // Only include fields that are present in the updates
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.annualPlanId !== undefined || updates.annual_plan_id !== undefined)
        updateData.annual_plan_id = updates.annualPlanId || updates.annual_plan_id;
      if (updates.subjectId !== undefined || updates.subject_id !== undefined)
        updateData.subject_id = updates.subjectId || updates.subject_id;
      
      // Handle dates - convert Date objects to ISO strings
      if (updates.startDate !== undefined || updates.start_date !== undefined) {
        const startDate = updates.startDate || updates.start_date;
        updateData.start_date = startDate instanceof Date ? startDate.toISOString() : startDate;
      }
      
      if (updates.endDate !== undefined || updates.end_date !== undefined) {
        const endDate = updates.endDate || updates.end_date;
        updateData.end_date = endDate instanceof Date ? endDate.toISOString() : endDate;
      }
      
      // Handle arrays properly
      if (updates.objectives !== undefined) 
        updateData.objectives = Array.isArray(updates.objectives) ? updates.objectives : [];
      
      if (updates.bnccReferences !== undefined || updates.bncc_references !== undefined)
        updateData.bncc_references = Array.isArray(updates.bnccReferences || updates.bncc_references) ? 
                                     (updates.bnccReferences || updates.bncc_references) : [];
      
      if (updates.contents !== undefined)
        updateData.contents = Array.isArray(updates.contents) ? updates.contents : [];
      
      if (updates.methodology !== undefined) updateData.methodology = updates.methodology;
      
      if (updates.resources !== undefined)
        updateData.resources = Array.isArray(updates.resources) ? updates.resources : [];
      
      if (updates.evaluation !== undefined) updateData.evaluation = updates.evaluation;
      
      const processedData = mapToSnakeCase(updateData);
      
      const { data, error } = await supabase
        .from("teaching_plans")
        .update(processedData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      const updatedTeachingPlan = data ? mapToCamelCase<TeachingPlan>(data) : null;
      
      // Sync with calendar
      if (updatedTeachingPlan) {
        try {
          await calendarEventService.syncFromTeachingPlan(updatedTeachingPlan);
        } catch (syncError) {
          console.error('Error syncing to calendar:', syncError);
          // Don't let sync errors prevent teaching plan update
        }
      }
      
      return updatedTeachingPlan;
    } catch (error) {
      handleError(error, 'atualizar plano de ensino');
      return null;
    }
  }
};

// Combine base service with teaching plan-specific queries
export const teachingPlanService = {
  ...createService<TeachingPlan>("teaching_plans"),
  ...teachingPlanSpecificQueries
};
