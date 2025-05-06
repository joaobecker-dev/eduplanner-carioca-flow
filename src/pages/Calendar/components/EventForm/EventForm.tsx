
import React from 'react';
import { EventFormValues } from '@/schemas/eventSchema';
import { CalendarEvent } from '@/types';
import EventFormContent from './EventFormContent';

interface EventFormProps {
  onSubmit: (values: EventFormValues) => Promise<void> | void;
  eventToEdit?: CalendarEvent | null;
  isSubmitting?: boolean;
  subjects?: any[];
}

const EventForm: React.FC<EventFormProps> = ({ 
  onSubmit, 
  eventToEdit, 
  isSubmitting,
  subjects 
}) => {
  return (
    <EventFormContent 
      onSubmit={onSubmit} 
      eventToEdit={eventToEdit}
      isSubmitting={isSubmitting}
      subjects={subjects}
    />
  );
};

export default EventForm;
