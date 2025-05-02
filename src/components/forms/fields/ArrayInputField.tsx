
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ArrayInputFieldProps {
  name: string;
  label: string;
  placeholder: string;
}

const ArrayInputField: React.FC<ArrayInputFieldProps> = ({
  name,
  label,
  placeholder,
}) => {
  const [newItem, setNewItem] = useState<string>('');
  const { control, getValues, setValue } = useFormContext();

  const addItem = () => {
    if (newItem.trim()) {
      const currentItems = getValues(name) || [];
      setValue(name, [...currentItems, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    const currentItems = getValues(name) || [];
    setValue(name, currentItems.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex space-x-2">
            <Input
              placeholder={placeholder}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              type="button"
              onClick={addItem}
              variant="secondary"
            >
              <Plus size={16} />
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {field.value?.map((item: string, index: number) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-2 py-1 text-sm flex items-center gap-1"
              >
                {item}
                <X
                  size={14}
                  className="cursor-pointer text-gray-500 hover:text-red-500"
                  onClick={() => removeItem(index)}
                />
              </Badge>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ArrayInputField;
