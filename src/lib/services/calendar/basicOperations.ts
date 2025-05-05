
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '@/types';
import { mapToCamelCase, mapToSnakeCase } from '@/integrations/supabase/supabaseAdapter';

export async function getAllEvents(): Promise<CalendarEvent[]> {
  try {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*');

    if (error) throw error;

    return data?.map(event => mapToCamelCase(event) as CalendarEvent) || [];
  } catch (error) {
    console.error('Error fetching calendar events', error);
    throw error;
  }
}

export async function getById(id: string): Promise<CalendarEvent | null> {
  try {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    return data ? mapToCamelCase(data) as CalendarEvent : null;
  } catch (error) {
    console.error('Error fetching calendar event by id', error);
    throw error;
  }
}

export async function create(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent | null> {
  try {
    const eventData = mapToSnakeCase(event);
    
    const { data, error } = await supabase
      .from('calendar_events')
      .insert(eventData)
      .select()
      .single();
      
    if (error) throw error;
    
    return data ? mapToCamelCase(data) as CalendarEvent : null;
  } catch (error) {
    console.error('Error creating calendar event', error);
    throw error;
  }
}

export async function update(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent | null> {
  try {
    const updateData = mapToSnakeCase(updates);
    
    const { data, error } = await supabase
      .from('calendar_events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return data ? mapToCamelCase(data) as CalendarEvent : null;
  } catch (error) {
    console.error('Error updating calendar event', error);
    throw error;
  }
}

export async function remove(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting calendar event', error);
    throw error;
  }
}

// Function to delete calendar events by source type and ID
export async function deleteBySource(sourceType: string, sourceId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq(sourceType + '_id', sourceId);

    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting calendar events for ${sourceType}:${sourceId}`, error);
    throw error;
  }
}
