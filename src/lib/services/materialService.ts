
import { Material } from '@/types';
import { createService } from './baseService';
import { supabase } from '@/integrations/supabase/client';
import { mapToCamelCase, mapToSnakeCase } from '@/integrations/supabase/supabaseAdapter';
import { extractVideoMetadata } from '@/lib/utils/extractVideoMetadata';

// Service for handling materials
export const materialService = {
  ...createService<Material>('materials'),

  // Get material by ID
  getMaterialById: async (id: string): Promise<Material | null> => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? mapToCamelCase<Material>(data) : null;
    } catch (error) {
      console.error('Error fetching material:', error);
      return null;
    }
  },

  // Update material notes
  updateMaterialNotes: async (id: string, notes: string): Promise<Material | null> => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .update({ notes })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data ? mapToCamelCase<Material>(data) : null;
    } catch (error) {
      console.error('Error updating material notes:', error);
      return null;
    }
  },

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

      // Convert to snake_case for database
      const materialData = mapToSnakeCase(materialToCreate);

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

      return data ? mapToCamelCase<Material>(data) : null;
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

      // Convert to snake_case for database
      const updateData = mapToSnakeCase(updatesToApply);

      const { data, error } = await supabase
        .from('materials')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data ? mapToCamelCase<Material>(data) : null;
    } catch (error) {
      console.error('Error updating material:', error);
      return null;
    }
  }
};
