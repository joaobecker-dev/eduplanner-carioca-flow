
import { format, parseISO } from "date-fns";

export const formatDate = (dateString: string, formatStr = "PP"): string => {
  if (!dateString) return "—";
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : dateString;
    return format(date, formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

export const formatNumber = (value: number, decimalPlaces = 2): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};
