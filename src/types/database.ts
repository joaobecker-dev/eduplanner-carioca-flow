
import { Database } from '@/integrations/supabase/types';

// Export convenient type aliases from the auto-generated types
export type Tables = Database['public']['Tables'];

// Table row types
export type AcademicPeriodRow = Tables['academic_periods']['Row'];
export type AnnualPlanRow = Tables['annual_plans']['Row'];
export type AssessmentRow = Tables['assessments']['Row'];
export type CalendarEventRow = Tables['calendar_events']['Row'];
export type LessonPlanRow = Tables['lesson_plans']['Row'];
export type MaterialRow = Tables['materials']['Row'];
export type StudentAssessmentRow = Tables['student_assessments']['Row'];
export type StudentRow = Tables['students']['Row'];
export type SubjectRow = Tables['subjects']['Row'];
export type TeachingPlanRow = Tables['teaching_plans']['Row'];

// Enum types
export type EventType = Database['public']['Enums']['event_type'];
export type AssessmentType = Database['public']['Enums']['assessment_type'];
export type MaterialType = Database['public']['Enums']['material_type'];

// Convenient type for source types in calendar events
export type EventSourceType = 'assessment' | 'lesson_plan' | 'teaching_plan' | 'manual';
