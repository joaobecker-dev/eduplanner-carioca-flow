import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { calendarEventService } from '@/lib/services';
import { CalendarEvent, Subject, Assessment, LessonPlan } from '@/types';
import CrudModal from '@/components/ui-components/CrudModal';
import DeleteConfirmationDialog from '@/components/ui-components/DeleteConfirmationDialog';
import CalendarEventForm from '@/components/forms/CalendarEventForm';

interface CalendarModalsProps {
  subjects: Subject[];
  assessments: Assessment[];
  lessonPlans: LessonPlan[];
  refreshData: () => void;
}

const CalendarModals: React.FC<CalendarModalsProps> = ({
  subjects,
  assessments,
  lessonPlans,
  refreshData
}) => {
  // Modal states
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isEventDeleteOpen, setIsEventDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Partial<CalendarEvent> | null>(null);

  // Calendar event handlers
  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleDeleteEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDeleteOpen(true);
  };

  const handleEventSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (selectedEvent?.id) {
        // Update existing event
        await calendarEventService.update(selectedEvent.id, data);
        toast({
          title: "Evento atualizado",
          description: "O evento foi atualizado com sucesso.",
        });
      } else {
        // Create new event
        await calendarEventService.create(data);
        toast({
          title: "Evento criado",
          description: "O evento foi criado com sucesso.",
        });
      }
      setIsEventModalOpen(false);
      refreshData();
    } catch (error) {
      console.error('Error saving calendar event:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o evento.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEventDelete = async () => {
    setIsSubmitting(true);
    try {
      if (selectedEvent?.id) {
        await calendarEventService.delete(selectedEvent.id);
        toast({
          title: "Evento excluído",
          description: "O evento foi excluído com sucesso.",
        });
        setIsEventDeleteOpen(false);
        refreshData();
      }
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o evento.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Calendar Event Modal */}
      <CrudModal
        title={selectedEvent ? "Editar Evento" : "Novo Evento"}
        description="Preencha os campos para criar ou editar um evento."
        isOpen={isEventModalOpen}
        isLoading={isSubmitting}
        onClose={() => setIsEventModalOpen(false)}
        onSubmit={handleEventSubmit}
        submitLabel={selectedEvent ? "Atualizar" : "Criar"}
        size="md"
      >
        <CalendarEventForm
          onSubmit={handleEventSubmit}
          initialData={selectedEvent || undefined}
          subjects={subjects}
          assessments={assessments}
          lessonPlans={lessonPlans}
          isSubmitting={isSubmitting}
        />
      </CrudModal>

      {/* Calendar Event Delete Confirmation */}
      <DeleteConfirmationDialog
        isOpen={isEventDeleteOpen}
        isLoading={isSubmitting}
        title="Excluir Evento"
        description={`Tem certeza que deseja excluir o evento "${selectedEvent?.title}"? Esta ação não pode ser desfeita.`}
        onClose={() => setIsEventDeleteOpen(false)}
        onConfirm={handleEventDelete}
      />
    </>
  );
};

export { 
  CalendarModals,
  type CalendarModalsProps 
};
