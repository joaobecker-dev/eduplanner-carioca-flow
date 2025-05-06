
import { 
  Assessment, 
  CalendarEvent, 
  LessonPlan, 
  Material, 
  StudentAssessment, 
  TeachingPlan
} from '@/types';
import { 
  MaterialRow,
  AssessmentRow,
  LessonPlanRow,
  TeachingPlanRow,
  StudentAssessmentRow,
  CalendarEventRow
} from '@/types/database';
import { mapToCamelCase as caseConverterToCamel, mapToCamelCaseDeep } from './caseConverters';

// Re-export the case converter functions
export { 
  mapToCamelCase,
  mapToCamelCaseDeep,
  mapArrayToCamelCase, 
  mapTypedEntity,
  mapToCamelCaseDeep as mapToSnakeCase  // Temporarily using this as a stand-in
} from './caseConverters';

// Helper function to safely convert null/undefined to undefined
const safeNull = <T>(value: T | null): T | undefined => {
  return value === null ? undefined : value;
};

// Material mappers
export const mapMaterialFromDb = (dbMaterial: MaterialRow): Material => ({
  id: dbMaterial.id,
  title: dbMaterial.title,
  description: safeNull(dbMaterial.description),
  type: dbMaterial.type,
  url: safeNull(dbMaterial.url),
  filePath: safeNull(dbMaterial.file_path),
  fileSize: safeNull(dbMaterial.file_size),
  thumbnailUrl: safeNull(dbMaterial.thumbnail_url),
  subjectId: safeNull(dbMaterial.subject_id),
  tags: dbMaterial.tags || [],
  created_at: dbMaterial.created_at,
  updated_at: dbMaterial.updated_at,
});

export const mapMaterialToDb = (material: Partial<Material>): Partial<MaterialRow> => {
  const result: Partial<MaterialRow> = {};
  
  if (material.id !== undefined) result.id = material.id;
  if (material.title !== undefined) result.title = material.title;
  if (material.description !== undefined) result.description = material.description;
  if (material.type !== undefined) result.type = material.type;
  if (material.url !== undefined) result.url = material.url;
  if (material.filePath !== undefined) result.file_path = material.filePath;
  if (material.fileSize !== undefined) result.file_size = material.fileSize;
  if (material.thumbnailUrl !== undefined) result.thumbnail_url = material.thumbnailUrl;
  if (material.subjectId !== undefined) result.subject_id = material.subjectId;
  if (material.tags !== undefined) result.tags = material.tags;
  
  return result;
};

// Assessment mappers
export const mapAssessmentFromDb = (dbAssessment: AssessmentRow): Assessment => ({
  id: dbAssessment.id,
  title: dbAssessment.title,
  description: safeNull(dbAssessment.description),
  type: dbAssessment.type,
  date: dbAssessment.date,
  dueDate: safeNull(dbAssessment.due_date),
  subjectId: dbAssessment.subject_id,
  teachingPlanId: safeNull(dbAssessment.teaching_plan_id),
  created_at: dbAssessment.created_at,
  updated_at: dbAssessment.updated_at,
});

export const mapAssessmentToDb = (assessment: Partial<Assessment>): Partial<AssessmentRow> => {
  const result: Partial<AssessmentRow> = {};

  if (assessment.id !== undefined) result.id = assessment.id;
  if (assessment.title !== undefined) result.title = assessment.title;
  if (assessment.description !== undefined) result.description = assessment.description;
  if (assessment.type !== undefined) result.type = assessment.type;
  if (assessment.date !== undefined) result.date = assessment.date;
  if (assessment.dueDate !== undefined) result.due_date = assessment.dueDate;
  if (assessment.subjectId !== undefined) result.subject_id = assessment.subjectId;
  if (assessment.teachingPlanId !== undefined) result.teaching_plan_id = assessment.teachingPlanId;

  return result;
};

// Lesson Plan mappers
export const mapLessonPlanFromDb = (dbLessonPlan: LessonPlanRow): LessonPlan => ({
  id: dbLessonPlan.id,
  title: dbLessonPlan.title,
  date: dbLessonPlan.date,
  duration: safeNull(dbLessonPlan.duration),
  teachingPlanId: dbLessonPlan.teaching_plan_id,
  objectives: dbLessonPlan.objectives || [],
  contents: dbLessonPlan.contents || [],
  activities: dbLessonPlan.activities || [],
  evaluation: safeNull(dbLessonPlan.evaluation),
  resources: dbLessonPlan.resources || [],
  notes: safeNull(dbLessonPlan.notes),
  homework: safeNull(dbLessonPlan.homework),
  created_at: dbLessonPlan.created_at,
  updated_at: dbLessonPlan.updated_at,
});

export const mapLessonPlanToDb = (lessonPlan: Partial<LessonPlan>): Partial<LessonPlanRow> => {
  const result: Partial<LessonPlanRow> = {};

  if (lessonPlan.id !== undefined) result.id = lessonPlan.id;
  if (lessonPlan.title !== undefined) result.title = lessonPlan.title;
  if (lessonPlan.date !== undefined) result.date = lessonPlan.date;
  if (lessonPlan.duration !== undefined) result.duration = lessonPlan.duration;
  if (lessonPlan.teachingPlanId !== undefined) result.teaching_plan_id = lessonPlan.teachingPlanId;
  if (lessonPlan.objectives !== undefined) result.objectives = lessonPlan.objectives;
  if (lessonPlan.contents !== undefined) result.contents = lessonPlan.contents;
  if (lessonPlan.activities !== undefined) result.activities = lessonPlan.activities;
  if (lessonPlan.evaluation !== undefined) result.evaluation = lessonPlan.evaluation;
  if (lessonPlan.resources !== undefined) result.resources = lessonPlan.resources;
  if (lessonPlan.notes !== undefined) result.notes = lessonPlan.notes;
  if (lessonPlan.homework !== undefined) result.homework = lessonPlan.homework;

  return result;
};

// Teaching Plan mappers
export const mapTeachingPlanFromDb = (dbTeachingPlan: TeachingPlanRow): TeachingPlan => ({
  id: dbTeachingPlan.id,
  title: dbTeachingPlan.title,
  description: safeNull(dbTeachingPlan.description),
  startDate: dbTeachingPlan.start_date,
  endDate: dbTeachingPlan.end_date,
  subjectId: dbTeachingPlan.subject_id,
  annualPlanId: safeNull(dbTeachingPlan.annual_plan_id),
  objectives: dbTeachingPlan.objectives || [],
  contents: dbTeachingPlan.contents || [],
  methodology: safeNull(dbTeachingPlan.methodology),
  evaluation: safeNull(dbTeachingPlan.evaluation),
  resources: dbTeachingPlan.resources || [],
  created_at: dbTeachingPlan.created_at,
  updated_at: dbTeachingPlan.updated_at,
});

export const mapTeachingPlanToDb = (teachingPlan: Partial<TeachingPlan>): Partial<TeachingPlanRow> => {
  const result: Partial<TeachingPlanRow> = {};

  if (teachingPlan.id !== undefined) result.id = teachingPlan.id;
  if (teachingPlan.title !== undefined) result.title = teachingPlan.title;
  if (teachingPlan.description !== undefined) result.description = teachingPlan.description;
  if (teachingPlan.startDate !== undefined) result.start_date = teachingPlan.startDate;
  if (teachingPlan.endDate !== undefined) result.end_date = teachingPlan.endDate;
  if (teachingPlan.subjectId !== undefined) result.subject_id = teachingPlan.subjectId;
  if (teachingPlan.annualPlanId !== undefined) result.annual_plan_id = teachingPlan.annualPlanId;
  if (teachingPlan.objectives !== undefined) result.objectives = teachingPlan.objectives;
  if (teachingPlan.contents !== undefined) result.contents = teachingPlan.contents;
  if (teachingPlan.methodology !== undefined) result.methodology = teachingPlan.methodology;
  if (teachingPlan.evaluation !== undefined) result.evaluation = teachingPlan.evaluation;
  if (teachingPlan.resources !== undefined) result.resources = teachingPlan.resources;

  return result;
};

// Student Assessment mappers
export const mapStudentAssessmentFromDb = (dbStudentAssessment: StudentAssessmentRow): StudentAssessment => ({
  id: dbStudentAssessment.id,
  studentId: dbStudentAssessment.student_id,
  assessmentId: dbStudentAssessment.assessment_id,
  score: safeNull(dbStudentAssessment.score),
  feedback: safeNull(dbStudentAssessment.feedback),
  submittedDate: safeNull(dbStudentAssessment.submitted_date),
  gradedDate: safeNull(dbStudentAssessment.graded_date),
  // Since 'status' doesn't exist in the row but is needed in the interface,
  // we default to 'pending' if no graded_date is present
  status: dbStudentAssessment.graded_date ? 'graded' : (dbStudentAssessment.submitted_date ? 'submitted' : 'pending'),
  created_at: dbStudentAssessment.created_at
});

export const mapStudentAssessmentToDb = (studentAssessment: Partial<StudentAssessment>): Partial<StudentAssessmentRow> => {
  const result: Partial<StudentAssessmentRow> = {};

  if (studentAssessment.id !== undefined) result.id = studentAssessment.id;
  if (studentAssessment.studentId !== undefined) result.student_id = studentAssessment.studentId;
  if (studentAssessment.assessmentId !== undefined) result.assessment_id = studentAssessment.assessmentId;
  if (studentAssessment.score !== undefined) result.score = studentAssessment.score;
  if (studentAssessment.feedback !== undefined) result.feedback = studentAssessment.feedback;
  if (studentAssessment.submittedDate !== undefined) result.submitted_date = studentAssessment.submittedDate;
  if (studentAssessment.gradedDate !== undefined) result.graded_date = studentAssessment.gradedDate;

  return result;
};

// Calendar Event mappers
export const mapCalendarEventFromDb = (dbEvent: CalendarEventRow): CalendarEvent => ({
  id: dbEvent.id,
  title: dbEvent.title,
  description: safeNull(dbEvent.description),
  startDate: dbEvent.start_date,
  endDate: safeNull(dbEvent.end_date),
  allDay: dbEvent.all_day,
  type: dbEvent.type,
  subjectId: safeNull(dbEvent.subject_id),
  lessonPlanId: safeNull(dbEvent.lesson_plan_id),
  assessmentId: safeNull(dbEvent.assessment_id),
  location: safeNull(dbEvent.location),
  color: safeNull(dbEvent.color),
  created_at: dbEvent.created_at,
  // Include source_type and source_id only if they're in the database schema
  sourceType: (dbEvent as any).source_type,
  sourceId: (dbEvent as any).source_id,
});

export const mapCalendarEventToDb = (event: Partial<CalendarEvent>): Partial<CalendarEventRow> & { source_type?: string, source_id?: string } => {
  const result: Partial<CalendarEventRow> & { source_type?: string, source_id?: string } = {};
  
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
  
  // Include source_type and source_id in the database fields if they're in the event object
  if ((event as any).sourceType !== undefined) result.source_type = (event as any).sourceType;
  if ((event as any).sourceId !== undefined) result.source_id = (event as any).sourceId;
  
  return result;
};
