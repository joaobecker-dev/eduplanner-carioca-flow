
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent, ID } from '@/types';
import { mapToCamelCase } from "@/integrations/supabase/supabaseAdapter";
import { mapToSnakeCase, handleError } from "../baseService";

// Set the table name for calendar events
const tableName = 'calendar_events';

/**
 * Create a new calendar event
 */
export async function create(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent | null> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .insert(mapToSnakeCase(event))
      .select()
      .single();
    
    if (error) throw error;
    return mapToCamelCase<CalendarEvent>(data);
  } catch (error) {
    handleError(error, 'criar evento de calendário');
    return null;
  }
}

/**
 * Update a calendar event
 */
export async function update(id: ID, event: Partial<CalendarEvent>): Promise<CalendarEvent | null> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .update(mapToSnakeCase(event))
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapToCamelCase<CalendarEvent>(data);
  } catch (error) {
    handleError(error, 'atualizar evento de calendário');
    return null;
  }
}

/**
 * Delete a calendar event
 */
export async function deleteEvent(id: ID): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    handleError(error, 'excluir evento de calendário');
    return false;
  }
}

/**
 * Get a calendar event by ID
 */
export async function getById(id: ID): Promise<CalendarEvent | null> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data ? mapToCamelCase<CalendarEvent>(data) : null;
  } catch (error) {
    handleError(error, 'buscar evento de calendário por ID');
    return null;
  }
}

/**
 * Delete calendar events by source
 */
export async function deleteBySource(sourceType: string, sourceId: ID): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('source_type', sourceType)
      .eq('source_id', sourceId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    handleError(error, 'excluir eventos por origem');
    return false;
  }
}

/**
 * Get all calendar events
 */
export async function getAll(): Promise<CalendarEvent[]> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*');
    
    if (error) throw error;
    return data ? data.map(item => mapToCamelCase<CalendarEvent>(item)) : [];
  } catch (error) {
    handleError(error, 'buscar todos os eventos de calendário');
    return [];
  }
}
