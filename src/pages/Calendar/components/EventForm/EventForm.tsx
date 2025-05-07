
import React from 'react';
import EventFormContent from './EventFormContent';
import { EventFormProps } from './types';

const EventForm: React.FC<EventFormProps> = ({ onSubmit, eventToEdit }) => {
  return (
    <div className="space-y-4">
      <EventFormContent
        onSubmit={onSubmit}
        eventToEdit={eventToEdit}
      />
    </div>
  );
};

export default EventForm;
