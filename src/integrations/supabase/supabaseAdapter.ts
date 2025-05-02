export const normalizeToISO = (value: Date | string | undefined | null): string | null => {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : value;
};

export function convertDatesToISO<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result = { ...obj };
  
  // Use type-safe approach to handle generic Record
  Object.keys(result).forEach(key => {
    const value = result[key];
    if (value instanceof Date) {
      result[key] = value.toISOString();
    }
  });
  
  return result;
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
