
// Reexport all calendar operations
import { getAll, getById, deleteEvent, create, update } from './basicOperations';
import { deleteBySourceEvent } from './wrapperOperations';
import { getByDateRange, getBySubject } from './queryOperations';
import { 
  syncFromAssessment,
  syncFromLessonPlan, 
  syncFromTeachingPlan,
  syncFromStudentAssessment
} from './syncOperations';

// Reexport all functions
export const calendarEventService = {
  getAll,
  getById,
  getByDateRange,
  getBySubject,
  create,
  update,
  delete: deleteEvent,
  deleteBySource: deleteBySourceEvent,
  syncFromAssessment,
  syncFromLessonPlan,
  syncFromTeachingPlan,
  syncFromStudentAssessment
};
