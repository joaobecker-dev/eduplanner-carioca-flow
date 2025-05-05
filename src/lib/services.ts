
import { 
  AcademicPeriod, 
  Subject, 
  AnnualPlan, 
  TeachingPlan, 
  LessonPlan,
  Assessment,
  Student,
  StudentAssessment,
  Material,
  ID
} from '@/types';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { mapToCamelCase } from '@/lib/utils/caseConverters';

// Import services directly from their modular files to avoid circular dependencies
import { calendarEventService as calendarEventServiceImport } from './services/calendar';

// Re-export the calendar event service
export const calendarEventService = calendarEventServiceImport;

// Helper function for error handling
const handleError = (error: any, operation: string): void => {
  console.error(`Error ${operation}:`, error);
  toast({
    title: `Erro ao ${operation}`,
    description: error.message || "Ocorreu um erro inesperado",
    variant: "destructive",
  });
};

// Type for valid table names
type TableName = "academic_periods" | "subjects" | "annual_plans" | 
  "teaching_plans" | "lesson_plans" | "assessments" | "students" | 
  "student_assessments" | "materials";

// Create generic service for basic CRUD operations
const createService = <T extends { id: ID }>(tableName: TableName) => {
  return {
    getAll: async (): Promise<T[]> => {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*');
        
        if (error) throw error;
        return data ? (data as any[]).map(item => mapToCamelCase<T>(item)) : [];
      } catch (error) {
        handleError(error, `buscar ${tableName}`);
        return [];
      }
    },
    
    getById: async (id: ID): Promise<T | null> => {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('id', id)
          .maybeSingle();
        
        if (error) throw error;
        return data ? mapToCamelCase<T>(data as any) : null;
      } catch (error) {
        handleError(error, `buscar ${tableName} por ID`);
        return null;
      }
    },
    
    create: async (item: Omit<T, 'id'>): Promise<T | null> => {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .insert(item as any)
          .select()
          .single();
        
        if (error) throw error;
        return data ? mapToCamelCase<T>(data as any) : null;
      } catch (error) {
        handleError(error, `criar ${tableName}`);
        return null;
      }
    },
    
    update: async (id: ID, updates: Partial<T>): Promise<T | null> => {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .update(updates as any)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data ? mapToCamelCase<T>(data as any) : null;
      } catch (error) {
        handleError(error, `atualizar ${tableName}`);
        return null;
      }
    },
    
    delete: async (id: ID): Promise<boolean> => {
      try {
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return true;
      } catch (error) {
        handleError(error, `excluir ${tableName}`);
        return false;
      }
    }
  };
};

// Academic Period Service
export const academicPeriodService = {
  ...createService<AcademicPeriod>("academic_periods"),
};

// Subject Service
export const subjectService = {
  ...createService<Subject>("subjects"),
  
  // Get all subjects for a specific academic period
  getByAcademicPeriod: async (academicPeriodId: ID): Promise<Subject[]> => {
    try {
      const { data, error } = await supabase
        .from("subjects")
        .select('*')
        .eq('academic_period_id', academicPeriodId);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<Subject>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar disciplinas por período acadêmico');
      return [];
    }
  }
};

// Annual Plan Service
export const annualPlanService = {
  ...createService<AnnualPlan>("annual_plans"),
  
  // Get all annual plans for a specific subject
  getBySubject: async (subjectId: ID): Promise<AnnualPlan[]> => {
    try {
      const { data, error } = await supabase
        .from("annual_plans")
        .select('*')
        .eq('subject_id', subjectId);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<AnnualPlan>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar planos anuais por disciplina');
      return [];
    }
  }
};

// Teaching Plan Service
export const teachingPlanService = {
  ...createService<TeachingPlan>("teaching_plans"),
  
  // Get all teaching plans for a specific annual plan
  getByAnnualPlan: async (annualPlanId: ID): Promise<TeachingPlan[]> => {
    try {
      const { data, error } = await supabase
        .from("teaching_plans")
        .select('*')
        .eq('annual_plan_id', annualPlanId);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<TeachingPlan>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar planos de ensino por plano anual');
      return [];
    }
  },
  
  // Get all teaching plans for a specific subject
  getBySubject: async (subjectId: ID): Promise<TeachingPlan[]> => {
    try {
      const { data, error } = await supabase
        .from("teaching_plans")
        .select('*')
        .eq('subject_id', subjectId);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<TeachingPlan>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar planos de ensino por disciplina');
      return [];
    }
  }
};

// Lesson Plan Service
export const lessonPlanService = {
  ...createService<LessonPlan>("lesson_plans"),
  
  // Get all lesson plans for a specific teaching plan
  getByTeachingPlan: async (teachingPlanId: ID): Promise<LessonPlan[]> => {
    try {
      const { data, error } = await supabase
        .from("lesson_plans")
        .select('*')
        .eq('teaching_plan_id', teachingPlanId);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<LessonPlan>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar planos de aula por plano de ensino');
      return [];
    }
  }
};

// Assessment Service
export const assessmentService = {
  ...createService<Assessment>("assessments"),
  
  // Get all assessments for a specific subject
  getBySubject: async (subjectId: ID): Promise<Assessment[]> => {
    try {
      const { data, error } = await supabase
        .from("assessments")
        .select('*')
        .eq('subject_id', subjectId);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<Assessment>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar avaliações por disciplina');
      return [];
    }
  },
  
  // Get all assessments for a specific teaching plan
  getByTeachingPlan: async (teachingPlanId: ID): Promise<Assessment[]> => {
    try {
      const { data, error } = await supabase
        .from("assessments")
        .select('*')
        .eq('teaching_plan_id', teachingPlanId);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<Assessment>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar avaliações por plano de ensino');
      return [];
    }
  }
};

// Student Service
export const studentService = {
  ...createService<Student>("students"),
};

// Student Assessment Service
export const studentAssessmentService = {
  ...createService<StudentAssessment>("student_assessments"),
  
  // Get all assessments for a specific student
  getByStudent: async (studentId: ID): Promise<StudentAssessment[]> => {
    try {
      const { data, error } = await supabase
        .from("student_assessments")
        .select('*')
        .eq('student_id', studentId);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<StudentAssessment>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar avaliações por aluno');
      return [];
    }
  },
  
  // Get all student assessments for a specific assessment
  getByAssessment: async (assessmentId: ID): Promise<StudentAssessment[]> => {
    try {
      const { data, error } = await supabase
        .from("student_assessments")
        .select('*')
        .eq('assessment_id', assessmentId);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<StudentAssessment>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar notas de alunos por avaliação');
      return [];
    }
  },
  
  // Get average score for a specific assessment
  getAssessmentAverage: async (assessmentId: ID): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from("student_assessments")
        .select('score')
        .eq('assessment_id', assessmentId);
      
      if (error) throw error;
      
      if (!data || data.length === 0) return 0;
      
      const sum = data.reduce((acc, curr) => acc + Number(curr.score), 0);
      return sum / data.length;
    } catch (error) {
      handleError(error, 'calcular média da avaliação');
      return 0;
    }
  }
};

// Define valid material types for TypeScript validation
type MaterialType = "document" | "video" | "link" | "image" | "other";

// Material Service
export const materialService = {
  ...createService<Material>("materials"),
  
  // Get all materials for a specific subject
  getBySubject: async (subjectId: ID): Promise<Material[]> => {
    try {
      const { data, error } = await supabase
        .from("materials")
        .select('*')
        .eq('subject_id', subjectId);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<Material>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar materiais por disciplina');
      return [];
    }
  },
  
  // Get all materials by type
  getByType: async (type: MaterialType): Promise<Material[]> => {
    try {
      const { data, error } = await supabase
        .from("materials")
        .select('*')
        .eq('type', type);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<Material>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar materiais por tipo');
      return [];
    }
  },
  
  // Search materials by query in title, description or tags
  search: async (query: string): Promise<Material[]> => {
    try {
      const { data, error } = await supabase
        .from("materials")
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      
      if (error) throw error;
      
      // We need to filter manually for tags since it's an array column
      const filteredData = data.filter(material => 
        material.tags.some((tag: string) => 
          tag.toLowerCase().includes(query.toLowerCase())
        )
      );
      
      return filteredData.map(item => mapToCamelCase<Material>(item));
    } catch (error) {
      handleError(error, 'buscar materiais');
      return [];
    }
  }
};

/**
 * Legacy service exports for backward compatibility.
 * Prefer importing services directly from '@/lib/services' (e.g., `import { calendarEventService } from '@/lib/services'`).
 * This object will be removed in future releases.
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
  calendarEvent: calendarEventServiceImport
};
