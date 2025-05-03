import { CalendarEvent, ID, Assessment, StudentAssessment, LessonPlan, TeachingPlan, EventType, EventSourceType } from '@/types';
import { createService, handleError } from './baseService';
import { supabase } from "@/integrations/supabase/client";
import { normalizeToISO } from '@/integrations/supabase/supabaseAdapter';
import { mapToCamelCase } from '@/lib/utils/caseConverters';

// Create base service with fully exposed implementation
const baseService = createService<CalendarEvent>("calendar_events");

// Function to map DB response to camelCase object
const mapToCamelCaseEvent = (data: any): CalendarEvent => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    startDate: data.start_date,
    endDate: data.end_date,
    allDay: data.all_day,
    type: data.type as EventType,
    subjectId: data.subject_id,
    lessonPlanId: data.lesson_plan_id,
    assessmentId: data.assessment_id,
    teachingPlanId: data.teaching_plan_id,
    location: data.location,
    color: data.color,
    sourceType: data.source_type as EventSourceType,
    sourceId: data.source_id,
    created_at: data.created_at
  };
};

// Custom deleteEvent method (distinct from baseService.delete)
const deleteEvent = async (id: ID): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("calendar_events")
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    handleError(error, 'excluir evento do calendário');
    return false;
  }
};

// Get events by date range
const getByDateRange = async (startDate: string, endDate: string): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from("calendar_events")
      .select('*')
      .gte('start_date', startDate)
      .lte('start_date', endDate);

    if (error) throw error;
    return data ? data.map(mapToCamelCaseEvent) : [];
  } catch (error) {
    handleError(error, 'buscar eventos por período');
    return [];
  }
};

// Get events by subject
const getBySubject = async (subjectId: ID): Promise<CalendarEvent[]> => {
  try {
    const { data, error } = await supabase
      .from("calendar_events")
      .select('*')
      .eq('subject_id', subjectId);

    if (error) throw error;
    return data ? data.map(mapToCamelCaseEvent) : [];
  } catch (error) {
    handleError(error, 'buscar eventos por disciplina');
    return [];
  }
};

// Create new event with proper typing
const create = async (eventData: Omit<CalendarEvent, 'id' | 'created_at'>): Promise<CalendarEvent | null> => {
  try {
    // Use direct object construction with snake_case keys
    const preparedData = {
      title: eventData.title,
      description: eventData.description,
      type: eventData.type as EventType,
      start_date: normalizeToISO(eventData.startDate),
      end_date: normalizeToISO(eventData.endDate),
      all_day: eventData.allDay,
      subject_id: eventData.subjectId,
      lesson_plan_id: eventData.lessonPlanId,
      assessment_id: eventData.assessmentId,
      teaching_plan_id: eventData.teachingPlanId,
      location: eventData.location,
      color: eventData.color,
      source_type: eventData.sourceType as EventSourceType || 'manual',
      source_id: eventData.sourceId
    };

    if (!preparedData.title || !preparedData.type || !preparedData.start_date) {
      throw new Error("Missing required fields for calendar event");
    }

    const { data, error } = await supabase
      .from("calendar_events")
      .insert(preparedData)
      .select()
      .single();

    if (error) throw error;
    return mapToCamelCaseEvent(data);
  } catch (error) {
    handleError(error, 'criar evento do calendário');
    throw error;
  }
};

// Update event with proper typing
const update = async (id: ID, eventData: Partial<CalendarEvent>): Promise<CalendarEvent | null> => {
  try {
    // Use direct object construction with snake_case keys
    const updateData: Record<string, any> = {};

    if (eventData.title !== undefined) updateData.title = eventData.title;
    if (eventData.description !== undefined) updateData.description = eventData.description;
    if (eventData.type !== undefined) updateData.type = eventData.type as EventType;
    if (eventData.startDate !== undefined) updateData.start_date = normalizeToISO(eventData.startDate);
    if (eventData.endDate !== undefined) updateData.end_date = normalizeToISO(eventData.endDate);
    if (eventData.allDay !== undefined) updateData.all_day = eventData.allDay;
    if (eventData.subjectId !== undefined) updateData.subject_id = eventData.subjectId;
    if (eventData.lessonPlanId !== undefined) updateData.lesson_plan_id = eventData.lessonPlanId;
    if (eventData.assessmentId !== undefined) updateData.assessment_id = eventData.assessmentId;
    if (eventData.teachingPlanId !== undefined) updateData.teaching_plan_id = eventData.teachingPlanId;
    if (eventData.location !== undefined) updateData.location = eventData.location;
    if (eventData.color !== undefined) updateData.color = eventData.color;
    if (eventData.sourceType !== undefined) updateData.source_type = eventData.sourceType as EventSourceType;
    if (eventData.sourceId !== undefined) updateData.source_id = eventData.sourceId;

    const { data, error } = await supabase
      .from("calendar_events")
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapToCamelCaseEvent(data);
  } catch (error) {
    handleError(error, 'atualizar evento do calendário');
    throw error;
  }
};

// Delete events by source
const deleteBySource = async (sourceType: string, sourceId: ID): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("calendar_events")
      .delete()
      .eq('source_type', sourceType)
      .eq('source_id', sourceId);

    if (error) throw error;
    return true;
  } catch (error) {
    handleError(error, `excluir eventos do calendário por fonte (${sourceType})`);
    return false;
  }
};

// Sync from assessment
const syncFromAssessment = async (assessment: Assessment): Promise<void> => {
  try {
    if (!assessment || !assessment.id) return;

    // Direct object with snake_case keys
    const eventData = {
      title: `Avaliação: ${assessment.title}`,
      description: assessment.description || '',
      type: "exam" as EventType,
      start_date: normalizeToISO(assessment.date) || '',
      end_date: normalizeToISO(assessment.dueDate || assessment.date) || '',
      all_day: true,
      subject_id: assessment.subjectId,
      assessment_id: assessment.id,
      color: '#e67c73',
      source_type: 'assessment' as EventSourceType,
      source_id: assessment.id
    };

    const { error } = await supabase
      .from("calendar_events")
      .upsert(eventData, {
        onConflict: 'source_id,source_type',
        ignoreDuplicates: false
      });

    if (error) throw error;
  } catch (error) {
    handleError(error, 'sincronizar evento do calendário com avaliação');
  }
};

// Sync from lesson plan 
const syncFromLessonPlan = async (lessonPlan: LessonPlan): Promise<void> => {
  try {
    if (!lessonPlan || !lessonPlan.date || !lessonPlan.id) return;

    const startDate = normalizeToISO(lessonPlan.date) || '';
    let endDate = startDate;
    
    // Calculate end date based on duration in minutes
    if (lessonPlan.duration) {
      const date = new Date(lessonPlan.date);
      date.setMinutes(date.getMinutes() + lessonPlan.duration);
      endDate = normalizeToISO(date) || startDate;
    }

    // Direct object construction with explicit snake_case keys
    const eventData = {
      title: `Aula: ${lessonPlan.title}`,
      description: lessonPlan.notes || '',
      type: "class" as EventType,
      start_date: startDate,
      end_date: endDate,
      all_day: false,
      teaching_plan_id: lessonPlan.teachingPlanId,
      lesson_plan_id: lessonPlan.id,
      color: '#9b87f5',
      source_type: 'lesson_plan' as EventSourceType,
      source_id: lessonPlan.id
    };

    const { error } = await supabase
      .from("calendar_events")
      .upsert(eventData, {
        onConflict: 'source_id,source_type',
        ignoreDuplicates: false
      });

    if (error) throw error;
  } catch (error) {
    handleError(error, 'sincronizar evento do calendário com plano de aula');
  }
};

// Sync from teaching plan
const syncFromTeachingPlan = async (teachingPlan: TeachingPlan): Promise<void> => {
  try {
    if (!teachingPlan || !teachingPlan.startDate || !teachingPlan.id) return;

    // Direct object construction with explicit snake_case keys
    const eventData = {
      title: `Plano de Ensino: ${teachingPlan.title}`,
      description: teachingPlan.description || '',
      type: "class" as EventType,
      start_date: normalizeToISO(teachingPlan.startDate) || '',
      end_date: normalizeToISO(teachingPlan.endDate) || '',
      all_day: true,
      subject_id: teachingPlan.subjectId,
      teaching_plan_id: teachingPlan.id,
      color: '#7E69AB',
      source_type: 'teaching_plan' as EventSourceType,
      source_id: teachingPlan.id
    };

    const { error } = await supabase
      .from("calendar_events")
      .upsert(eventData, {
        onConflict: 'source_id,source_type',
        ignoreDuplicates: false
      });

    if (error) throw error;
  } catch (error) {
    handleError(error, 'sincronizar evento do calendário com plano de ensino');
  }
};

// Implement syncFromStudentAssessment
const syncFromStudentAssessment = async (studentAssessment: StudentAssessment): Promise<void> => {
  try {
    if (!studentAssessment || !studentAssessment.id) return;
    
    // Direct object with snake_case keys
    const eventData = {
      title: `Prova Individual: ${studentAssessment.assessmentId}`,
      description: studentAssessment.feedback || '',
      type: "exam" as EventType,
      start_date: normalizeToISO(studentAssessment.submittedDate) || '',
      end_date: normalizeToISO(studentAssessment.gradedDate || studentAssessment.submittedDate) || '',
      all_day: true,
      assessment_id: studentAssessment.assessmentId,
      color: '#e67c73',
      source_type: 'student_assessment' as EventSourceType,
      source_id: studentAssessment.id
    };

    const { error } = await supabase
      .from("calendar_events")
      .upsert(eventData, {
        onConflict: 'source_id,source_type',
        ignoreDuplicates: false
      });

    if (error) throw error;
  } catch (error) {
    handleError(error, 'sincronizar evento do calendário com avaliação do estudante');
  }
};

// Export service with explicit method definitions - avoid using spread operator
export const calendarEventService = {
  // Methods from base service
  getAll: baseService.getAll,
  getById: baseService.getById,
  delete: baseService.delete, // Original delete method from base service
  
  // Custom delete method - ensure it's explicitly exported
  deleteEvent,
  
  // Custom methods
  getByDateRange,
  getBySubject,
  create,
  update,
  deleteBySource,
  syncFromAssessment,
  syncFromLessonPlan,
  syncFromTeachingPlan,
  syncFromStudentAssessment
};
</xArtifact>

**Mensagem de Commit**:
```
chore(calendarEventService): confirm no changes needed

No changes applied to calendarEventService.ts, as it is already robust with mapToCamelCaseEvent for TS2589 prevention and complete method implementations. Included for reference to ensure consistency.
```

---

#### 4. **src/pages/Calendar/CalendarView.tsx**

**Mudanças**:
- **Revisão**: O arquivo já usa `calendarEventService.deleteEvent` corretamente, importa `calendarEventService` de `@/lib/services` (via `index.ts`), e não apresenta erros.
- **Melhorias Aplicadas**:
  - Adicionado JSDoc para documentar a funcionalidade do componente.
  - Adicionada validação em `handleDateSelect` para garantir que `arg.start` e `arg.end` são válidos antes de definir valores no formulário.
  - Adicionada verificação em `handleEventClick` para evitar abrir o modal se o evento não for encontrado.
- **Justificativa**: Essas pequenas melhorias aumentam a robustez, prevenindo erros de manipulação de DOM ou eventos inválidos, sem alterar a lógica principal.

**Código Atualizado**:

<xaiArtifact artifact_id="37f65b27-c16f-40e1-addd-a11a81bc42ff" artifact_version_id="6f0a4d9a-de5a-4850-a92a-ec3f2a508ffa" title="src/pages/Calendar/CalendarView.tsx" contentType="text/typescript">
/**
 * CalendarView component for displaying and managing academic calendar events.
 * 
 * Features:
 * - Displays events in a FullCalendar interface with filtering by subject, event type, and date range.
 * - Supports creating, editing, and deleting events via modals.
 * - Integrates with calendarEventService for CRUD operations and subjectService for subject data.
 * - Uses React Query for data fetching and cache management.
 */
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
