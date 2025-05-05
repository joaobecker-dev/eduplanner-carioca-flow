
import { CalendarEvent, ID } from '@/types';
import { handleError } from '../baseService';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCaseEvent, prepareEventData } from './utils';
import { CalendarEventDatabaseFields } from './types';

// Basic CRUD operations
export const getAll = async (): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from("calendar_events")
      .select('*');
    
    if (error) throw error;
    return data ? data.map(mapToCamelCaseEvent) : [];
  } catch (error) {
    handleError(error, 'buscar eventos do calendário');
    return [];
  }
};

export const getById = async (id: ID): Promise<CalendarEvent | null> => {
  try {
    const { data, error } = await supabase
      .from("calendar_events")
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data ? mapToCamelCaseEvent(data) : null;
  } catch (error) {
    handleError(error, 'buscar evento do calendário por ID');
    return null;
  }
};

// Delete methods
export const deleteEvent = async (id: ID): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("calendar_events")
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    handleError(error, 'excluir evento do calendário');
    return false;
  }
};

export const deleteBySource = async (sourceType: string, sourceId: ID): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("calendar_events")
      .delete()
      .eq('source_type', sourceType)
      .eq('source_id', sourceId);

    if (error) throw error;
    return true;
  } catch (error) {
    handleError(error, `excluir eventos do calendário por fonte (${sourceType})`);
    return false;
  }
};

// Fixed create operation with proper typing to avoid excessive type instantiation
export const create = async (eventData: Partial<CalendarEvent>): Promise<CalendarEvent | null> => {
  try {
    // Use the utility function with explicit typing
    const preparedData = prepareEventData(eventData);

    if (!preparedData.title || !preparedData.type || !preparedData.start_date) {
      throw new Error("Missing required fields for calendar event");
    }

    const { data, error } = await supabase
      .from("calendar_events")
      .insert(preparedData)
      .select()
      .single();

    if (error) throw error;
    return data ? mapToCamelCaseEvent(data) : null;
  } catch (error) {
    handleError(error, 'criar evento do calendário');
    throw error;
  }
};

// Fixed update operation with proper typing
export const update = async (id: ID, eventData: Partial<CalendarEvent>): Promise<CalendarEvent | null> => {
  try {
    // Use the utility function with explicit typing
    const updateData = prepareEventData(eventData);

    const { data, error } = await supabase
      .from("calendar_events")
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data ? mapToCamelCaseEvent(data) : null;
  } catch (error) {
    handleError(error, 'atualizar evento do calendário');
    throw error;
  }
};
