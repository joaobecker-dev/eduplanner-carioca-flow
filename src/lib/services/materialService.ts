
import { Material } from '@/types';
import { createService } from './baseService';
import { supabase } from '@/integrations/supabase/client';
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

      // Convert to snake_case for database using our mapper
      const materialData = mapMaterialToDb(materialToCreate);

      // Make sure the record has required fields
      if (!materialData.title || !materialData.type) {
        throw new Error("Material must have at least a title and type");
      }

      // Create an object with all required fields explicitly defined
      const dbMaterial = {
        title: materialData.title,
        type: materialData.type,
        description: materialData.description || null,
        url: materialData.url || null,
        file_path: materialData.file_path || null,
        file_size: materialData.file_size || null,
        thumbnail_url: materialData.thumbnail_url || null,
        subject_id: materialData.subject_id || null,
        tags: materialData.tags || []
      };

      const { data, error } = await supabase
        .from('materials')
        .insert(dbMaterial)
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

      // Convert to snake_case for database using our mapper
      const updateData = mapMaterialToDb(updatesToApply);

      // Create an explicitly typed update object with only defined fields
      const dbUpdateData: Record<string, any> = {};
      
      if (updateData.title !== undefined) dbUpdateData.title = updateData.title;
      if (updateData.type !== undefined) dbUpdateData.type = updateData.type;
      if (updateData.description !== undefined) dbUpdateData.description = updateData.description;
      if (updateData.url !== undefined) dbUpdateData.url = updateData.url;
      if (updateData.file_path !== undefined) dbUpdateData.file_path = updateData.file_path;
      if (updateData.file_size !== undefined) dbUpdateData.file_size = updateData.file_size;
      if (updateData.thumbnail_url !== undefined) dbUpdateData.thumbnail_url = updateData.thumbnail_url;
      if (updateData.subject_id !== undefined) dbUpdateData.subject_id = updateData.subject_id;
      if (updateData.tags !== undefined) dbUpdateData.tags = updateData.tags;

      const { data, error } = await supabase
        .from('materials')
        .update(dbUpdateData)
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
