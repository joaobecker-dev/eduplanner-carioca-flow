
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { services } from '@/lib/services';
import { Assessment, Subject, TeachingPlan } from '@/types';
import CrudModal from '@/components/ui-components/CrudModal';
import DeleteConfirmationDialog from '@/components/ui-components/DeleteConfirmationDialog';
import AssessmentForm from '@/components/forms/AssessmentForm';

interface AssessmentsModalsProps {
  subjects: Subject[];
  teachingPlans: TeachingPlan[];
  refreshData: () => void;
}

const AssessmentsModals: React.FC<AssessmentsModalsProps> = ({
  subjects,
  teachingPlans,
  refreshData
}) => {
  // Modal states
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isAssessmentDeleteOpen, setIsAssessmentDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Partial<Assessment> | null>(null);

  // Assessment handlers
  const handleCreateAssessment = () => {
    setSelectedAssessment(null);
    setIsAssessmentModalOpen(true);
  };

  const handleEditAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setIsAssessmentModalOpen(true);
  };

  const handleDeleteAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setIsAssessmentDeleteOpen(true);
  };

  const handleAssessmentSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (selectedAssessment?.id) {
        // Update existing assessment
        await services.assessment.update(selectedAssessment.id, data);
        toast({
          title: "Avaliação atualizada",
          description: "A avaliação foi atualizada com sucesso.",
        });
      } else {
        // Create new assessment
        await services.assessment.create(data);
        toast({
          title: "Avaliação criada",
          description: "A avaliação foi criada com sucesso.",
        });
      }
      setIsAssessmentModalOpen(false);
      refreshData();
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a avaliação.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssessmentDelete = async () => {
    setIsSubmitting(true);
    try {
      if (selectedAssessment?.id) {
        await services.assessment.delete(selectedAssessment.id);
        toast({
          title: "Avaliação excluída",
          description: "A avaliação foi excluída com sucesso.",
        });
        setIsAssessmentDeleteOpen(false);
        refreshData();
      }
    } catch (error) {
      console.error('Error deleting assessment:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir a avaliação.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Assessment Modal */}
      <CrudModal
        title={selectedAssessment ? "Editar Avaliação" : "Nova Avaliação"}
        description="Preencha os campos para criar ou editar uma avaliação."
        isOpen={isAssessmentModalOpen}
        isLoading={isSubmitting}
        onClose={() => setIsAssessmentModalOpen(false)}
        onSubmit={handleAssessmentSubmit}
        submitLabel={selectedAssessment ? "Atualizar" : "Criar"}
        size="md"
      >
        <AssessmentForm
          onSubmit={handleAssessmentSubmit}
          initialData={selectedAssessment || undefined}
          subjects={subjects}
          teachingPlans={teachingPlans}
          isSubmitting={isSubmitting}
        />
      </CrudModal>

      {/* Assessment Delete Confirmation */}
      <DeleteConfirmationDialog
        isOpen={isAssessmentDeleteOpen}
        isLoading={isSubmitting}
        title="Excluir Avaliação"
        description={`Tem certeza que deseja excluir a avaliação "${selectedAssessment?.title}"? Esta ação não pode ser desfeita.`}
        onClose={() => setIsAssessmentDeleteOpen(false)}
        onConfirm={handleAssessmentDelete}
      />
    </>
  );
};

export { 
  AssessmentsModals,
  type AssessmentsModalsProps 
};
