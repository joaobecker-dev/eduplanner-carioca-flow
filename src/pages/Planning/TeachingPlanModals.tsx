import React, { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { TeachingPlanFormValues } from '@/components/forms/TeachingPlanForm';
import { teachingPlanService } from '@/lib/services/teachingPlanService';
import CrudModal from '@/components/ui-components/CrudModal';
import DeleteConfirmationDialog from '@/components/ui-components/DeleteConfirmationDialog';

interface TeachingPlanModalsProps {
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
  showDeleteModal: boolean;
  setShowDeleteModal: (show: boolean) => void;
  selectedPlan: any | null;
  setSelectedPlan: (plan: any | null) => void;
  showEditModal: boolean;
  setShowEditModal: (show: boolean) => void;
  subjects?: any[];
  annualPlans?: any[];
  refreshPlans?: () => void;
}

const TeachingPlanModals: React.FC<TeachingPlanModalsProps> = ({
  showCreateModal,
  setShowCreateModal,
  showDeleteModal,
  setShowDeleteModal,
  selectedPlan,
  setSelectedPlan,
  showEditModal,
  setShowEditModal,
  subjects,
  annualPlans,
  refreshPlans
}) => {
  const queryClient = useQueryClient();
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [isDeletingPlan, setIsDeletingPlan] = useState(false);

  const createTeachingPlanMutation = useMutation({
    mutationFn: async (values: TeachingPlanFormValues) => {
      return await teachingPlanService.create(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachingPlans'] });
      toast.success('Plano de ensino criado com sucesso!');
      setShowCreateModal(false);
    },
    onError: (error) => {
      console.error('Error creating teaching plan:', error);
      toast.error('Erro ao criar plano de ensino');
    },
    onSettled: () => {
      setIsCreatingPlan(false);
    },
  });

  const deleteTeachingPlanMutation = useMutation({
    mutationFn: async (id: string) => {
      return await teachingPlanService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachingPlans'] });
      toast.success('Plano de ensino excluído com sucesso!');
      setShowDeleteModal(false);
      setSelectedPlan(null);
    },
    onError: (error) => {
      console.error('Error deleting teaching plan:', error);
      toast.error('Erro ao excluir plano de ensino');
    },
    onSettled: () => {
      setIsDeletingPlan(false);
    },
  });

  const handleCreateTeachingPlan = async (values: TeachingPlanFormValues) => {
    try {
      setIsCreatingPlan(true);
      
      const formattedValues = {
        ...values,
        startDate: values.startDate ? new Date(values.startDate) : undefined,
        endDate: values.endDate ? new Date(values.endDate) : undefined
      };
      
      await teachingPlanService.create(formattedValues);
      queryClient.invalidateQueries({ queryKey: ['teachingPlans'] });
      toast.success('Plano de ensino criado com sucesso!');
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating teaching plan:', error);
      toast.error('Erro ao criar plano de ensino');
    } finally {
      setIsCreatingPlan(false);
    }
  };

  const handleDeleteTeachingPlan = async () => {
    if (!selectedPlan?.id) return;
    try {
      setIsDeletingPlan(true);
      await teachingPlanService.delete(selectedPlan.id);
      queryClient.invalidateQueries({ queryKey: ['teachingPlans'] });
      toast.success('Plano de ensino excluído com sucesso!');
      setShowDeleteModal(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error('Error deleting teaching plan:', error);
      toast.error('Erro ao excluir plano de ensino');
    } finally {
      setIsDeletingPlan(false);
    }
  };

  return (
    <>
      <CrudModal
        title="Novo Plano de Ensino"
        description="Preencha os detalhes do plano de ensino"
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        isLoading={isCreatingPlan}
      >
        {/* Your form for creating a teaching plan goes here */}
        {/* You can use a component like TeachingPlanForm here */}
        <div>Formulário de criação de plano de ensino</div>
      </CrudModal>

      <DeleteConfirmationDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteTeachingPlan}
        title="Excluir Plano de Ensino"
        description="Tem certeza que deseja excluir este plano de ensino? Esta ação não pode ser desfeita."
        isLoading={isDeletingPlan}
      />
    </>
  );
};

// Export the component as default
export default TeachingPlanModals;

// Also export it as a named export for backward compatibility
export { TeachingPlanModals };
