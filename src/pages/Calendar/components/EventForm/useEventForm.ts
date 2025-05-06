
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { EventFormValues, eventSchema, eventFormDefaults } from '@/schemas/eventSchema';
import { subjectService } from '@/lib/services';
import { useCalendarTheme } from '../CalendarThemeProvider';
import { EventFormProps } from './types';

export const useEventForm = ({ eventToEdit }: Pick<EventFormProps, 'eventToEdit'>) => {
  const { data: subjects = [], isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectService.getAll,
  });
  
  const { eventColors } = useCalendarTheme();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: eventFormDefaults
  });

  // When editing an existing event, populate the form
  useEffect(() => {
    if (eventToEdit) {
      form.reset({
        title: eventToEdit.title,
        description: eventToEdit.description || '',
        type: eventToEdit.type as any,
        startDate: new Date(eventToEdit.startDate),
        endDate: eventToEdit.endDate ? new Date(eventToEdit.endDate) : undefined,
        allDay: eventToEdit.allDay,
        color: eventToEdit.color || eventColors[eventToEdit.type] || eventColors.other,
        subjectId: eventToEdit.subjectId || '',
        location: eventToEdit.location || '',
        sourceType: eventToEdit.sourceType || 'manual',
        sourceId: eventToEdit.sourceId || '',
      });
    } else {
      form.reset(eventFormDefaults);
    }
  }, [eventToEdit, form, eventColors]);

  // Update color when type changes
  const watchType = form.watch('type');
  
  useEffect(() => {
    const newColor = eventColors[watchType as keyof typeof eventColors] || eventColors.other;
    form.setValue('color', newColor);
  }, [watchType, form, eventColors]);

  return {
    form,
    subjects,
    subjectsLoading
  };
};
