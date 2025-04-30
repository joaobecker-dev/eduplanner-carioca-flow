
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

// Export all services in a single object for backward compatibility
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

// Also export each service individually for direct imports
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
