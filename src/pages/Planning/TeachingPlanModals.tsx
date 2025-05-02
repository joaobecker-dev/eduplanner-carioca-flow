
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { services } from '@/lib/services';
import { AnnualPlan, Subject, TeachingPlan } from '@/types';
import CrudModal from '@/components/ui-components/CrudModal';
import DeleteConfirmationDialog from '@/components/ui-components/DeleteConfirmationDialog';
import TeachingPlanForm, { TeachingPlanFormValues } from '@/components/forms/TeachingPlanForm';

interface TeachingPlanModalsProps {
  subjects: Subject[];
  annualPlans: AnnualPlan[];
  refreshPlans: () => void;
}

const TeachingPlanModals: React.FC<TeachingPlanModalsProps> = ({
  subjects,
  annualPlans,
  refreshPlans,
}) => {
  // Modal states
  const [isTeachingPlanModalOpen, setIsTeachingPlanModalOpen] = useState(false);
  const [isTeachingPlanDeleteOpen, setIsTeachingPlanDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTeachingPlan, setSelectedTeachingPlan] = useState<Partial<TeachingPlan> | null>(null);

  // Teaching Plan handlers
  const handleCreateTeachingPlan = () => {
    setSelectedTeachingPlan(null);
    setIsTeachingPlanModalOpen(true);
  };

  const handleEditTeachingPlan = (teachingPlan: TeachingPlan) => {
    setSelectedTeachingPlan(teachingPlan);
    setIsTeachingPlanModalOpen(true);
  };

  const handleDeleteTeachingPlan = (teachingPlan: TeachingPlan) => {
    setSelectedTeachingPlan(teachingPlan);
    setIsTeachingPlanDeleteOpen(true);
  };

  const handleTeachingPlanSubmit = async (data: TeachingPlanFormValues) => {
    setIsSubmitting(true);
    
    // Ensure required fields are present for create operation
    if (!selectedTeachingPlan?.id && (!data.title || !data.subjectId || !data.annualPlanId)) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos obrigatórios devem ser preenchidos.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      if (selectedTeachingPlan?.id) {
        // Update existing teaching plan
        await services.teachingPlan.update(selectedTeachingPlan.id, data);
        toast({
          title: "Plano de ensino atualizado",
          description: "O plano de ensino foi atualizado com sucesso.",
        });
      } else {
        // Create new teaching plan with required fields guaranteed
        await services.teachingPlan.create(data as Omit<TeachingPlan, "id">);
        toast({
          title: "Plano de ensino criado",
          description: "O plano de ensino foi criado com sucesso.",
        });
      }
      setIsTeachingPlanModalOpen(false);
      refreshPlans();
    } catch (error) {
      console.error('Error saving teaching plan:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o plano de ensino.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTeachingPlanDelete = async () => {
    if (!selectedTeachingPlan?.id) return;

    setIsSubmitting(true);
    try {
      await services.teachingPlan.delete(selectedTeachingPlan.id);
      toast({
        title: "Plano de ensino excluído",
        description: "O plano de ensino foi excluído com sucesso.",
      });
      setIsTeachingPlanDeleteOpen(false);
      refreshPlans();
    } catch (error) {
      console.error('Error deleting teaching plan:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o plano de ensino.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Teaching Plan Modal */}
      <CrudModal
        title={selectedTeachingPlan?.id ? "Editar Plano de Ensino" : "Novo Plano de Ensino"}
        description="Preencha os campos para criar ou editar um plano de ensino."
        isOpen={isTeachingPlanModalOpen}
        isLoading={isSubmitting}
        onClose={() => setIsTeachingPlanModalOpen(false)}
        onSubmit={() => {}} // We're handling submission in the form
        submitLabel={selectedTeachingPlan?.id ? "Atualizar" : "Criar"}
        size="lg"
      >
        <TeachingPlanForm
          onSubmit={handleTeachingPlanSubmit}
          initialData={selectedTeachingPlan || {}}
          subjects={subjects}
          annualPlans={annualPlans}
          isSubmitting={isSubmitting}
        />
      </CrudModal>

      {/* Teaching Plan Delete Confirmation */}
      <DeleteConfirmationDialog
        isOpen={isTeachingPlanDeleteOpen}
        isLoading={isSubmitting}
        title="Excluir Plano de Ensino"
        description={`Tem certeza que deseja excluir o plano de ensino "${selectedTeachingPlan?.title}"? Esta ação não pode ser desfeita.`}
        onClose={() => setIsTeachingPlanDeleteOpen(false)}
        onConfirm={handleTeachingPlanDelete}
      />
    </>
  );
};

export { 
  TeachingPlanModals,
  type TeachingPlanModalsProps
};
