
import React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CalendarEvent } from '@/types';
import { EventFormValues } from '@/schemas/eventSchema';
import { normalizeToISO } from '@/integrations/supabase/supabaseAdapter';
import CrudModal from '@/components/ui-components/CrudModal';
import DeleteConfirmationDialog from '@/components/ui-components/DeleteConfirmationDialog';
import EventForm from './components/EventForm';
import EventDetailsModal from './components/EventDetailsModal';
import { calendarEventService } from '@/lib/services';

interface EventModalsProps {
  selectedEvent: CalendarEvent | null;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  showEventModal: boolean;
  setShowEventModal: (show: boolean) => void;
  showNewEventModal: boolean;
  setShowNewEventModal: (show: boolean) => void;
  eventToEdit: CalendarEvent | null;
  showDeleteConfirmation: boolean;
  setShowDeleteConfirmation: (show: boolean) => void;
  subjects: any[];
}

export const EventModals: React.FC<EventModalsProps> = ({
  selectedEvent,
  setSelectedEvent,
  showEventModal,
  setShowEventModal,
  showNewEventModal,
  setShowNewEventModal,
  eventToEdit,
  showDeleteConfirmation,
  setShowDeleteConfirmation,
  subjects
}) => {
  const queryClient = useQueryClient();

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (newEvent: Omit<CalendarEvent, "id" | "created_at">) => {
      return await calendarEventService.create(newEvent);
    },
    onSuccess: () => {
      toast.success("Evento criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      setShowNewEventModal(false);
    },
    onError: (error) => {
      console.error("Error creating event:", error);
      toast.error("Erro ao criar evento. Tente novamente.");
    }
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: async (updatedEvent: CalendarEvent) => {
      const { id, ...eventData } = updatedEvent;
      return await calendarEventService.update(id, eventData);
    },
    onSuccess: () => {
      toast.success("Evento atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      setShowNewEventModal(false);
    },
    onError: (error) => {
      console.error("Error updating event:", error);
      toast.error("Erro ao atualizar evento. Tente novamente.");
    }
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      return await calendarEventService.deleteEvent(eventId);
    },
    onSuccess: () => {
      toast.success("Evento excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      setShowDeleteConfirmation(false);
      setSelectedEvent(null);
    },
    onError: (error) => {
      console.error("Error deleting event:", error);
      toast.error("Erro ao excluir evento. Tente novamente.");
    }
  });

  // Handle form submission for both create and update
  const handleFormSubmit = async (values: EventFormValues) => {
    const eventData = {
      title: values.title,
      description: values.description || '',
      type: values.type,
      startDate: normalizeToISO(values.startDate) || '',
      endDate: normalizeToISO(values.endDate || values.startDate) || '',
      allDay: values.allDay,
      color: values.color,
      subjectId: values.subjectId || null,
      sourceType: 'manual',
      sourceId: null
    };

    if (eventToEdit) {
      updateEventMutation.mutate({
        ...eventData,
        id: eventToEdit.id,
        created_at: eventToEdit.created_at,
        location: eventToEdit.location,
        assessmentId: eventToEdit.assessmentId,
        lessonPlanId: eventToEdit.lessonPlanId,
        teachingPlanId: eventToEdit.teachingPlanId
      } as CalendarEvent);
    } else {
      createEventMutation.mutate(eventData as any);
    }
  };

  // Get the subject name for an event
  const getRelatedSubject = (subjectId?: string) => {
    if (!subjectId) return undefined;
    return subjects.find(s => s.id === subjectId);
  };

  // Get human-readable event type label
  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'class': 'Aula',
      'exam': 'Prova',
      'meeting': 'Reunião',
      'other': 'Outro',
      'deadline': 'Prazo'
    };
    return labels[type] || type;
  };

  return (
    <>
      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <EventDetailsModal
          isOpen={showEventModal}
          setIsOpen={setShowEventModal}
          selectedEvent={selectedEvent}
          handleEditEvent={() => {
            setSelectedEvent(null);
            setShowEventModal(false);
            setShowNewEventModal(true);
          }}
          handleDeleteEvent={() => {
            setShowEventModal(false);
            setShowDeleteConfirmation(true);
          }}
          getEventTypeLabel={getEventTypeLabel}
          getRelatedSubject={getRelatedSubject}
        />
      )}

      {/* Create/Edit Event Modal */}
      <CrudModal
        title={eventToEdit ? "Editar Evento" : "Novo Evento"}
        description="Preencha os detalhes do evento"
        isOpen={showNewEventModal}
        onClose={() => setShowNewEventModal(false)}
        onSubmit={(e) => e.preventDefault()}
        isLoading={createEventMutation.isPending || updateEventMutation.isPending}
      >
        <EventForm
          onSubmit={handleFormSubmit}
          eventToEdit={eventToEdit}
        />
      </CrudModal>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={() => selectedEvent && deleteEventMutation.mutate(selectedEvent.id)}
        title="Excluir Evento"
        description="Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita."
        isLoading={deleteEventMutation.isPending}
      />
    </>
  );
};

export default EventModals;
