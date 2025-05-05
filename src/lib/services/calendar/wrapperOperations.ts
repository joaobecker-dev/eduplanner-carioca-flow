
import { supabase } from "@/integrations/supabase/client";
import { CalendarEvent, ID } from '@/types';
import { mapToCamelCase, mapToSnakeCase, normalizeToISO } from "@/integrations/supabase/supabaseAdapter";
import { handleError } from "../baseService";

// This is a wrapper function that can be used by basicOperations.ts
export async function deleteBySource(sourceType: string, sourceId: ID): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('source_type', sourceType)
      .eq('source_id', sourceId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    handleError(error, 'excluir eventos por fonte');
    return false;
  }
}

// Export this function to be imported by index.ts
export { deleteBySource as deleteBySourceEvent };
