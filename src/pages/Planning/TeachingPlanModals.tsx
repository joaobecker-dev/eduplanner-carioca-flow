
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { TeachingPlan } from '@/types';
import CrudModal from '@/components/ui-components/CrudModal';
import DeleteConfirmationDialog from '@/components/ui-components/DeleteConfirmationDialog';
import TeachingPlanForm from '@/components/forms/TeachingPlanForm';
import { teachingPlanService } from '@/lib/services';

interface TeachingPlanModalsProps {
  subjects: any[];
  annualPlans: any[];
  refreshData: () => void;
}

const TeachingPlanModals: React.FC<TeachingPlanModalsProps> = ({
  subjects,
  annualPlans,
  refreshData
}) => {
  const [isTeachingPlanModalOpen, setIsTeachingPlanModalOpen] = useState(false);
  const [isTeachingPlanDeleteOpen, setIsTeachingPlanDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTeachingPlan, setSelectedTeachingPlan] = useState<Partial<TeachingPlan> | null>(null);

  const handleCreateTeachingPlan = () => {
    setSelectedTeachingPlan(null);
    setIsTeachingPlanModalOpen(true);
  };

  const handleEditTeachingPlan = (plan: TeachingPlan) => {
    setSelectedTeachingPlan(plan);
    setIsTeachingPlanModalOpen(true);
  };

  const handleDeleteTeachingPlan = (plan: TeachingPlan) => {
    setSelectedTeachingPlan(plan);
    setIsTeachingPlanDeleteOpen(true);
  };

  const handleTeachingPlanSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (selectedTeachingPlan?.id) {
        // Update existing plan
        await teachingPlanService.update(selectedTeachingPlan.id, data);
        toast({
          title: "Plano de ensino atualizado",
          description: "O plano de ensino foi atualizado com sucesso.",
        });
      } else {
        // Create new plan
        await teachingPlanService.create(data);
        toast({
          title: "Plano de ensino criado",
          description: "O plano de ensino foi criado com sucesso.",
        });
      }
      setIsTeachingPlanModalOpen(false);
      refreshData();
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
    setIsSubmitting(true);
    try {
      if (selectedTeachingPlan?.id) {
        await teachingPlanService.delete(selectedTeachingPlan.id);
        toast({
          title: "Plano de ensino excluído",
          description: "O plano de ensino foi excluído com sucesso.",
        });
        setIsTeachingPlanDeleteOpen(false);
        refreshData();
      }
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
        title={selectedTeachingPlan ? "Editar Plano de Ensino" : "Novo Plano de Ensino"}
        description="Preencha os campos para criar ou editar um plano de ensino."
        isOpen={isTeachingPlanModalOpen}
        isLoading={isSubmitting}
        onClose={() => setIsTeachingPlanModalOpen(false)}
        onSubmit={handleTeachingPlanSubmit}
        submitLabel={selectedTeachingPlan ? "Atualizar" : "Criar"}
        size="lg"
      >
        <TeachingPlanForm
          onSubmit={handleTeachingPlanSubmit}
          // @ts-ignore - We need this because the form component expects TeachingPlan but can handle Partial<TeachingPlan>
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
