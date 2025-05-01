
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { LessonPlan } from '@/types';
import CrudModal from '@/components/ui-components/CrudModal';
import DeleteConfirmationDialog from '@/components/ui-components/DeleteConfirmationDialog';
import LessonPlanForm from '@/components/forms/LessonPlanForm';
import { lessonPlanService } from '@/lib/services/lessonPlanService';

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

  const handleLessonPlanSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (selectedLessonPlan?.id) {
        // Update existing plan
        await lessonPlanService.update(selectedLessonPlan.id, data);
        toast({
          title: "Plano de aula atualizado",
          description: "O plano de aula foi atualizado com sucesso.",
        });
      } else {
        // Create new plan
        await lessonPlanService.create(data);
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

  return (
    <>
      {/* Lesson Plan Modal */}
      <CrudModal
        title={selectedLessonPlan ? "Editar Plano de Aula" : "Novo Plano de Aula"}
        description="Preencha os campos para criar ou editar um plano de aula."
        isOpen={isLessonPlanModalOpen}
        isLoading={isSubmitting}
        onClose={() => setIsLessonPlanModalOpen(false)}
        onSubmit={handleLessonPlanSubmit}
        submitLabel={selectedLessonPlan ? "Atualizar" : "Criar"}
        size="lg"
      >
        <LessonPlanForm
          onSubmit={handleLessonPlanSubmit}
          // @ts-ignore - We need this because the form component expects LessonPlan but can handle Partial<LessonPlan>
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
