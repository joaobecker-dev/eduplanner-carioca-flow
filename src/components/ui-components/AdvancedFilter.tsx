
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";

export interface FilterOption<T = string> {
  label: string;
  value: T;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface AdvancedFilterProps {
  filterGroups: FilterGroup[];
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  onClearFilters?: () => void;
  className?: string;
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  filterGroups,
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Pesquisar...',
  onClearFilters,
  className = '',
}) => {
  const hasActiveFilters = filterGroups.some(group => group.value !== 'all') || searchQuery;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex flex-wrap gap-3">
        {onSearchChange && (
          <div className="relative flex-grow">
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        )}
        
        {filterGroups.map((group) => (
          <div key={group.id} className="min-w-[200px]">
            <Select
              value={group.value}
              onValueChange={group.onChange}
            >
              <SelectTrigger className="h-10">
                <div className="flex items-center gap-2">
                  {group.value !== 'all' && (
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  )}
                  <span className="truncate">{group.label}</span>
                </div>
                <SelectValue placeholder={group.label} />
              </SelectTrigger>
              <SelectContent>
                {group.options.map((option) => (
                  <SelectItem key={option.value?.toString()} value={option.value?.toString() || ''}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
        
        {hasActiveFilters && onClearFilters && (
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={onClearFilters}
          >
            <X size={16} />
            Limpar Filtros
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdvancedFilter;

// Import Search icon from lucide-react
function Search(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
