
import { Material } from '@/types';
import { createService } from './baseService';
import { supabase } from '@/integrations/supabase/client';
import { mapToSnakeCase } from '@/integrations/supabase/supabaseAdapter';
import { extractVideoMetadata } from '@/lib/utils/extractVideoMetadata';
import { mapMaterialFromDb, mapMaterialToDb } from '@/lib/utils/dataMappers';

// Service for handling materials
export const materialService = {
  ...createService<Material>('materials'),

  // Override create to handle video thumbnails
  create: async (material: Omit<Material, 'id'>): Promise<Material | null> => {
    try {
      let materialToCreate = { ...material };

      // Process video URLs to extract thumbnails if needed
      if (material.type === 'video' && material.url) {
        const metadata = extractVideoMetadata(material.url);
        if (metadata.thumbnailUrl) {
          materialToCreate.thumbnailUrl = metadata.thumbnailUrl;
        }
        if (metadata.embedUrl) {
          materialToCreate.url = metadata.embedUrl;
        }
      }

      // Convert to snake_case for database using our new mapper
      const materialData = mapMaterialToDb(materialToCreate);

      // Make sure the record has required fields
      if (!materialData.title || !materialData.type) {
        throw new Error("Material must have at least a title and type");
      }

      const { data, error } = await supabase
        .from('materials')
        .insert(materialData)
        .select()
        .single();

      if (error) throw error;

      return data ? mapMaterialFromDb(data) : null;
    } catch (error) {
      console.error('Error creating material:', error);
      return null;
    }
  },

  // Override update to handle video thumbnails
  update: async (id: string, updates: Partial<Material>): Promise<Material | null> => {
    try {
      let updatesToApply = { ...updates };

      // Process video URLs to extract thumbnails if needed
      if (updates.type === 'video' && updates.url) {
        const metadata = extractVideoMetadata(updates.url);
        if (metadata.thumbnailUrl) {
          updatesToApply.thumbnailUrl = metadata.thumbnailUrl;
        }
        if (metadata.embedUrl) {
          updatesToApply.url = metadata.embedUrl;
        }
      }

      // Convert to snake_case for database using our new mapper
      const updateData = mapMaterialToDb(updatesToApply);

      const { data, error } = await supabase
        .from('materials')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data ? mapMaterialFromDb(data) : null;
    } catch (error) {
      console.error('Error updating material:', error);
      return null;
    }
  },
  
  // Method to get by id for detail page
  getById: async (id: string): Promise<Material | null> => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data ? mapMaterialFromDb(data) : null;
    } catch (error) {
      console.error('Error getting material by id:', error);
      return null;
    }
  }
};
