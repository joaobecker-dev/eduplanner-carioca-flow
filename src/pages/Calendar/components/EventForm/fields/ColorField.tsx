
import React from 'react';
import { Control } from 'react-hook-form';
import { EventFormValues } from '@/schemas/eventSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface ColorFieldProps {
  control: Control<EventFormValues>;
}

const ColorField: React.FC<ColorFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="color"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cor</FormLabel>
          <FormControl>
            <div className="flex items-center space-x-2">
              <input 
                type="color" 
                className="w-10 h-10 rounded cursor-pointer" 
                value={field.value || "#3b82f6"} 
                onChange={field.onChange} 
              />
              <Input 
                value={field.value || "#3b82f6"} 
                onChange={field.onChange} 
                className="flex-grow"
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ColorField;
