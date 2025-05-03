
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Path, FieldValues } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface SelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder: string;
  options: { label: string; value: string }[];
  description?: string;
  disabled?: boolean;
  className?: string;
  onValueChange?: (value: string) => void;
}

function SelectField<T extends FieldValues>({
  name,
  label,
  placeholder,
  options,
  description,
  disabled = false,
  className,
  onValueChange,
}: SelectFieldProps<T>) {
  const form = useFormContext<T>();
  
  // Filter out options with Empty string values to prevent the Radix UI error
  const validOptions = options.filter(option => option.value.trim() !== '');
  
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(className)}>
          <FormLabel>{label}</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              if (onValueChange) {
                onValueChange(value);
              }
            }}
            defaultValue={field.value} 
            disabled={disabled}
            value={field.value || undefined}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {validOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value || 'none'} // Ensure no empty string values
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default SelectField;
