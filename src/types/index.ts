
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
}

// Subject/Class
export interface Subject {
  id: ID;
  name: string;
  grade: string;
  academicPeriodId: ID;
}

// Annual Plan
export interface AnnualPlan {
  id: ID;
  title: string;
  description?: string;
  subjectId: ID;
  academicPeriodId: ID;
  objectives: string[];
  generalContent: string;
  methodology: string;
  evaluation: string;
  references: string[];
  createdAt: DateISO;
  updatedAt: DateISO;
}

// Teaching Unit Plan
export interface TeachingPlan {
  id: ID;
  title: string;
  description?: string;
  annualPlanId: ID;
  subjectId: ID;
  startDate: DateISO;
  endDate: DateISO;
  objectives: string[];
  bnccReferences: string[];
  contents: string[];
  methodology: string;
  resources: string[];
  evaluation: string;
  createdAt: DateISO;
  updatedAt: DateISO;
}

// Lesson Plan
export interface LessonPlan {
  id: ID;
  title: string;
  teachingPlanId: ID;
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
  createdAt: DateISO;
  updatedAt: DateISO;
}

// Assessment
export interface Assessment {
  id: ID;
  title: string;
  description?: string;
  subjectId: ID;
  teachingPlanId?: ID;
  type: "diagnostic" | "formative" | "summative";
  totalPoints: number;
  date: DateISO;
  dueDate?: DateISO;
  createdAt: DateISO;
  updatedAt: DateISO;
}

// Student (minimal implementation for assessment tracking)
export interface Student {
  id: ID;
  name: string;
  registration: string;
}

// Student Assessment
export interface StudentAssessment {
  id: ID;
  studentId: ID;
  assessmentId: ID;
  score: number;
  feedback?: string;
  submittedDate?: DateISO;
  gradedDate?: DateISO;
}

// Calendar Event
export interface CalendarEvent {
  id: ID;
  title: string;
  description?: string;
  startDate: DateISO;
  endDate?: DateISO;
  allDay: boolean;
  type: "class" | "exam" | "meeting" | "deadline" | "other";
  subjectId?: ID;
  lessonPlanId?: ID;
  assessmentId?: ID;
  location?: string;
  color?: string;
}

// Educational Material
export interface Material {
  id: ID;
  title: string;
  description?: string;
  type: "document" | "video" | "link" | "image" | "other";
  url?: string;
  filePath?: string;
  fileSize?: number;
  tags: string[];
  subjectId?: ID;
  createdAt: DateISO;
  updatedAt: DateISO;
}
