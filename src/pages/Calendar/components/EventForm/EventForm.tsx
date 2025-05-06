
import React from 'react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useEventForm } from './useEventForm';
import { EventFormContent } from './EventFormContent';
import { EventFormProps } from './types';

export const EventForm = ({ 
  eventToEdit, 
  onSubmit, 
  onCancel, 
  submitBtnText = "Salvar",
  cancelBtnText = "Cancelar"
}: EventFormProps) => {
  const { form, subjects, subjectsLoading } = useEventForm({ eventToEdit });

  // Make sure onSubmit always returns a Promise
  const handleSubmit = async (values: any) => {
    try {
      return await Promise.resolve(onSubmit(values));
    } catch (error) {
      console.error("Error in event form submission:", error);
      throw error;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <EventFormContent 
          form={form}
          subjects={subjects}
          loading={subjectsLoading}
        />
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {cancelBtnText}
            </Button>
          )}
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {submitBtnText}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;
