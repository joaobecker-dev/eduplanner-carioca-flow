
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { EventFormProps } from './types';
import { useEventForm } from './useEventForm';
import BasicInfoFields from './fields/BasicInfoFields';
import DateTimeFields from './fields/DateTimeFields';
import SubjectField from './fields/SubjectField';
import ColorField from './fields/ColorField';

const EventFormContent: React.FC<EventFormProps> = ({ onSubmit, eventToEdit }) => {
  const { form, subjects } = useEventForm({ eventToEdit });

  const handleFormSubmit = async (values: any) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <BasicInfoFields control={form.control} />
        <DateTimeFields control={form.control} />
        <SubjectField control={form.control} subjects={subjects} />
        <ColorField control={form.control} />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {eventToEdit ? "Atualizar Evento" : "Criar Evento"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventFormContent;
