// Type definitions for EduPlanner

// Base types
export type ID = string;
export type DateISO = string;

// User types (for future implementation)
export interface User {
  id: ID;
  name: string;
  email: string;
  role: "professor" | "administrador";
}

// Academic period
export interface AcademicPeriod {
  id: ID;
  name: string;
  startDate: DateISO;
  endDate: DateISO;
  created_at?: DateISO;
}

// Subject/Class
export interface Subject {
  id: ID;
  name: string;
  grade: string;
  academicPeriodId: ID;
  academic_period_id?: ID; // For Supabase DB compatibility
  created_at?: DateISO;
}

// Annual Plan
export interface AnnualPlan {
  id: ID;
  title: string;
  description?: string;
  subjectId: ID;
  subject_id?: ID; // For Supabase DB compatibility
  academicPeriodId: ID;
  academic_period_id?: ID; // For Supabase DB compatibility
  objectives: string[];
  generalContent: string;
  general_content?: string; // For Supabase DB compatibility
  methodology: string;
  evaluation: string;
  reference_materials: string[]; // Changed from 'references_materials' to 'reference_materials'
  createdAt?: DateISO;
  updatedAt?: DateISO;
  created_at?: DateISO; // For Supabase DB compatibility
  updated_at?: DateISO; // For Supabase DB compatibility
}

// Teaching Unit Plan
export interface TeachingPlan {
  id: ID;
  title: string;
  description?: string;
  annualPlanId: ID;
  annual_plan_id?: ID; // For Supabase DB compatibility
  subjectId: ID;
  subject_id?: ID; // For Supabase DB compatibility
  startDate: DateISO;
  start_date?: DateISO; // For Supabase DB compatibility
  endDate: DateISO;
  end_date?: DateISO; // For Supabase DB compatibility
  objectives: string[];
  bnccReferences: string[];
  bncc_references?: string[]; // For Supabase DB compatibility
  contents: string[];
  methodology: string;
  resources: string[];
  evaluation: string;
  createdAt?: DateISO;
  updatedAt?: DateISO;
  created_at?: DateISO; // For Supabase DB compatibility
  updated_at?: DateISO; // For Supabase DB compatibility
}

// Lesson Plan
export interface LessonPlan {
  id: ID;
  title: string;
  teachingPlanId: ID;
  teaching_plan_id?: ID; // For Supabase DB compatibility
  date: DateISO;
  duration: number; // minutes
  objectives: string[];
  contents: string[];
  activities: string[];
  resources: string[];
  homework?: string;
  evaluation?: string;
  notes?: string;
  materialIds?: ID[];
  material_ids?: ID[]; // For Supabase DB compatibility
  createdAt?: DateISO;
  updatedAt?: DateISO;
  created_at?: DateISO; // For Supabase DB compatibility
  updated_at?: DateISO; // For Supabase DB compatibility
}

// Assessment
export interface Assessment {
  id: ID;
  title: string;
  description?: string;
  subjectId: ID;
  subject_id?: ID; // For Supabase DB compatibility
  teachingPlanId?: ID;
  teaching_plan_id?: ID; // For Supabase DB compatibility
  type: "diagnostic" | "formative" | "summative";
  totalPoints: number;
  total_points?: number; // For Supabase DB compatibility
  date: DateISO;
  dueDate?: DateISO;
  due_date?: DateISO; // For Supabase DB compatibility
  createdAt?: DateISO;
  updatedAt?: DateISO;
  created_at?: DateISO; // For Supabase DB compatibility
  updated_at?: DateISO; // For Supabase DB compatibility
}

// Student (minimal implementation for assessment tracking)
export interface Student {
  id: ID;
  name: string;
  registration: string;
  created_at?: DateISO; // For Supabase DB compatibility
}

// Student Assessment
export interface StudentAssessment {
  id: ID;
  studentId: ID;
  student_id?: ID; // For Supabase DB compatibility
  assessmentId: ID;
  assessment_id?: ID; // For Supabase DB compatibility
  score: number;
  feedback?: string;
  submittedDate?: DateISO;
  submitted_date?: DateISO; // For Supabase DB compatibility
  gradedDate?: DateISO;
  graded_date?: DateISO; // For Supabase DB compatibility
  created_at?: DateISO; // For Supabase DB compatibility
}

// Calendar Event
export interface CalendarEvent {
  id: ID;
  title: string;
  description?: string;
  startDate: DateISO;
  start_date?: DateISO; // For Supabase DB compatibility
  endDate?: DateISO;
  end_date?: DateISO; // For Supabase DB compatibility
  allDay: boolean;
  all_day?: boolean; // For Supabase DB compatibility
  type: "class" | "exam" | "meeting" | "deadline" | "other";
  subjectId?: ID;
  subject_id?: ID; // For Supabase DB compatibility
  lessonPlanId?: ID;
  lesson_plan_id?: ID; // For Supabase DB compatibility
  assessmentId?: ID;
  assessment_id?: ID; // For Supabase DB compatibility
  location?: string;
  color?: string;
  created_at?: DateISO; // For Supabase DB compatibility
}

// Educational Material
export interface Material {
  id: ID;
  title: string;
  description?: string;
  type: "document" | "video" | "link" | "image" | "other";
  url?: string;
  filePath?: string;
  file_path?: string; // For Supabase DB compatibility
  fileSize?: number;
  file_size?: number; // For Supabase DB compatibility
  tags: string[];
  subjectId?: ID;
  subject_id?: ID; // For Supabase DB compatibility
  createdAt?: DateISO;
  updatedAt?: DateISO;
  created_at?: DateISO; // For Supabase DB compatibility
  updated_at?: DateISO; // For Supabase DB compatibility
}

// Helper function to map snake_case DB fields to camelCase for frontend
export function mapToCamelCase<T>(item: any): T {
  if (!item) return null as unknown as T;
  
  const result: any = {};
  
  // Process each property
  for (const key in item) {
    if (Object.prototype.hasOwnProperty.call(item, key)) {
      // Convert snake_case to camelCase
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      result[camelKey] = item[key];
      
      // Keep original snake_case key for compatibility
      if (camelKey !== key) {
        result[key] = item[key];
      }
    }
  }
  
  return result as T;
}

// Helper function to map camelCase frontend fields to snake_case for DB
export function mapToSnakeCase<T>(item: any): T {
  if (!item) return null as unknown as T;
  
  const result: any = {};
  
  // Process each property
  for (const key in item) {
    if (Object.prototype.hasOwnProperty.call(item, key)) {
      // Convert camelCase to snake_case
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      result[snakeKey] = item[key];
      
      // Keep original camelCase key for compatibility
      if (snakeKey !== key) {
        result[key] = item[key];
      }
    }
  }
  
  return result as T;
}
