
import { Student } from '@/types';
import { createService } from './baseService';

// Student Service
export const studentService = {
  ...createService<Student>("students"),
};
