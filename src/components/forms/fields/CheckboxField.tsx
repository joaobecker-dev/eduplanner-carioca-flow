
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Path, FieldValues } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

export interface CheckboxFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

function CheckboxField<T extends FieldValues>({
  name,
  label,
  description,
  disabled = false,
  className,
}: CheckboxFieldProps<T>) {
  const form = useFormContext<T>();
  
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-row items-start space-x-3 space-y-0 rounded-md p-1", className)}>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="cursor-pointer">{label}</FormLabel>
            {description && (
              <FormDescription>{description}</FormDescription>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default CheckboxField;
