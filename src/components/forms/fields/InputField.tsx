
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Path, FieldValues } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

export interface InputFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  description?: string;
  type?: "text" | "email" | "number" | "password";
  disabled?: boolean;
  className?: string;
}

function InputField<T extends FieldValues>({
  name,
  label,
  placeholder,
  description,
  type = "text",
  disabled = false,
  className,
}: InputFieldProps<T>) {
  const form = useFormContext<T>();
  
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(className)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default InputField;
