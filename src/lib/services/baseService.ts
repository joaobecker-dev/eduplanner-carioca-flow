import { ID } from '@/types';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Helper function for error Handling
export const handleError = (error: any, operation: string): void => {
  console.error(`Error ${operation}:`, error);
  toast({
    title: `Erro ao ${operation}`,
    description: error.message || "Ocorreu um erro inesperado",
    variant: "destructive",
  });
};

// Type for valid table names
export type TableName = "academic_periods" | "subjects" | "annual_plans" | 
  "teaching_plans" | "lesson_plans" | "assessments" | "students" | 
  "student_assessments" | "calendar_events" | "materials";

// Create generic service for basic CRUD operations
export const createService = <T extends { id: ID }>(tableName: TableName) => {
  return {
    getAll: async (): Promise<T[]> => {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*');
        
        if (error) throw error;
        
        // Convert snake_case to camelCase without deep recursion
        if (!data) return [];
        
        return data.map(item => {
          const result: any = {};
          for (const key in item) {
            if (Object.prototype.hasOwnProperty.call(item, key)) {
              // Convert snake_case to camelCase
              const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
              result[camelKey] = item[key];
              
              // Keep original snake_case key for compatibility
              if (camelKey !== key) {
                result[key] = item[key];
              }
            }
          }
          return result as T;
        });
      } catch (error) {
        handleError(error, `buscar ${tableName}`);
        return [];
      }
    },
    
    getById: async (id: ID): Promise<T | null> => {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('id', id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (!data) return null;
        
        // Convert snake_case to camelCase without deep recursion
        const result: any = {};
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            // Convert snake_case to camelCase
            const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            result[camelKey] = data[key];
            
            // Keep original snake_case key for compatibility
            if (camelKey !== key) {
              result[key] = data[key];
            }
          }
        }
        
        return result as T;
      } catch (error) {
        handleError(error, `buscar ${tableName} por ID`);
        return null;
      }
    },
    
    create: async (item: Omit<T, 'id'>): Promise<T | null> => {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .insert(item as any)
          .select()
          .single();
        
        if (error) throw error;
        
        if (!data) return null;
        
        // Convert snake_case to camelCase without deep recursion
        const result: any = {};
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            // Convert snake_case to camelCase
            const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            result[camelKey] = data[key];
            
            // Keep original snake_case key for compatibility
            if (camelKey !== key) {
              result[key] = data[key];
            }
          }
        }
        
        return result as T;
      } catch (error) {
        handleError(error, `criar ${tableName}`);
        return null;
      }
    },
    
    update: async (id: ID, updates: Partial<T>): Promise<T | null> => {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .update(updates as any)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        
        if (!data) return null;
        
        // Convert snake_case to camelCase without deep recursion
        const result: any = {};
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            // Convert snake_case to camelCase
            const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            result[camelKey] = data[key];
            
            // Keep original snake_case key for compatibility
            if (camelKey !== key) {
              result[key] = data[key];
            }
          }
        }
        
        return result as T;
      } catch (error) {
        handleError(error, `atualizar ${tableName}`);
        return null;
      }
    },
    
    delete: async (id: ID): Promise<boolean> => {
      try {
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return true;
      } catch (error) {
        handleError(error, `excluir ${tableName}`);
        return false;
      }
    }
  };
};
