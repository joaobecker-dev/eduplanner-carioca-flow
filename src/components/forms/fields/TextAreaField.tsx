
import React from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export interface TextAreaFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  placeholder: string;
  control: Control<T>;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

function TextAreaField<T extends FieldValues>({
  label,
  name,
  placeholder,
  control,
  disabled = false,
  rows,
  className,
}: TextAreaFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              disabled={disabled}
              className={className || "min-h-[100px]"}
              rows={rows}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default TextAreaField;
