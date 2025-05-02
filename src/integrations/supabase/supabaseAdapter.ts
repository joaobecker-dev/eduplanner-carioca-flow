
export const normalizeToISO = (value: Date | string | undefined | null): string | null => {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : value;
};

export function convertDatesToISO<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result = { ...obj };
  
  // Use type-safe approach to handle generic Record
  Object.keys(result).forEach(key => {
    const value = result[key as keyof typeof result];
    if (value instanceof Date) {
      (result as Record<string, any>)[key] = value.toISOString();
    }
  });
  
  return result;
}

// Alias for normalizeToISO function for backward compatibility
export const toISO = normalizeToISO;

// Add mapToCamelCase and mapToSnakeCase functions
export function mapToCamelCase<T>(obj: Record<string, any>): T {
  const newObj: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    newObj[camelKey] = obj[key];
  });
  
  return newObj as T;
}

export function mapToSnakeCase<T>(obj: Record<string, any>): Record<string, any> {
  const newObj: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    newObj[snakeKey] = obj[key];
  });
  
  return newObj;
}

export const formatDisplayDate = (isoDateString: string): string => {
  try {
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'Data inválida';
  }
};
