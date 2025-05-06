import { mapToCamelCase, mapToSnakeCase } from '@/lib/utils/dataMappers';
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '@/types';

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
  
  return mapToCamelCase(data) as CalendarEvent;
};

export const updateEvent = async (id: string, event: Partial<Omit<CalendarEvent, 'id'>>): Promise<CalendarEvent> => {
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
  
  return mapToCamelCase(data) as CalendarEvent;
};
