
// Reexport all calendar operations
import { getAll, getById, deleteEvent, deleteBySource, create, update } from './basicOperations';
import { getByDateRange, getBySubject } from './queryOperations';
import { 
  syncFromAssessment, 
  syncFromLessonPlan,
  syncFromTeachingPlan,
  syncFromStudentAssessment 
} from './syncOperations';

// Export all services directly
export const calendarEventService = {
  getAll,
  getById,
  delete: deleteEvent,
  deleteEvent,
  getByDateRange,
  getBySubject,
  create,
  update,
  deleteBySource,
  syncFromAssessment,
  syncFromLessonPlan,
  syncFromTeachingPlan,
  syncFromStudentAssessment
};
