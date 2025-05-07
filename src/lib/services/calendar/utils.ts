
import { CalendarEvent } from '@/types';
import { mapToCamelCase } from '@/lib/utils/caseConverters';

/**
 * Maps a calendar event from snake_case to camelCase without recursive type issues
 */
export const mapToCamelCaseEvent = (event: any): CalendarEvent => {
  return mapToCamelCase(event) as CalendarEvent;
};
