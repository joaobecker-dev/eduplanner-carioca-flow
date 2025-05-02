
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDate(date: Date | string | undefined | null): string {
  if (!date) return "–";
  
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Data inválida";
  }
}
