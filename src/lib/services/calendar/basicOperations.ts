
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '@/types';

// Import the simplified utility function to avoid recursive type checking
import { mapToCamelCase } from '@/lib/utils/caseConverters';
import { convertToCalendarEvent } from './types';

export const createEvent = async (event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
  const eventToInsert = {
    title: event.title,
    description: event.description,
    start_date: event.startDate,
    end_date: event.endDate,
    all_day: event.allDay,
    type: event.type,
    subject_id: event.subjectId,
    color: event.color,
    location: event.location,
    source_type: event.sourceType,
    source_id: event.sourceId,
    created_at: event.created_at || new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('calendar_events')
    .insert(eventToInsert)
    .select()
    .single();

  if (error) throw new Error(`Error creating event: ${error.message}`);
  
  // Use the data returned from Supabase which includes the id
  return { 
    id: data.id,
    ...convertToCalendarEvent(data)
  };
};

export const updateEvent = async (id: string, event: Partial<Omit<CalendarEvent, 'id'>>): Promise<CalendarEvent> => {
  // Use explicit field mapping to avoid recursive type issues
  const eventToUpdate: Record<string, any> = {};
  
  if (event.title !== undefined) eventToUpdate.title = event.title;
  if (event.description !== undefined) eventToUpdate.description = event.description;
  if (event.startDate !== undefined) eventToUpdate.start_date = event.startDate;
  if (event.endDate !== undefined) eventToUpdate.end_date = event.endDate;
  if (event.allDay !== undefined) eventToUpdate.all_day = event.allDay;
  if (event.type !== undefined) eventToUpdate.type = event.type;
  if (event.subjectId !== undefined) eventToUpdate.subject_id = event.subjectId;
  if (event.color !== undefined) eventToUpdate.color = event.color;
  if (event.location !== undefined) eventToUpdate.location = event.location;
  if (event.sourceType !== undefined) eventToUpdate.source_type = event.sourceType;
  if (event.sourceId !== undefined) eventToUpdate.source_id = event.sourceId;
  
  const { data, error } = await supabase
    .from('calendar_events')
    .update(eventToUpdate)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Error updating event: ${error.message}`);
  
  // Return the full event with id
  return { 
    id: data.id,
    ...convertToCalendarEvent(data)
  };
};

// Add the deleteBySource function to fix the reference in wrapperOperations.ts
export const deleteBySource = async (sourceType: string, sourceId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('source_type', sourceType)
      .eq('source_id', sourceId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting events by source (${sourceType}/${sourceId}):`, error);
    return false;
  }
};

// Export aliases for functions required by syncOperations.ts
export const createCalendarEvent = createEvent;
export const updateCalendarEvent = updateEvent;
