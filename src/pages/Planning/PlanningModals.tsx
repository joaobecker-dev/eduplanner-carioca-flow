import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { services } from '@/lib/services';
import { AnnualPlan, TeachingPlan, LessonPlan } from '@/types';
import CrudModal from '@/components/ui-components/CrudModal';
import DeleteConfirmationDialog from '@/components/ui-components/DeleteConfirmationDialog';
import AnnualPlanForm from '@/components/forms/AnnualPlanForm';
import TeachingPlanForm from '@/components/forms/TeachingPlanForm';
import LessonPlanForm from '@/components/forms/LessonPlanForm';

interface PlanningModalsProps {
  subjects: any[];
  academicPeriods: any[];
  annualPlans: any[];
  teachingPlans: any[];
  refreshData: () => void;
}

const PlanningModals: React.FC<PlanningModalsProps> = ({
  subjects, 
  academicPeriods, 
  annualPlans, 
  teachingPlans,
  refreshData
}) => {
  // State for each modal
  const [isAnnualPlanModalOpen, setIsAnnualPlanModalOpen] = useState(false);
  const [isTeachingPlanModalOpen, setIsTeachingPlanModalOpen] = useState(false);
  const [isLessonPlanModalOpen, setIsLessonPlanModalOpen] = useState(false);
  const [isAnnualPlanDeleteOpen, setIsAnnualPlanDeleteOpen] = useState(false);
  const [isTeachingPlanDeleteOpen, setIsTeachingPlanDeleteOpen] = useState(false);
  const [isLessonPlanDeleteOpen, setIsLessonPlanDeleteOpen] = useState(false);

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Selected item state for edit/delete operations
  const [selectedAnnualPlan, setSelectedAnnualPlan] = useState<Partial<AnnualPlan> | null>(null);
  const [selectedTeachingPlan, setSelectedTeachingPlan] = useState<Partial<TeachingPlan> | null>(null);
  const [selectedLessonPlan, setSelectedLessonPlan] = useState<Partial<LessonPlan> | null>(null);

  // Annual Plan handlers
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

  const handleAnnualPlanSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (selectedAnnualPlan?.id) {
        // Update existing plan
        await services.annualPlan.update(selectedAnnualPlan.id, data);
        toast({
          title: "Plano anual atualizado",
          description: "O plano anual foi atualizado com sucesso.",
        });
      } else {
        // Create new plan
        await services.annualPlan.create(data);
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
        await services.annualPlan.delete(selectedAnnualPlan.id);
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

  // Teaching Plan handlers
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
        await services.teachingPlan.update(selectedTeachingPlan.id, data);
        toast({
          title: "Plano de ensino atualizado",
          description: "O plano de ensino foi atualizado com sucesso.",
        });
      } else {
        // Create new plan
        await services.teachingPlan.create(data);
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
        await services.teachingPlan.delete(selectedTeachingPlan.id);
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

  // Lesson Plan handlers
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
        await services.lessonPlan.update(selectedLessonPlan.id, data);
        toast({
          title: "Plano de aula atualizado",
          description: "O plano de aula foi atualizado com sucesso.",
        });
      } else {
        // Create new plan
        await services.lessonPlan.create(data);
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
        await services.lessonPlan.delete(selectedLessonPlan.id);
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
      {/* Annual Plan Modal */}
      <CrudModal
        title={selectedAnnualPlan ? "Editar Plano Anual" : "Novo Plano Anual"}
        description="Preencha os campos para criar ou editar um plano anual."
        isOpen={isAnnualPlanModalOpen}
        isLoading={isSubmitting}
        onClose={() => setIsAnnualPlanModalOpen(false)}
        onSubmit={handleAnnualPlanSubmit}
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
          // @ts-ignore - We need to force the type here as the component expects TeachingPlan but can handle Partial<TeachingPlan>
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
          // @ts-ignore - We need to force the type here as the component expects LessonPlan but can handle Partial<LessonPlan>
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
  PlanningModals,
  // Export handlers for parent components
  type PlanningModalsProps 
};
