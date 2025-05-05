
// Fix the type instantiation issue, most likely related to circular references
// by adding explicit type annotations or returning more specific types

import { Student, ID } from '@/types';
import { createService } from './baseService';

// Make sure the mapToCamelCase function is imported
import { mapToCamelCase } from '@/lib/utils/caseConverters';
import { supabase } from '@/integrations/supabase/client';

// Student Service
export const studentService = {
  ...createService<Student>("students"),
  
  // Helper method to get a student by ID with less risk of circular references
  getStudentById: async (id: ID): Promise<Student | null> => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error || !data) {
        throw error || new Error("Student not found");
      }
      
      return mapToCamelCase(data) as Student;
    } catch (error) {
      console.error("Error fetching student:", error);
      return null;
    }
  },
  
  // Add the getBySubject method that's being used elsewhere
  getBySubject: async (subjectId: ID): Promise<Student[]> => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("subject_id", subjectId);
      
      if (error) {
        throw error;
      }
      
      return data ? data.map(item => mapToCamelCase(item)) as Student[] : [];
    } catch (error) {
      console.error("Error fetching students by subject:", error);
      return [];
    }
  }
};
