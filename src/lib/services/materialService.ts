
import { Material, ID } from '@/types';
import { createService, handleError } from './baseService';
import { supabase } from "@/integrations/supabase/client";
import { mapToCamelCase } from '@/lib/utils/caseConverters';
import { extractVideoMetadata } from '@/lib/utils/extractVideoMetadata';

// Define valid material types for TypeScript validation
export type MaterialType = "document" | "video" | "link" | "image" | "other";

// Material Service
export const materialService = {
  ...createService<Material>("materials"),
  
  // Create a new material with video metadata extraction if applicable
  create: async (material: Partial<Material>): Promise<Material> => {
    try {
      // Process video URLs for YouTube and Vimeo
      if (material.type === 'video' && material.url) {
        const metadata = extractVideoMetadata(material.url);
        if (metadata.embedUrl) {
          material.url = metadata.embedUrl;
        }
        if (metadata.thumbnailUrl) {
          material.thumbnailUrl = metadata.thumbnailUrl;
        }
      }
      
      const { data, error } = await supabase
        .from("materials")
        .insert(material)
        .select()
        .single();
      
      if (error) throw error;
      return mapToCamelCase<Material>(data);
    } catch (error) {
      handleError(error, 'criar material');
      throw error;
    }
  },
  
  // Update a material with video metadata extraction if applicable
  update: async (id: ID, material: Partial<Material>): Promise<Material> => {
    try {
      // Process video URLs for YouTube and Vimeo
      if (material.type === 'video' && material.url) {
        const metadata = extractVideoMetadata(material.url);
        if (metadata.embedUrl) {
          material.url = metadata.embedUrl;
        }
        if (metadata.thumbnailUrl) {
          material.thumbnailUrl = metadata.thumbnailUrl;
        }
      }
      
      const { data, error } = await supabase
        .from("materials")
        .update(material)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return mapToCamelCase<Material>(data);
    } catch (error) {
      handleError(error, 'atualizar material');
      throw error;
    }
  },
  
  // Get all materials for a specific subject
  getBySubject: async (subjectId: ID): Promise<Material[]> => {
    try {
      const { data, error } = await supabase
        .from("materials")
        .select('*')
        .eq('subject_id', subjectId);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<Material>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar materiais por disciplina');
      return [];
    }
  },
  
  // Get all materials by type
  getByType: async (type: MaterialType): Promise<Material[]> => {
    try {
      const { data, error } = await supabase
        .from("materials")
        .select('*')
        .eq('type', type);
      
      if (error) throw error;
      return data ? data.map(item => mapToCamelCase<Material>(item)) : [];
    } catch (error) {
      handleError(error, 'buscar materiais por tipo');
      return [];
    }
  },
  
  // Search materials by query in title, description or tags
  search: async (query: string): Promise<Material[]> => {
    try {
      const { data, error } = await supabase
        .from("materials")
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      
      if (error) throw error;
      
      // We need to filter manually for tags since it's an array column
      const filteredData = data.filter(material => 
        material.tags.some((tag: string) => 
          tag.toLowerCase().includes(query.toLowerCase())
        )
      );
      
      return filteredData.map(item => mapToCamelCase<Material>(item));
    } catch (error) {
      handleError(error, 'buscar materiais');
      return [];
    }
  }
};
