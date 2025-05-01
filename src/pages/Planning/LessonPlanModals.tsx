import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { LessonPlan } from '@/types';
import CrudModal from '@/components/ui-components/CrudModal';
import DeleteConfirmationDialog from '@/components/ui-components/DeleteConfirmationDialog';
import LessonPlanForm, { LessonPlanFormValues } from '@/components/forms/LessonPlanForm';
import { lessonPlanService } from '@/lib/services';

interface LessonPlanModalsProps {
  teachingPlans: any[];
  refreshData: () => void;
}

const LessonPlanModals: React.FC<LessonPlanModalsProps> = ({
  teachingPlans,
  refreshData
}) => {
  const [isLessonPlanModalOpen, setIsLessonPlanModalOpen] = useState(false);
  const [isLessonPlanDeleteOpen, setIsLessonPlanDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLessonPlan, setSelectedLessonPlan] = useState<Partial<LessonPlan> | null>(null);

  const handleCreateLessonPlan = () => {
    setSelectedLessonPlan(null);
    setIsLessonPlanModalOpen(true);
  };

  const handleEditLessonPlan = (plan: LessonPlan) => {
    setSelectedLessonPlan(plan);
    setIsLessonPlanModalOpen(true);
  };

  const handleDeleteLessonPlan = (plan: LessonPlan) => {
    setSelectedLessonPlan(plan);
    setIsLessonPlanDeleteOpen(true);
  };

  const handleLessonPlanSubmit = async (data: LessonPlanFormValues) => {
    setIsSubmitting(true);
    try {
      // Format the data for the service - convert string fields to arrays
      const formattedData = {
        title: data.title,
        teachingPlanId: data.teachingPlanId,
        date: data.date,
        duration: data.duration,
        objectives: data.objectives ? data.objectives.split('\n').filter(item => item.trim() !== '') : [],
        contents: data.contents ? data.contents.split('\n').filter(item => item.trim() !== '') : [],
        activities: data.activities ? data.activities.split('\n').filter(item => item.trim() !== '') : [],
        resources: data.resources ? data.resources.split('\n').filter(item => item.trim() !== '') : [],
        homework: data.homework,
        evaluation: data.evaluation,
        notes: data.notes
      };

      if (selectedLessonPlan?.id) {
        // Update existing plan
        await lessonPlanService.update(selectedLessonPlan.id, formattedData);
        toast({
          title: "Plano de aula atualizado",
          description: "O plano de aula foi atualizado com sucesso.",
        });
      } else {
        // Create new plan
        await lessonPlanService.create(formattedData);
        toast({
          title: "Plano de aula criado",
          description: "O plano de aula foi criado com sucesso.",
        });
      }
      setIsLessonPlanModalOpen(false);
      refreshData();
    } catch (error) {
      console.error('Error saving lesson plan:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o plano de aula.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLessonPlanDelete = async () => {
    setIsSubmitting(true);
    try {
      if (selectedLessonPlan?.id) {
        await lessonPlanService.delete(selectedLessonPlan.id);
        toast({
          title: "Plano de aula excluído",
          description: "O plano de aula foi excluído com sucesso.",
        });
        setIsLessonPlanDeleteOpen(false);
        refreshData();
      }
    } catch (error) {
      console.error('Error deleting lesson plan:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o plano de aula.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Wrapper function to handle form submission from CrudModal
  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // The actual submission happens in the LessonPlanForm's onSubmit prop
  };

  return (
    <>
      {/* Lesson Plan Modal */}
      <CrudModal
        title={selectedLessonPlan ? "Editar Plano de Aula" : "Novo Plano de Aula"}
        description="Preencha os campos para criar ou editar um plano de aula."
        isOpen={isLessonPlanModalOpen}
        isLoading={isSubmitting}
        onClose={() => setIsLessonPlanModalOpen(false)}
        onSubmit={handleSubmitForm}
        submitLabel={selectedLessonPlan ? "Atualizar" : "Criar"}
        size="lg"
      >
        <LessonPlanForm
          onSubmit={handleLessonPlanSubmit}
          initialData={selectedLessonPlan || {}}
          teachingPlans={teachingPlans}
          isSubmitting={isSubmitting}
        />
      </CrudModal>

      {/* Lesson Plan Delete Confirmation */}
      <DeleteConfirmationDialog
        isOpen={isLessonPlanDeleteOpen}
        isLoading={isSubmitting}
        title="Excluir Plano de Aula"
        description={`Tem certeza que deseja excluir o plano de aula "${selectedLessonPlan?.title}"? Esta ação não pode ser desfeita.`}
        onClose={() => setIsLessonPlanDeleteOpen(false)}
        onConfirm={handleLessonPlanDelete}
      />
    </>
  );
};

export { 
  LessonPlanModals,
  type LessonPlanModalsProps 
};
