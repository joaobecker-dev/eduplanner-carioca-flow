/**
 * Service exports for direct imports.
 * 
 * Use individual service imports for new code (e.g., `import { calendarEventService } from '@/lib/services'`).
 * The `services` object below is maintained for backward compatibility and will be removed in future releases.
 * Avoid using `services.<serviceName>` in new code to prevent dependency on legacy structure.
 */
import { academicPeriodService } from './academicPeriodService';
import { subjectService } from './subjectService';
import { annualPlanService } from './annualPlanService';
import { teachingPlanService } from './teachingPlanService';
import { lessonPlanService } from './lessonPlanService';
import { assessmentService } from './assessmentService';
import { studentService } from './studentService';
import { studentAssessmentService } from './studentAssessmentService';
import { calendarEventService } from './calendarEventService';
import { materialService } from './materialService';

// Export all services individually for direct imports
export {
  academicPeriodService,
  subjectService,
  annualPlanService,
  teachingPlanService,
  lessonPlanService,
  assessmentService,
  studentService,
  studentAssessmentService,
  calendarEventService,
  materialService
};

/**
 * Legacy service object for backward compatibility.
 * This will be removed in future releases. Prefer direct imports above.
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
  calendarEvent: calendarEventService,
  material: materialService
};
