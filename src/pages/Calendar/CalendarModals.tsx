
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import EventForm from './components/EventForm/EventForm';
import { CalendarEvent, Subject } from '@/types';
import { toast } from '@/hooks/use-toast';
import { services } from '@/lib/services';
import { EventFormValues } from '@/schemas/eventSchema';

interface EventModalsProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  eventToEdit: CalendarEvent | null;
  onSuccess: () => void;
  subjects: Subject[];
}

const CalendarModals: React.FC<EventModalsProps> = ({
  isOpen,
  setIsOpen,
  eventToEdit,
  onSuccess,
  subjects
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: EventFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Create the event data
      const eventData: Omit<CalendarEvent, "id"> = {
        title: data.title,
        description: data.description || undefined,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate?.toISOString(),
        allDay: data.allDay || false,
        type: data.type,
        subjectId: data.subjectId && data.subjectId !== "none" ? data.subjectId : undefined,
        color: data.color || undefined,
        location: data.location || undefined,
        sourceType: data.sourceType,
        sourceId: data.sourceId,
        created_at: new Date().toISOString(), // Add created_at field
      };
      
      if (eventToEdit) {
        // Update existing event
        await services.calendarEvent.update(eventToEdit.id, eventData);
        toast({
          title: "Evento atualizado",
          description: "O evento foi atualizado com sucesso!",
        });
      } else {
        // Create new event
        await services.calendarEvent.create(eventData);
        toast({
          title: "Evento criado",
          description: "O evento foi criado com sucesso!",
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o evento.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{eventToEdit ? "Editar Evento" : "Criar Evento"}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <EventForm
            onSubmit={handleSubmit}
            eventToEdit={eventToEdit}
            isSubmitting={isSubmitting}
            subjects={subjects}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarModals;
