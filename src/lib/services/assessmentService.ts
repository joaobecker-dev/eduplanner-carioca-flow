import { Assessment, ID } from '@/types';
import { createService } from './baseService';
import { calendarEventService } from './calendar';

// Assessment Service
export const assessmentService = {
  ...createService<Assessment>("assessments"),

  // Method to sync assessment with calendar
  syncWithCalendar: async (assessmentId: string): Promise<void> => {
    try {
      const assessment = await assessmentService.getById(assessmentId);
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
