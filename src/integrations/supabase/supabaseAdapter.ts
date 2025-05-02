
/**
 * Supabase adapter utilities for converting between camelCase and snake_case
 * These functions help maintain compatibility between frontend (camelCase) and 
 * Supabase database (snake_case) naming conventions.
 */

type RecordObject = Record<string, any>;

/**
 * Converts object keys from camelCase to snake_case
 * @param item Object with camelCase keys
 * @returns Object with snake_case keys
 */
export function mapToSnakeCase<T>(item: RecordObject): T {
  if (!item || typeof item !== 'object' || Object.keys(item).length === 0) {
    return {} as T;
  }
  
  return Object.keys(item).reduce((acc, key) => {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    
    // Handle special case for referenceMaterials -> reference_materials
    const finalKey = key === 'referenceMaterials' ? 'reference_materials' : snakeKey;
    
    // Handle nested objects and arrays
    let value = item[key];
    if (value !== null && typeof value === 'object') {
      if (Array.isArray(value)) {
        value = value.map(item => 
          typeof item === 'object' && item !== null ? mapToSnakeCase(item) : item
        );
      } else {
        value = mapToSnakeCase(value);
      }
    }
    
    acc[finalKey] = value;
    return acc;
  }, {} as RecordObject) as T;
}

/**
 * Converts object keys from snake_case to camelCase
 * @param item Object with snake_case keys
 * @returns Object with camelCase keys
 */
export function mapToCamelCase<T>(item: RecordObject): T {
  if (!item || typeof item !== 'object' || Object.keys(item).length === 0) {
    return {} as T;
  }
  
  return Object.keys(item).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    
    // Handle special case for reference_materials -> referenceMaterials
    const finalKey = key === 'reference_materials' ? 'referenceMaterials' : camelKey;
    
    // Handle nested objects and arrays
    let value = item[key];
    if (value !== null && typeof value === 'object') {
      if (Array.isArray(value)) {
        value = value.map(item => 
          typeof item === 'object' && item !== null ? mapToCamelCase(item) : item
        );
      } else {
        value = mapToCamelCase(value);
      }
    }
    
    acc[finalKey] = value;
    return acc;
  }, {} as RecordObject) as T;
}

/**
 * Safely converts a Date or ISO string to a standardized ISO string format
 * @param input A Date object or ISO string
 * @returns ISO string or undefined
 */
export function normalizeToISO(input?: string | Date | null): string | undefined {
  if (!input) return undefined;
  if (typeof input === "string") return input;
  if (input instanceof Date) return input.toISOString();
  return undefined;
}

/**
 * Converts a Date object to ISO string safely
 * @param date A Date object
 * @returns ISO string or undefined
 */
export function toISO(date?: Date | null): string | undefined {
  return date instanceof Date ? date.toISOString() : undefined;
}

/**
 * Format a date for display using locale formatting
 * @param date Date object or ISO string
 * @param format Optional format string to override default
 * @returns Formatted date string or empty string if date is invalid
 */
export function formatDisplayDate(date?: string | Date | null, format?: string): string {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    // Check if date is valid
    if (isNaN(dateObj.getTime())) return '';
    return dateObj.toLocaleDateString('pt-BR');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}
