
import { AcademicPeriod } from '@/types';
import { createService } from './baseService';

// Academic Period Service
export const academicPeriodService = {
  ...createService<AcademicPeriod>("academic_periods"),
};
