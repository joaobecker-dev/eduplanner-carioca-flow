import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { AnnualPlan } from '@/types';
import CrudModal from '@/components/ui-components/CrudModal';
import DeleteConfirmationDialog from '@/components/ui-components/DeleteConfirmationDialog';
import AnnualPlanForm, { AnnualPlanFormValues } from '@/components/forms/AnnualPlanForm';
import { annualPlanService } from '@/lib/services';

interface AnnualPlanModalsProps {
  subjects: any[];
  academicPeriods: any[];
  refreshData: () => void;
}

const AnnualPlanModals: React.FC<AnnualPlanModalsProps> = ({
  subjects,
  academicPeriods,
  refreshData
}) => {
  const [isAnnualPlanModalOpen, setIsAnnualPlanModalOpen] = useState(false);
  const [isAnnualPlanDeleteOpen, setIsAnnualPlanDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAnnualPlan, setSelectedAnnualPlan] = useState<Partial<AnnualPlan> | null>(null);

  const handleCreateAnnualPlan = () => {
    setSelectedAnnualPlan(null);
    setIsAnnualPlanModalOpen(true);
  };

  const handleEditAnnualPlan = (plan: AnnualPlan) => {
    setSelectedAnnualPlan(plan);
    setIsAnnualPlanModalOpen(true);
  };

  const handleDeleteAnnualPlan = (plan: AnnualPlan) => {
    setSelectedAnnualPlan(plan);
    setIsAnnualPlanDeleteOpen(true);
  };

  const handleAnnualPlanSubmit = async (data: AnnualPlanFormValues) => {
    setIsSubmitting(true);
    try {
      // Prepare the data for database insertion by including required fields
      const annualPlanData = {
        title: data.title,
        description: data.description,
        academicPeriodId: data.academicPeriodId,
        subjectId: data.subjectId,
        objectives: data.objectives || [],
        generalContent: data.generalContent,
        methodology: data.methodology,
        evaluation: data.evaluation,
        referenceMaterials: data.referenceMaterials || [],
        // Add reference_materials to ensure type compatibility with AnnualPlan
        reference_materials: data.referenceMaterials || []
      };

      if (selectedAnnualPlan?.id) {
        // Update existing plan
        await annualPlanService.update(selectedAnnualPlan.id, annualPlanData);
        toast({
          title: "Plano anual atualizado",
          description: "O plano anual foi atualizado com sucesso.",
        });
      } else {
        // Create new plan
        await annualPlanService.create(annualPlanData);
        toast({
          title: "Plano anual criado",
          description: "O plano anual foi criado com sucesso.",
        });
      }
      setIsAnnualPlanModalOpen(false);
      refreshData();
    } catch (error) {
      console.error('Error saving annual plan:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o plano anual.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnnualPlanDelete = async () => {
    setIsSubmitting(true);
    try {
      if (selectedAnnualPlan?.id) {
        await annualPlanService.delete(selectedAnnualPlan.id);
        toast({
          title: "Plano anual excluído",
          description: "O plano anual foi excluído com sucesso.",
        });
        setIsAnnualPlanDeleteOpen(false);
        refreshData();
      }
    } catch (error) {
      console.error('Error deleting annual plan:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o plano anual.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Wrapper function to handle form submission from CrudModal
  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // The actual submission happens in the AnnualPlanForm's onSubmit prop
  };

  return (
    <>
      {/* Annual Plan Modal */}
      <CrudModal
        title={selectedAnnualPlan ? "Editar Plano Anual" : "Novo Plano Anual"}
        description="Preencha os campos para criar ou editar um plano anual."
        isOpen={isAnnualPlanModalOpen}
        isLoading={isSubmitting}
        onClose={() => setIsAnnualPlanModalOpen(false)}
        onSubmit={handleSubmitForm}
        submitLabel={selectedAnnualPlan ? "Atualizar" : "Criar"}
        size="lg"
      >
        <AnnualPlanForm
          onSubmit={handleAnnualPlanSubmit}
          initialData={selectedAnnualPlan || {}}
          subjects={subjects}
          academicPeriods={academicPeriods}
          isSubmitting={isSubmitting}
        />
      </CrudModal>

      {/* Annual Plan Delete Confirmation */}
      <DeleteConfirmationDialog
        isOpen={isAnnualPlanDeleteOpen}
        isLoading={isSubmitting}
        title="Excluir Plano Anual"
        description={`Tem certeza que deseja excluir o plano anual "${selectedAnnualPlan?.title}"? Esta ação não pode ser desfeita.`}
        onClose={() => setIsAnnualPlanDeleteOpen(false)}
        onConfirm={handleAnnualPlanDelete}
      />
    </>
  );
};

export { 
  AnnualPlanModals,
  type AnnualPlanModalsProps 
};
