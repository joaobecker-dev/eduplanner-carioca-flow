
import { Assessment, ID } from '@/types';
import { createService } from './baseService';
import { calendarEventService } from './calendar';
import { supabase } from '@/integrations/supabase/client';
import { mapToCamelCase } from '@/integrations/supabase/supabaseAdapter';

// Basic CRUD service from createService
const baseService = createService<Assessment>("assessments");

// Assessment Service
export const assessmentService = {
  ...baseService,

  // Method to get assessments by subject ID
  getBySubject: async (subjectId: string): Promise<Assessment[]> => {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('subject_id', subjectId);
        
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<Assessment>(item)) : [];
    } catch (error) {
      console.error('Error fetching assessments by subject:', error);
      return [];
    }
  },

  // Method to sync assessment with calendar
  syncWithCalendar: async (assessmentId: string): Promise<void> => {
    try {
      const assessment = await baseService.getById(assessmentId);
      if (assessment) {
        await calendarEventService.syncFromAssessment(assessment);
      } else {
        console.warn(`Assessment with ID ${assessmentId} not found.`);
      }
    } catch (error) {
      console.error('Error syncing assessment with calendar:', error);
    }
  },
};
