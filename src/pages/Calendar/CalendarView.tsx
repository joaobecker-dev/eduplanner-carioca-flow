
/**
 * CalendarView component for displaying and managing academic calendar events.
 * 
 * Features:
 * - Displays events in a FullCalendar interface with filtering by subject, event type, and date range.
 * - Supports creating, editing, and deleting events via modals.
 * - Integrates with calendarEventService for CRUD operations and subjectService for subject data.
 * - Uses React Query for data fetching and cache management.
 */
import React from 'react';
import { getEventTypeLabel, getRelatedSubject } from './utils/eventUtils';
import SectionHeader from '@/components/ui-components/SectionHeader';
import CalendarFilters from './components/CalendarFilters';
import CalendarDisplay from './components/CalendarDisplay';
import EventDetailsModal from './components/EventDetailsModal';
import NewEventModal from './NewEventModal';
import DeleteConfirmationDialog from '@/components/ui-components/DeleteConfirmationDialog';
import { useCalendarEvents } from './hooks/useCalendarEvents';
import { useCalendarActions } from './hooks/useCalendarActions';

const CalendarView: React.FC = () => {
  const {
    subjects, 
    eventsLoading, 
    calendarEvents,
    filters
  } = useCalendarEvents();
  
  const {
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
  } = useCalendarActions();

  return (
    <div className="container mx-auto px-4">
      <SectionHeader
        title="Calendário Acadêmico"
        description="Visualize e filtre eventos, aulas e avaliações"
      />

      {/* Filters */}
      <CalendarFilters 
        subjects={subjects}
        selectedSubjectId={filters.selectedSubjectId}
        setSelectedSubjectId={filters.setSelectedSubjectId}
        selectedEventTypes={filters.selectedEventTypes}
        handleCheckboxChange={filters.handleCheckboxChange}
        dateRange={{
          start: filters.dateRange.from,
          end: filters.dateRange.to
        }}
        setDateRange={(range) => filters.setDateRange({
          from: range.start, 
          to: range.end
        })}
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
        description="Tem certeza que deseja excluir este evento? Esta ação não pode be desfeita."
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        cancelLabel="Cancelar"
        confirmLabel="Excluir"
      />
    </div>
  );
};

export default CalendarView;
