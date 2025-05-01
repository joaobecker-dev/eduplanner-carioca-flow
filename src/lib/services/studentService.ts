
import { Student } from '@/types';
import { createService, handleError } from './baseService';

// Student Service
export const studentService = {
  ...createService<Student>("students"),
};
