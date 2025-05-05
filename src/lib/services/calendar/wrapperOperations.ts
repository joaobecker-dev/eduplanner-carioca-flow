
// Fix the type instantiation issue in the wrapperOperations.ts file

import { CalendarEvent, ID } from '@/types';
import { handleError } from "../baseService";
import { basicOperations } from "./basicOperations";

// Simplified version of the calendar sync function to avoid deep type instantiations
export const wrapperOperations = {
  // Wrapper for deleteBySource to avoid deep type instantiation
  deleteBySource: async (sourceType: string, sourceId: string): Promise<void> => {
    try {
      await basicOperations.deleteBySource(sourceType, sourceId);
    } catch (error) {
      handleError(error, 'excluir eventos do calendário');
    }
  },
  
  // The rest of the wrapper operations
};
