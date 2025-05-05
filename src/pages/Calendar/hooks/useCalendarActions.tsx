import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { CalendarEvent } from '@/types';
import { services } from '@/lib/services';
import { EventFormValues } from '@/schemas/eventSchema';

const useCalendarActions = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createEvent = async (data: EventFormValues) => {
    try {
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
        created_at: new Date().toISOString(), // Add created_at field
      };

      setIsLoading(true);
      await services.calendarEvent.create(eventData);
      toast({
        title: "Evento criado",
        description: "O evento foi criado com sucesso!",
      });
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar evento",
        description: error.message || "Ocorreu um erro ao criar o evento.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateEvent = async (id: string, data: EventFormValues) => {
    try {
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
        created_at: new Date().toISOString(), // Add created_at field
      };

      setIsLoading(true);
      await services.calendarEvent.update(id, eventData);
      toast({
        title: "Evento atualizado",
        description: "O evento foi atualizado com sucesso!",
      });
    } catch (error: any) {
      console.error("Error updating event:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar evento",
        description: error.message || "Ocorreu um erro ao atualizar o evento.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      setIsLoading(true);
      await services.calendarEvent.delete(id);
      toast({
        title: "Evento excluído",
        description: "O evento foi excluído com sucesso!",
      });
    } catch (error: any) {
      console.error("Error deleting event:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir evento",
        description: error.message || "Ocorreu um erro ao excluir o evento.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { createEvent, updateEvent, deleteEvent, isLoading };
};

export default useCalendarActions;
