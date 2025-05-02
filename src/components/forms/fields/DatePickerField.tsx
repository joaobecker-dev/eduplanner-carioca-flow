
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { Path, FieldValues } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

interface DatePickerFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  disabledBefore?: Date;
  disabledAfter?: Date;
  disabledDates?: (date: Date) => boolean;
  className?: string;
}

function DatePickerField<T extends FieldValues>({
  name,
  label,
  placeholder = "Select a date",
  description,
  disabled = false,
  disabledBefore,
  disabledAfter,
  disabledDates,
  className,
}: DatePickerFieldProps<T>) {
  const form = useFormContext<T>();

  const getDisabledDates = (date: Date) => {
    if (disabledBefore && date < disabledBefore) {
      return true;
    }
    if (disabledAfter && date > disabledAfter) {
      return true;
    }
    if (disabledDates) {
      return disabledDates(date);
    }
    return false;
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", className)}>
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={disabled}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    format(new Date(field.value), "PPP", { locale: ptBR })
                  ) : (
                    <span>{placeholder}</span>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={field.onChange}
                disabled={getDisabledDates}
                initialFocus
                locale={ptBR}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default DatePickerField;
