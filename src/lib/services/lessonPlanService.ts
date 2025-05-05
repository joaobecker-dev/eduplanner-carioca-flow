
import { LessonPlan, ID } from '@/types';
import { createService } from './baseService';
import { calendarEventService } from './calendar';

// LessonPlan Service
export const lessonPlanService = {
  ...createService<LessonPlan>("lesson_plans"),
  
  // Add the syncWithCalendar method
  syncWithCalendar: async (lessonPlanId: string): Promise<void> => {
    try {
      // We pass the lessonPlanId directly to the syncFromLessonPlan function
      // which now accepts either an ID or a LessonPlan object
      await calendarEventService.syncFromLessonPlan(lessonPlanId);
    } catch (error) {
      console.error('Error syncing lesson plan with calendar:', error);
    }
  }
};
