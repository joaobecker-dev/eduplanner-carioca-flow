
import React from "react";

interface DetailFieldProps {
  label: string;
  value: React.ReactNode;
}

export function DetailField({ label, value }: DetailFieldProps) {
  const displayValue = value === null || value === undefined || value === "" 
    ? "–" 
    : value;
    
  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-500">{label}</h4>
      <div className="mt-1">{displayValue}</div>
    </div>
  );
}
