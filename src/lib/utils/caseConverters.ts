import { ID } from '@/types';

/**
 * Converts an object with snake_case keys to camelCase keys
 * This is a non-recursive implementation to prevent TS2589 errors (excessively deep type instantiation)
 * 
 * @param data Object with snake_case keys from Supabase
 * @returns Object with camelCase keys, preserving original snake_case keys for compatibility
 */
export function mapToCamelCase<T extends Record<string, any>>(data: Record<string, any>): T {
  // Return early for null, undefined, or non-object values
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return data as T;
  }
  
  const result: Record<string, any> = {};
  
  // Process each key in the object
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
}

/**
 * Converts an array of objects with snake_case keys to objects with camelCase keys
 * 
 * @param dataArray Array of objects with snake_case keys
 * @returns Array of objects with camelCase keys
 */
export function mapArrayToCamelCase<T extends Record<string, any>>(dataArray: Record<string, any>[]): T[] {
  if (!Array.isArray(dataArray)) {
    return [] as T[];
  }
  
  return dataArray.map(item => mapToCamelCase<T>(item));
}

/**
 * Optional deep conversion utility for nested objects
 * Use with caution to avoid excessive type instantiation (TS2589)
 * Only use when you know the structure has a limited nesting depth
 * 
 * @param data Object with potentially nested snake_case keys
 * @param depth Maximum recursion depth to prevent infinite recursion
 * @returns Object with camelCase keys, including in nested objects
 */
export function mapToCamelCaseDeep<T extends Record<string, any>>(
  data: Record<string, any>,
  depth: number = 3
): T {
  // Return early for null, undefined, non-objects, or exceeded depth
  if (!data || typeof data !== 'object' || depth <= 0) {
    return data as T;
  }
  
  // Handle arrays differently
  if (Array.isArray(data)) {
    return (depth > 1 
      ? data.map(item => typeof item === 'object' && item !== null 
        ? mapToCamelCaseDeep(item, depth - 1) 
        : item)
      : data) as T;
  }
  
  const result: Record<string, any> = {};
  
  // Process each key in the object
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      // Convert snake_case to camelCase
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      
      // Recursively process nested objects if depth allows
      const value = data[key];
      result[camelKey] = (typeof value === 'object' && value !== null && depth > 1)
        ? mapToCamelCaseDeep(value, depth - 1)
        : value;
      
      // Keep original snake_case key for compatibility
      if (camelKey !== key) {
        result[key] = value;
      }
    }
  }
  
  return result as T;
}

/**
 * Type helper for snake_case to camelCase conversion for specific entities
 * Provides better type safety than generic implementations
 */
export function mapTypedEntity<T>(data: Record<string, any>): T {
  return mapToCamelCase<T>(data);
}
