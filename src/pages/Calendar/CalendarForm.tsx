
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarEvent } from '@/types';
import { EventFormValues } from '@/schemas/eventSchema';
import EventForm from './components/EventForm';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: CalendarEvent | null;
}

export const EventForm: React.FC<EventFormModalProps> = ({ isOpen, onClose, eventToEdit }) => {
  const handleSubmit = async (values: EventFormValues) => {
    // This will be handled by parent components
    console.log("Form submitted with values:", values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{eventToEdit ? "Editar Evento" : "Novo Evento"}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <EventForm 
            onSubmit={handleSubmit}
            eventToEdit={eventToEdit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;
