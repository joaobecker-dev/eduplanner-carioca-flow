// Type definitions for the application
import { 
  EventType as DbEventType,
  AssessmentType as DbAssessmentType,
  MaterialType as DbMaterialType,
  EventSourceType
} from './database';

// Basic types
export type ID = string;
export type UUID = string;
export type DateString = string;
export type TimeString = string;
export type DateTimeString = string;

// Re-export the database enum types
export type EventType = DbEventType;
export type AssessmentType = DbAssessmentType;
export type MaterialType = DbMaterialType;
export type { EventSourceType };

// User related types
export interface User {
  id: ID;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
  avatar?: string;
  created_at: DateTimeString;
}

// Academic period types
export interface AcademicPeriod {
  id: ID;
  name: string;
  startDate: DateString;
  endDate: DateString;
  isActive: boolean;
  created_at: DateTimeString;
}

// Subject related types
export interface Subject {
  id: ID;
  name: string;
  code?: string;
  description?: string;
  academicPeriodId: ID;
  created_at: DateTimeString;
  grade: string; // Added grade field
}

// Teaching plan types
export interface TeachingPlan {
  id: ID;
  title: string;
  description?: string;
  objectives?: string[];
  bnccReferences?: string[];
  contents?: string[];
  methodology?: string;
  evaluation?: string;
  resources?: string[];
  subjectId: ID;
  annualPlanId: ID;
  startDate: DateString;
  endDate: DateString;
  status?: 'draft' | 'published' | 'archived';
  created_at: DateTimeString;
  updated_at?: DateTimeString;
}

// Lesson plan types
export interface LessonPlan {
  id: ID;
  title: string;
  date: DateTimeString;
  duration?: number;
  objectives?: string[];
  contents?: string[];  // Changed from content to contents to match DB
  activities?: string[];
  resources?: string[];
  assessment?: string;
  notes?: string;
  evaluation?: string;
  homework?: string;
  teachingPlanId: ID;
  status?: 'draft' | 'published' | 'archived';
  created_at: DateTimeString;
  updated_at?: DateTimeString;
}

// Assessment types
export interface Assessment {
  id: ID;
  title: string;
  description?: string;
  type: AssessmentType;
  weight?: number;
  maxScore?: number;
  totalPoints?: number;
  date: DateString;
  dueDate?: DateString;
  subjectId: ID;
  teachingPlanId?: ID;
  status?: 'draft' | 'published' | 'archived';
  created_at: DateTimeString;
  updated_at?: DateTimeString;
}

// Student types
export interface Student {
  id: ID;
  name: string;
  email?: string;
  registration: string;
  dateOfBirth?: DateString;
  phoneNumber?: string;
  address?: string;
  notes?: string;
  created_at: DateTimeString;
}

// Student assessment types
export interface StudentAssessment {
  id: ID;
  studentId: ID;
  assessmentId: ID;
  score?: number;
  feedback?: string;
  submittedDate?: DateString;
  gradedDate?: DateString;
  status: 'pending' | 'submitted' | 'graded';
  created_at: DateTimeString;
}

// Annual plan types
export interface AnnualPlan {
  id: ID;
  title: string;
  description?: string;
  year?: number;
  objectives?: string[];
  methodology?: string;
  generalContent?: string;
  evaluation?: string;
  referenceMaterials?: string[];
  academicPeriodId: ID;
  subjectId: ID;
  created_at: DateTimeString;
  updated_at?: DateTimeString;
}

// Material types
export interface Material {
  id: ID;
  title: string;
  description?: string;
  url?: string;
  filePath?: string;
  fileSize?: number;
  type: MaterialType;
  tags: string[];
  subjectId?: ID;
  thumbnailUrl?: string;
  notes?: string; // Keeping notes field as it exists in the DB schema
  created_at: string;
  updated_at: string;  // Changed from updatedAt to updated_at to match DB
}

// Calendar event types
export interface CalendarEvent {
  id: ID;
  title: string;
  description?: string;
  startDate: DateTimeString;
  endDate?: DateTimeString;
  allDay: boolean;
  type: EventType;
  subjectId?: ID;
  lessonPlanId?: ID;
  assessmentId?: ID;
  teachingPlanId?: ID;
  location?: string;
  color?: string;
  sourceType?: EventSourceType;
  sourceId?: string | null;
  created_at: DateTimeString;
}

// Form submission types
export interface FormSubmission {
  id: ID;
  formId: ID;
  userId: ID;
  data: Record<string, any>;
  submittedAt: DateTimeString;
  created_at: DateTimeString;
}

// Notification types
export interface Notification {
  id: ID;
  userId: ID;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: DateTimeString;
}

// Settings types
export interface Settings {
  id: ID;
  userId: ID;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
  created_at: DateTimeString;
}
