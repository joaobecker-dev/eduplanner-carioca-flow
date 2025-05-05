
import React from 'react';
import { Control } from 'react-hook-form';
import { EventFormValues } from '@/schemas/eventSchema';
import { Subject } from '@/types';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SubjectFieldProps {
  control: Control<EventFormValues>;
  subjects: Subject[];
}

const SubjectField: React.FC<SubjectFieldProps> = ({ control, subjects }) => {
  return (
    <FormField
      control={control}
      name="subjectId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Disciplina</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value || "none"}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma disciplina (opcional)" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="none">Nenhuma</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name} - {subject.grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SubjectField;
