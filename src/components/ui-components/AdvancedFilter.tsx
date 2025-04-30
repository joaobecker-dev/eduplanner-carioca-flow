
import React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
}

interface AdvancedFilterProps {
  filterGroups: FilterGroup[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  onClearFilters?: () => void;
  className?: string;
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  filterGroups,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Pesquisar...",
  onClearFilters,
  className = "",
}) => {
  const hasActiveFilters = searchQuery || filterGroups.some(group => group.value !== 'all');

  return (
    <div className={`flex flex-col md:flex-row gap-3 ${className}`}>
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" style={{ width: 18, height: 18 }} />
        <Input
          placeholder={searchPlaceholder}
          className="pl-10"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => onSearchChange('')}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        )}
      </div>
      
      {filterGroups.map((group) => (
        <DropdownMenu key={group.id}>
          <DropdownMenuTrigger asChild>
            <Button variant={group.value !== 'all' ? "default" : "outline"} className="flex items-center gap-2">
              {group.label}: {group.options.find(option => option.value === group.value)?.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filtrar por {group.label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={group.value} onValueChange={group.onChange}>
              {group.options.map(option => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
      
      {hasActiveFilters && onClearFilters && (
        <Button 
          variant="ghost" 
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={onClearFilters}
        >
          Limpar filtros
        </Button>
      )}
    </div>
  );
};

export default AdvancedFilter;
