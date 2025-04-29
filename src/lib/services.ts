
import { 
  AcademicPeriod, 
  Subject, 
  AnnualPlan, 
  TeachingPlan, 
  LessonPlan,
  Assessment,
  Student,
  StudentAssessment,
  CalendarEvent,
  Material,
  ID
} from '@/types';

import { 
  academicPeriods as mockAcademicPeriods,
  subjects as mockSubjects,
  annualPlans as mockAnnualPlans,
  teachingPlans as mockTeachingPlans,
  lessonPlans as mockLessonPlans,
  assessments as mockAssessments,
  students as mockStudents,
  studentAssessments as mockStudentAssessments,
  calendarEvents as mockCalendarEvents,
  materials as mockMaterials
} from './mock-data';

// Helper function to create unique IDs
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Helper function to get current ISO date
const getNowISO = (): string => {
  return new Date().toISOString();
};

// Generic service creator
const createService = <T extends { id: ID }>(mockData: T[]) => {
  let data = [...mockData];
  
  return {
    getAll: async (): Promise<T[]> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return [...data];
    },
    
    getById: async (id: ID): Promise<T | null> => {
      await new Promise(resolve => setTimeout(resolve, 200));
      const item = data.find(item => item.id === id);
      return item ? { ...item } : null;
    },
    
    create: async (item: Omit<T, 'id'>): Promise<T> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newItem = {
        ...item,
        id: generateId()
      } as T;
      data.push(newItem);
      return { ...newItem };
    },
    
    update: async (id: ID, updates: Partial<T>): Promise<T | null> => {
      await new Promise(resolve => setTimeout(resolve, 400));
      const index = data.findIndex(item => item.id === id);
      if (index === -1) return null;
      
      const updatedItem = { 
        ...data[index], 
        ...updates,
        updatedAt: getNowISO()  
      } as T;
      
      data[index] = updatedItem;
      return { ...updatedItem };
    },
    
    delete: async (id: ID): Promise<boolean> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = data.findIndex(item => item.id === id);
      if (index === -1) return false;
      
      data.splice(index, 1);
      return true;
    }
  };
};

// Create specific services with additional methods as needed
export const academicPeriodService = createService<AcademicPeriod>(mockAcademicPeriods);
export const subjectService = createService<Subject>(mockSubjects);

// Annual Plan Service with custom methods
export const annualPlanService = {
  ...createService<AnnualPlan>(mockAnnualPlans),
  
  // Get all annual plans for a specific subject
  getBySubject: async (subjectId: ID): Promise<AnnualPlan[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAnnualPlans.filter(plan => plan.subjectId === subjectId);
  }
};

// Teaching Plan Service with custom methods
export const teachingPlanService = {
  ...createService<TeachingPlan>(mockTeachingPlans),
  
  // Get all teaching plans for a specific annual plan
  getByAnnualPlan: async (annualPlanId: ID): Promise<TeachingPlan[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTeachingPlans.filter(plan => plan.annualPlanId === annualPlanId);
  },
  
  // Get all teaching plans for a specific subject
  getBySubject: async (subjectId: ID): Promise<TeachingPlan[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTeachingPlans.filter(plan => plan.subjectId === subjectId);
  }
};

// Lesson Plan Service with custom methods
export const lessonPlanService = {
  ...createService<LessonPlan>(mockLessonPlans),
  
  // Get all lesson plans for a specific teaching plan
  getByTeachingPlan: async (teachingPlanId: ID): Promise<LessonPlan[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockLessonPlans.filter(plan => plan.teachingPlanId === teachingPlanId);
  }
};

// Assessment Service with custom methods
export const assessmentService = {
  ...createService<Assessment>(mockAssessments),
  
  // Get all assessments for a specific subject
  getBySubject: async (subjectId: ID): Promise<Assessment[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAssessments.filter(assessment => assessment.subjectId === subjectId);
  },
  
  // Get all assessments for a specific teaching plan
  getByTeachingPlan: async (teachingPlanId: ID): Promise<Assessment[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAssessments.filter(assessment => assessment.teachingPlanId === teachingPlanId);
  }
};

// Student Service
export const studentService = createService<Student>(mockStudents);

// Student Assessment Service with custom methods
export const studentAssessmentService = {
  ...createService<StudentAssessment>(mockStudentAssessments),
  
  // Get all assessments for a specific student
  getByStudent: async (studentId: ID): Promise<StudentAssessment[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockStudentAssessments.filter(sa => sa.studentId === studentId);
  },
  
  // Get all student assessments for a specific assessment
  getByAssessment: async (assessmentId: ID): Promise<StudentAssessment[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockStudentAssessments.filter(sa => sa.assessmentId === assessmentId);
  },
  
  // Get average score for a specific assessment
  getAssessmentAverage: async (assessmentId: ID): Promise<number> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const assessments = mockStudentAssessments.filter(sa => sa.assessmentId === assessmentId);
    if (assessments.length === 0) return 0;
    
    const sum = assessments.reduce((acc, curr) => acc + curr.score, 0);
    return sum / assessments.length;
  }
};

// Calendar Event Service with custom methods
export const calendarEventService = {
  ...createService<CalendarEvent>(mockCalendarEvents),
  
  // Get all events between two dates
  getByDateRange: async (startDate: string, endDate: string): Promise<CalendarEvent[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCalendarEvents.filter(event => {
      const eventStart = new Date(event.startDate);
      const rangeStart = new Date(startDate);
      const rangeEnd = new Date(endDate);
      
      return eventStart >= rangeStart && eventStart <= rangeEnd;
    });
  },
  
  // Get all events for a specific subject
  getBySubject: async (subjectId: ID): Promise<CalendarEvent[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCalendarEvents.filter(event => event.subjectId === subjectId);
  },
  
  // Get all events by type
  getByType: async (type: CalendarEvent['type']): Promise<CalendarEvent[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCalendarEvents.filter(event => event.type === type);
  }
};

// Material Service with custom methods
export const materialService = {
  ...createService<Material>(mockMaterials),
  
  // Get all materials for a specific subject
  getBySubject: async (subjectId: ID): Promise<Material[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockMaterials.filter(material => material.subjectId === subjectId);
  },
  
  // Search materials by tags or title
  search: async (query: string): Promise<Material[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const normalizedQuery = query.toLowerCase();
    
    return mockMaterials.filter(material => {
      const titleMatch = material.title.toLowerCase().includes(normalizedQuery);
      const descMatch = material.description?.toLowerCase().includes(normalizedQuery) || false;
      const tagMatch = material.tags.some(tag => tag.toLowerCase().includes(normalizedQuery));
      
      return titleMatch || descMatch || tagMatch;
    });
  },
  
  // Get materials by type
  getByType: async (type: Material['type']): Promise<Material[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockMaterials.filter(material => material.type === type);
  }
};

// Export an object with all services
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
