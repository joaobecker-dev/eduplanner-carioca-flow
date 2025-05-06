
import { EventSourceType } from '@/types/database';
import { handleError } from "../baseService";
import { deleteBySource } from "./basicOperations";

// Simplified version of the calendar sync function to avoid deep type instantiations
export const wrapperOperations = {
  // Wrapper for deleteBySource to avoid deep type instantiation
  deleteBySource: async (sourceType: EventSourceType, sourceId: string): Promise<void> => {
    try {
      // Use the explicitly imported function from basicOperations
      await deleteBySource(sourceType, sourceId);
    } catch (error) {
      handleError(error, 'excluir eventos do calendário');
    }
  },
  
  // The rest of the wrapper operations
};

// Export a function that can be imported by index.ts
export const deleteBySourceEvent = wrapperOperations.deleteBySource;
