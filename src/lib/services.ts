
/**
 * Modern services module - Main entry point
 */

// Re-export all services directly from their source modules
export { academicPeriodService } from './services/academicPeriodService';
export { subjectService } from './services/subjectService';
export { annualPlanService } from './services/annualPlanService';
export { teachingPlanService } from './services/teachingPlanService';
export { lessonPlanService } from './services/lessonPlanService';
export { assessmentService } from './services/assessmentService';
export { studentService } from './services/studentService';
export { studentAssessmentService } from './services/studentAssessmentService';
export { materialService } from './services/materialService';
export { calendarEventService } from './services/calendarEventService';

// Legacy services object for backward compatibility
// Will be kept until all direct references are updated
export const services = {
  academicPeriod: academicPeriodService,
  subject: subjectService,
  annualPlan: annualPlanService,
  teachingPlan: teachingPlanService,
  lessonPlan: lessonPlanService,
  assessment: assessmentService,
  student: studentService,
  studentAssessment: studentAssessmentService,
  material: materialService,
  calendarEvent: calendarEventService
};
