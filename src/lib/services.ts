
/**
 * Modern services module - Main entry point
 */

// Import all services first before re-exporting them
import { academicPeriodService } from './services/academicPeriodService';
import { subjectService } from './services/subjectService';
import { annualPlanService } from './services/annualPlanService';
import { teachingPlanService } from './services/teachingPlanService';
import { lessonPlanService } from './services/lessonPlanService';
import { assessmentService } from './services/assessmentService';
import { studentService } from './services/studentService';
import { studentAssessmentService } from './services/studentAssessmentService';
import { materialService } from './services/materialService';
import { calendarEventService } from './services/calendar';

// Re-export all services directly from their source modules
export { 
  academicPeriodService,
  subjectService,
  annualPlanService,
  teachingPlanService,
  lessonPlanService,
  assessmentService,
  studentService,
  studentAssessmentService,
  materialService,
  calendarEventService
};

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
