
import React from 'react';
import { EventFormProps } from './types';
import EventFormContent from './EventFormContent';

const EventForm: React.FC<EventFormProps> = ({ onSubmit, eventToEdit }) => {
  return <EventFormContent onSubmit={onSubmit} eventToEdit={eventToEdit} />;
};

export default EventForm;
