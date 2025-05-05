
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CalendarEvent } from '@/types';
import { calendarEventService } from '@/lib/services';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';

export const useCalendarActions = () => {
  const queryClient = useQueryClient();
  
  // State for event details modal
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  
  // State for new/edit event modal
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);
  
  // State for delete confirmation
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle event click
  const handleEventClick = (info: EventClickArg) => {
    const event = info.event.extendedProps as CalendarEvent;
    if (event) {
      setSelectedEvent(event);
      setShowEventModal(true);
    } else {
      toast.error('Evento não encontrado.');
    }
  };

  // Handle date select for creating new events
  const handleDateSelect = (arg: DateSelectArg) => {
    if (!arg.start) {
      toast.error('Data de início inválida.');
      return;
    }

    // Create a new event with default values
    setEventToEdit(null);
    setShowNewEventModal(true);
  };

  // Handle edit button click in event details modal
  const handleEditEvent = () => {
    setEventToEdit(selectedEvent);
    setShowEventModal(false);
    setShowNewEventModal(true);
  };

  // Handle saving a new or edited event
  const handleSaveEvent = async (eventData: Omit<CalendarEvent, 'id' | 'created_at'>) => {
    try {
      if (eventToEdit) {
        // Update existing event
        await calendarEventService.update(eventToEdit.id, eventData);
        toast.success('Evento atualizado com sucesso!');
      } else {
        // Create new event
        await calendarEventService.create(eventData);
        toast.success('Evento criado com sucesso!');
      }
      
      // Refresh calendar events by invalidating the query
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      
      // Close the modal
      setShowNewEventModal(false);
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Erro ao salvar evento. Tente novamente.');
    }
  };

  // Handle opening delete confirmation dialog
  const handleDeleteConfirmOpen = () => {
    setShowEventModal(false);
    setShowDeleteConfirmation(true);
  };

  // Handle delete cancellation
  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
    setIsDeleting(false);
  };

  // Handle event deletion
  const handleDeleteConfirm = async () => {
    if (!selectedEvent) return;
    
    try {
      setIsDeleting(true);
      
      await calendarEventService.deleteEvent(selectedEvent.id);
      
      // Refresh calendar events by invalidating the query
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      
      toast.success('Evento excluído com sucesso!');
      
      // Close modals
      setShowDeleteConfirmation(false);
      setSelectedEvent(null);
      setIsDeleting(false);
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Erro ao excluir evento. Tente novamente.');
      setIsDeleting(false);
    }
  };

  return {
    selectedEvent,
    showEventModal,
    setShowEventModal,
    showNewEventModal,
    setShowNewEventModal,
    eventToEdit,
    showDeleteConfirmation,
    isDeleting,
    handleEventClick,
    handleDateSelect,
    handleEditEvent,
    handleSaveEvent,
    handleDeleteConfirmOpen,
    handleDeleteCancel,
    handleDeleteConfirm
  };
};
