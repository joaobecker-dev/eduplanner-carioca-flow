
import {
  AnnualPlan,
  Assessment,
  CalendarEvent,
  LessonPlan,
  Material,
  Subject,
  TeachingPlan,
  StudentAssessment
} from '@/types';

import {
  AnnualPlanRow,
  AssessmentRow,
  CalendarEventRow,
  LessonPlanRow,
  MaterialRow,
  SubjectRow,
  TeachingPlanRow,
  StudentAssessmentRow
} from '@/types/database';

/**
 * Maps snake_case database fields to camelCase frontend fields for LessonPlan
 */
export function mapLessonPlanFromDb(row: LessonPlanRow): LessonPlan {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    duration: row.duration,
    objectives: row.objectives,
    contents: row.contents,
    activities: row.activities,
    resources: row.resources,
    notes: row.notes || undefined,
    evaluation: row.evaluation || undefined,
    homework: row.homework || undefined,
    teachingPlanId: row.teaching_plan_id,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

/**
 * Maps camelCase frontend fields to snake_case database fields for LessonPlan
 */
export function mapLessonPlanToDb(lessonPlan: Partial<LessonPlan>): Partial<Record<keyof LessonPlanRow, any>> {
  const result: Partial<Record<keyof LessonPlanRow, any>> = {};
  
  if (lessonPlan.id !== undefined) result.id = lessonPlan.id;
  if (lessonPlan.title !== undefined) result.title = lessonPlan.title;
  if (lessonPlan.date !== undefined) result.date = lessonPlan.date;
  if (lessonPlan.duration !== undefined) result.duration = lessonPlan.duration;
  if (lessonPlan.objectives !== undefined) result.objectives = lessonPlan.objectives;
  if (lessonPlan.contents !== undefined) result.contents = lessonPlan.contents;
  if (lessonPlan.activities !== undefined) result.activities = lessonPlan.activities;
  if (lessonPlan.resources !== undefined) result.resources = lessonPlan.resources;
  if (lessonPlan.notes !== undefined) result.notes = lessonPlan.notes;
  if (lessonPlan.evaluation !== undefined) result.evaluation = lessonPlan.evaluation;
  if (lessonPlan.homework !== undefined) result.homework = lessonPlan.homework;
  if (lessonPlan.teachingPlanId !== undefined) result.teaching_plan_id = lessonPlan.teachingPlanId;
  
  return result;
}

/**
 * Maps snake_case database fields to camelCase frontend fields for Assessment
 */
export function mapAssessmentFromDb(row: AssessmentRow): Assessment {
  return {
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    type: row.type,
    totalPoints: row.total_points,
    date: row.date,
    dueDate: row.due_date || undefined,
    subjectId: row.subject_id,
    teachingPlanId: row.teaching_plan_id || undefined,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

/**
 * Maps camelCase frontend fields to snake_case database fields for Assessment
 */
export function mapAssessmentToDb(assessment: Partial<Assessment>): Partial<Record<keyof AssessmentRow, any>> {
  const result: Partial<Record<keyof AssessmentRow, any>> = {};
  
  if (assessment.id !== undefined) result.id = assessment.id;
  if (assessment.title !== undefined) result.title = assessment.title;
  if (assessment.description !== undefined) result.description = assessment.description;
  if (assessment.type !== undefined) result.type = assessment.type;
  if (assessment.totalPoints !== undefined) result.total_points = assessment.totalPoints;
  if (assessment.date !== undefined) result.date = assessment.date;
  if (assessment.dueDate !== undefined) result.due_date = assessment.dueDate;
  if (assessment.subjectId !== undefined) result.subject_id = assessment.subjectId;
  if (assessment.teachingPlanId !== undefined) result.teaching_plan_id = assessment.teachingPlanId;
  
  return result;
}

/**
 * Maps snake_case database fields to camelCase frontend fields for Material
 */
export function mapMaterialFromDb(row: MaterialRow): Material {
  return {
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    url: row.url || undefined,
    filePath: row.file_path || undefined,
    fileSize: row.file_size || undefined,
    type: row.type,
    tags: row.tags,
    subjectId: row.subject_id || undefined,
    thumbnailUrl: row.thumbnail_url || undefined,
    notes: row.notes || undefined,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

/**
 * Maps camelCase frontend fields to snake_case database fields for Material
 */
export function mapMaterialToDb(material: Partial<Material>): Partial<Record<keyof MaterialRow, any>> {
  const result: Partial<Record<keyof MaterialRow, any>> = {};
  
  if (material.id !== undefined) result.id = material.id;
  if (material.title !== undefined) result.title = material.title;
  if (material.description !== undefined) result.description = material.description;
  if (material.url !== undefined) result.url = material.url;
  if (material.filePath !== undefined) result.file_path = material.filePath;
  if (material.fileSize !== undefined) result.file_size = material.fileSize;
  if (material.type !== undefined) result.type = material.type;
  if (material.tags !== undefined) result.tags = material.tags;
  if (material.subjectId !== undefined) result.subject_id = material.subjectId;
  if (material.thumbnailUrl !== undefined) result.thumbnail_url = material.thumbnailUrl;
  if (material.notes !== undefined) result.notes = material.notes;
  
  return result;
}

/**
 * Maps snake_case database fields to camelCase frontend fields for CalendarEvent
 */
export function mapCalendarEventFromDb(row: CalendarEventRow): CalendarEvent {
  return {
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    startDate: row.start_date,
    endDate: row.end_date || undefined,
    allDay: row.all_day,
    type: row.type,
    subjectId: row.subject_id || undefined,
    lessonPlanId: row.lesson_plan_id || undefined,
    assessmentId: row.assessment_id || undefined,
    location: row.location || undefined,
    color: row.color || undefined,
    created_at: row.created_at,
    sourceType: row.source_type as EventSourceType || undefined,
    sourceId: row.source_id || undefined
  };
}

/**
 * Maps camelCase frontend fields to snake_case database fields for CalendarEvent
 */
export function mapCalendarEventToDb(event: Partial<CalendarEvent>): Partial<Record<keyof CalendarEventRow, any>> {
  const result: Partial<Record<keyof CalendarEventRow, any>> = {};
  
  if (event.id !== undefined) result.id = event.id;
  if (event.title !== undefined) result.title = event.title;
  if (event.description !== undefined) result.description = event.description;
  if (event.startDate !== undefined) result.start_date = event.startDate;
  if (event.endDate !== undefined) result.end_date = event.endDate;
  if (event.allDay !== undefined) result.all_day = event.allDay;
  if (event.type !== undefined) result.type = event.type;
  if (event.subjectId !== undefined) result.subject_id = event.subjectId;
  if (event.lessonPlanId !== undefined) result.lesson_plan_id = event.lessonPlanId;
  if (event.assessmentId !== undefined) result.assessment_id = event.assessmentId;
  if (event.location !== undefined) result.location = event.location;
  if (event.color !== undefined) result.color = event.color;
  if (event.sourceType !== undefined) result.source_type = event.sourceType;
  if (event.sourceId !== undefined) result.source_id = event.sourceId;
  
  return result;
}

/**
 * Maps snake_case database fields to camelCase frontend fields for StudentAssessment
 */
export function mapStudentAssessmentFromDb(row: StudentAssessmentRow): StudentAssessment {
  // Derive status from dates
  let status: 'pending' | 'submitted' | 'graded' = 'pending';
  if (row.graded_date) {
    status = 'graded';
  } else if (row.submitted_date) {
    status = 'submitted';
  }

  return {
    id: row.id,
    studentId: row.student_id,
    assessmentId: row.assessment_id,
    score: row.score || undefined,
    feedback: row.feedback || undefined,
    submittedDate: row.submitted_date || undefined,
    gradedDate: row.graded_date || undefined,
    status,
    created_at: row.created_at
  };
}

/**
 * Maps camelCase frontend fields to snake_case database fields for StudentAssessment
 */
export function mapStudentAssessmentToDb(assessment: Partial<StudentAssessment>): Partial<Record<keyof StudentAssessmentRow, any>> {
  const result: Partial<Record<keyof StudentAssessmentRow, any>> = {};
  
  if (assessment.id !== undefined) result.id = assessment.id;
  if (assessment.studentId !== undefined) result.student_id = assessment.studentId;
  if (assessment.assessmentId !== undefined) result.assessment_id = assessment.assessmentId;
  if (assessment.score !== undefined) result.score = assessment.score;
  if (assessment.feedback !== undefined) result.feedback = assessment.feedback;
  if (assessment.submittedDate !== undefined) result.submitted_date = assessment.submittedDate;
  if (assessment.gradedDate !== undefined) result.graded_date = assessment.gradedDate;
  
  return result;
}
