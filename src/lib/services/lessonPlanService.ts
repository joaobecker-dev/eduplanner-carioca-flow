import { LessonPlan, ID } from '@/types';
import { createService } from './baseService';
import { calendarEventService } from './calendar';

// LessonPlan Service
export const lessonPlanService = {
  ...createService<LessonPlan>("lesson_plans"),
  
  // Add the syncWithCalendar method
  syncWithCalendar: async (lessonPlanId: string): Promise<void> => {
    try {
      const lessonPlan = await lessonPlanService.getById(lessonPlanId);
      if (!lessonPlan) return;
      
      await calendarEventService.syncFromLessonPlan(lessonPlan);
    } catch (error) {
      console.error('Error syncing lesson plan with calendar:', error);
    }
  }
};
