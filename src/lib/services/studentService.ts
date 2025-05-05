
import { Student, ID } from '@/types';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCase } from '@/integrations/supabase/supabaseAdapter';
import { createService } from './baseService';

// Base service with CRUD operations
const baseService = createService<Student>("students");

// Method to get students by subject
const getBySubject = async (subjectId: string): Promise<Student[]> => {
  try {
    // In a real application, we would query a join table between students and subjects
    // For now, we'll just return all students as a mock implementation
    const { data, error } = await supabase.from('students').select('*');
    
    if (error) throw error;
    return data ? data.map(item => mapToCamelCase<Student>(item)) : [];
  } catch (error) {
    console.error('Error fetching students by subject:', error);
    return [];
  }
};

// Export the student service
export const studentService = {
  ...baseService,
  getBySubject
};

export default studentService;
