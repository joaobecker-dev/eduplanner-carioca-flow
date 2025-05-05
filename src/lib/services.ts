
/**
 * Modern services module
 * 
 * This file is maintained for backward compatibility and will be deprecated in future releases.
 * Prefer direct imports from '@/lib/services/<serviceName>' in new code.
 */

// Import services directly from their modular files
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

// Re-export all services individually
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

/**
 * @deprecated Use individual service imports instead.
 * Example: `import { subjectService } from '@/lib/services'`
 */
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
