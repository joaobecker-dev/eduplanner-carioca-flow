import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarEvent } from '@/types';
import { calendarEventService, subjectService } from '@/lib/services';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import SectionHeader from '@/components/ui-components/SectionHeader';
import { toast } from 'sonner';
import { getEventColor, getEventTypeLabel, getRelatedSubject } from './utils/eventUtils';
import CalendarFilters from './components/CalendarFilters';
import CalendarDisplay from './components/CalendarDisplay';
import EventDetailsModal from './components/EventDetailsModal';
import NewEventModal from './NewEventModal';
import DeleteConfirmationDialog from '@/components/ui-components/DeleteConfirmationDialog';

const CalendarView: React.FC = () => {
  // Access query client for cache invalidation
  const queryClient = useQueryClient();
  
  // State for filtering
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedEventTypes, setSelectedEventTypes] = useState<Record<string, boolean>>({
    'exam': true,
    'class': true,
  });
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined,
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined
  });
  
  // State for event details modal
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  
  // State for new/edit event modal
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);
  
  // State for delete confirmation
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Query client for data fetching and cache updates
  const { data: events = [], isLoading: eventsLoading, refetch: refetchEvents } = useQuery({
    queryKey: ['calendarEvents'],
    queryFn: calendarEventService.getAll,
  });

  // Fetch subjects for the filter
  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectService.getAll,
  });

  // Filter events based on selected filters - use useMemo to prevent unnecessary rerenders
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Filter by subject
      if (selectedSubjectId && event.subjectId !== selectedSubjectId) {
        return false;
      }

      // Filter by event type
      if (!selectedEventTypes[event.type]) {
        return false;
      }

      // Filter by date range
      if (dateRange.from && new Date(event.startDate) < dateRange.from) {
        return false;
      }
      if (dateRange.to && new Date(event.startDate) > dateRange.to) {
        return false;
      }

      return true;
    });
  }, [events, selectedSubjectId, selectedEventTypes, dateRange]);

  // Convert events to FullCalendar format - use useMemo to optimize
  const calendarEvents = useMemo(() => {
    return filteredEvents.map(event => ({
      id: event.id,
      title: event.title,
      start: event.startDate,
      end: event.endDate || event.startDate,
      allDay: event.allDay,
      extendedProps: { ...event },
      backgroundColor: event.color || getEventColor(event.type),
      borderColor: event.color || getEventColor(event.type),
    }));
  }, [filteredEvents]);

  // Handle event click
  const handleEventClick = (info: EventClickArg) => {
    const event = events.find(e => e.id === info.event.id);
    if (event) {
      setSelectedEvent(event);
      setShowEventModal(true);
    }
  };

  // Handle date select for creating new events
  const handleDateSelect = (arg: DateSelectArg) => {
    // Create a new event with default values
    setEventToEdit(null);
    setShowNewEventModal(true);
    
    // Set form default values based on selected date range
    const form = document.querySelector('form');
    if (form) {
      const startDateInput = form.querySelector('[name="startDate"]');
      const endDateInput = form.querySelector('[name="endDate"]');
      
      if (startDateInput) {
        (startDateInput as HTMLInputElement).value = arg.start.toISOString();
      }
      if (endDateInput && arg.end) {
        (endDateInput as HTMLInputElement).value = arg.end.toISOString();
      }
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (type: string) => {
    setSelectedEventTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
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
      
      // Use the explicit deleteEvent method
      await calendarEventService.delete(selectedEvent.id);
      
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

  return (
    <div className="container mx-auto px-4">
      <SectionHeader
        title="Calendário Acadêmico"
        description="Visualize e filtre eventos, aulas e avaliações"
      />

      {/* Filters */}
      <CalendarFilters 
        subjects={subjects}
        selectedSubjectId={selectedSubjectId}
        setSelectedSubjectId={setSelectedSubjectId}
        selectedEventTypes={selectedEventTypes}
        handleCheckboxChange={handleCheckboxChange}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      {/* Calendar */}
      <CalendarDisplay 
        calendarEvents={calendarEvents}
        handleEventClick={handleEventClick}
        handleDateSelect={handleDateSelect}
        isLoading={eventsLoading}
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={showEventModal}
        setIsOpen={setShowEventModal}
        selectedEvent={selectedEvent}
        handleEditEvent={handleEditEvent}
        handleDeleteEvent={handleDeleteConfirmOpen}
        getEventTypeLabel={getEventTypeLabel}
        getRelatedSubject={(subjectId) => getRelatedSubject(subjects, subjectId)}
      />

      {/* New/Edit Event Modal */}
      <NewEventModal 
        isOpen={showNewEventModal}
        onClose={() => setShowNewEventModal(false)}
        onSave={handleSaveEvent}
        eventToEdit={eventToEdit}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={showDeleteConfirmation}
        isLoading={isDeleting}
        title="Excluir Evento"
        description="Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita."
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        cancelLabel="Cancelar"
        confirmLabel="Excluir"
      />
    </div>
  );
};

export default CalendarView;
