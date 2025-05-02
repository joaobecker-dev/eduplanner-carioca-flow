
import { CalendarEvent, Subject } from '@/types';

/**
 * Get color based on event type
 */
export const getEventColor = (type: string): string => {
  switch (type) {
    case 'exam':
      return 'rgba(220, 38, 38, 0.8)'; // Red for exams
    case 'class':
      return 'rgba(59, 130, 246, 0.8)'; // Blue for classes/teaching plans
    case 'meeting':
      return 'rgba(139, 92, 246, 0.8)'; // Purple for meetings
    default:
      return 'rgba(156, 163, 175, 0.8)'; // Gray for other events
  }
};

/**
 * Generate event type label with better type safety
 */
export const getEventTypeLabel = (type: string): string => {
  const typeLabels: Record<string, string> = {
    'exam': 'Avaliação',
    'class': 'Aula/Plano',
    'meeting': 'Reunião',
    'other': 'Outro'
  };
  
  return typeLabels[type] || type;
};

/**
 * Find related subject with proper type checking
 */
export const getRelatedSubject = (subjects: Subject[], subjectId?: string): Subject | undefined => {
  if (!subjectId) return undefined;
  return subjects.find(s => s.id === subjectId);
};
