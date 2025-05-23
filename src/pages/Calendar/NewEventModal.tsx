
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarEvent } from '@/types';
import { EventFormValues, eventSchema } from '@/schemas/eventSchema';
import { normalizeToISO } from '@/integrations/supabase/supabaseAdapter';
import CrudModal from '@/components/ui-components/CrudModal';
import EventForm from './components/EventForm';

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id' | 'created_at'>) => Promise<void>;
  eventToEdit?: CalendarEvent | null;
}

const NewEventModal: React.FC<NewEventModalProps> = ({ isOpen, onClose, onSave, eventToEdit }) => {
  const handleSubmit = async (values: EventFormValues) => {
    try {
      // Convert Date objects to ISO strings for database storage
      const eventData: Omit<CalendarEvent, 'id' | 'created_at'> = {
        title: values.title,
        description: values.description,
        type: values.type,
        startDate: normalizeToISO(values.startDate) || '',
        endDate: normalizeToISO(values.endDate) || normalizeToISO(values.startDate) || '',
        allDay: values.allDay,
        color: values.color,
        subjectId: values.subjectId || undefined,
        // Ensure source information is preserved during edits or set to manual for new events
        sourceType: eventToEdit?.sourceType || 'manual',
        sourceId: eventToEdit?.sourceId || null,
        // Preserve reference IDs if editing
        assessmentId: eventToEdit?.assessmentId,
        lessonPlanId: eventToEdit?.lessonPlanId,
        teachingPlanId: eventToEdit?.teachingPlanId,
        // Preserve location if editing
        location: values.location || eventToEdit?.location
      };

      await onSave(eventData);
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  return (
    <CrudModal
      title={eventToEdit ? "Editar Evento" : "Novo Evento"}
      description="Preencha os detalhes do evento"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={(e) => {
        e.preventDefault();
        // Form handling moved to EventForm component
      }}
      isLoading={false}
    >
      <EventForm 
        onSubmit={handleSubmit} 
        eventToEdit={eventToEdit} 
      />
    </CrudModal>
  );
};

export default NewEventModal;
