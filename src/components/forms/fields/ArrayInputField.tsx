
import React, { useState } from 'react';
import { Control, FieldValues, Path, useFieldArray } from 'react-hook-form';
import { PlusCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export interface ArrayInputFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  placeholder: string;
  control: Control<T>;
}

function ArrayInputField<T extends FieldValues>({
  label,
  name,
  placeholder,
  control,
}: ArrayInputFieldProps<T>) {
  const [newItem, setNewItem] = useState('');
  
  // Use useFieldArray to manage the array of items
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any,
  });

  const handleAddItem = () => {
    if (newItem.trim()) {
      append(newItem.trim() as any);
      setNewItem('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleAddItem}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        
        <FormMessage />
        
        <div className="space-y-2 mt-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <div className="bg-secondary text-secondary-foreground px-3 py-2 rounded-md flex-1 text-sm">
                {/* Fixed: accessing field value correctly */}
                {String(field) || ''}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {fields.length === 0 && (
            <div className="text-sm text-muted-foreground py-2">
              Sem itens. Adicione um novo item acima.
            </div>
          )}
        </div>
      </div>
    </FormItem>
  );
}

export default ArrayInputField;
