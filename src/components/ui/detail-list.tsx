
import React from "react";

interface DetailListProps {
  items: string[];
  emptyMessage?: string;
}

export function DetailList({ items, emptyMessage = "Nenhum item informado" }: DetailListProps) {
  if (!items || items.length === 0) {
    return <p className="text-gray-500 italic">{emptyMessage}</p>;
  }

  return (
    <ul className="list-disc pl-5 space-y-1">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
