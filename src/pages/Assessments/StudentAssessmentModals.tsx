
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { services } from '@/lib/services';
import { Assessment, Student, StudentAssessment } from '@/types';
import CrudModal from '@/components/ui-components/CrudModal';
import DeleteConfirmationDialog from '@/components/ui-components/DeleteConfirmationDialog';
import StudentAssessmentForm, { StudentAssessmentFormValues } from '@/components/forms/StudentAssessmentForm';

interface StudentAssessmentModalsProps {
  students: Student[];
  assessments: Assessment[];
  refreshData: () => void;
}

const StudentAssessmentModals: React.FC<StudentAssessmentModalsProps> = ({
  students,
  assessments,
  refreshData
}) => {
  // Modal states
  const [isStudentAssessmentModalOpen, setIsStudentAssessmentModalOpen] = useState(false);
  const [isStudentAssessmentDeleteOpen, setIsStudentAssessmentDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStudentAssessment, setSelectedStudentAssessment] = useState<Partial<StudentAssessment> | null>(null);
  const [currentAssessmentId, setCurrentAssessmentId] = useState<string | null>(null);

  // Student Assessment handlers
  const handleCreateStudentAssessment = (assessmentId?: string) => {
    setSelectedStudentAssessment(assessmentId ? { assessmentId } : null);
    setCurrentAssessmentId(assessmentId || null);
    setIsStudentAssessmentModalOpen(true);
  };

  const handleEditStudentAssessment = (studentAssessment: StudentAssessment) => {
    setSelectedStudentAssessment(studentAssessment);
    setCurrentAssessmentId(studentAssessment.assessmentId);
    setIsStudentAssessmentModalOpen(true);
  };

  const handleDeleteStudentAssessment = (studentAssessment: StudentAssessment) => {
    setSelectedStudentAssessment(studentAssessment);
    setIsStudentAssessmentDeleteOpen(true);
  };

  const handleStudentAssessmentSubmit = async (data: StudentAssessmentFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert Date objects to ISO strings for API
      const studentAssessmentData = {
        ...data,
        submittedDate: data.submittedDate ? data.submittedDate.toISOString() : undefined,
        gradedDate: data.gradedDate ? data.gradedDate.toISOString() : undefined
      };
      
      if (selectedStudentAssessment?.id) {
        // Update existing student assessment
        await services.studentAssessment.update(selectedStudentAssessment.id, studentAssessmentData);
        toast({
          title: "Nota atualizada",
          description: "A nota do aluno foi atualizada com sucesso.",
        });
      } else {
        // Create new student assessment
        // Ensure required fields are present for create
        if (!studentAssessmentData.studentId || !studentAssessmentData.assessmentId) {
          toast({
            title: "Erro ao salvar",
            description: "Aluno e avaliação são campos obrigatórios.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        
        const requiredFields: Omit<StudentAssessment, "id"> = {
          studentId: studentAssessmentData.studentId,
          assessmentId: studentAssessmentData.assessmentId,
          score: studentAssessmentData.score || 0,
          feedback: studentAssessmentData.feedback,
          submittedDate: studentAssessmentData.submittedDate,
          gradedDate: studentAssessmentData.gradedDate
        };
        
        await services.studentAssessment.create(requiredFields);
        toast({
          title: "Nota registrada",
          description: "A nota do aluno foi registrada com sucesso.",
        });
      }
      setIsStudentAssessmentModalOpen(false);
      refreshData();
    } catch (error) {
      console.error('Error saving student assessment:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a nota do aluno.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStudentAssessmentDelete = async () => {
    setIsSubmitting(true);
    try {
      if (selectedStudentAssessment?.id) {
        await services.studentAssessment.delete(selectedStudentAssessment.id);
        toast({
          title: "Nota excluída",
          description: "A nota do aluno foi excluída com sucesso.",
        });
        setIsStudentAssessmentDeleteOpen(false);
        refreshData();
      }
    } catch (error) {
      console.error('Error deleting student assessment:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir a nota do aluno.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter assessments if we're adding a grade for a specific assessment
  const filteredAssessments = currentAssessmentId 
    ? assessments.filter(a => a.id === currentAssessmentId) 
    : assessments;

  return (
    <>
      {/* Student Assessment Modal */}
      <CrudModal
        title={selectedStudentAssessment?.id ? "Editar Nota do Aluno" : "Registrar Nova Nota"}
        description="Preencha os campos para registrar ou editar a nota do aluno."
        isOpen={isStudentAssessmentModalOpen}
        isLoading={isSubmitting}
        onClose={() => setIsStudentAssessmentModalOpen(false)}
        onSubmit={() => {}} // This is intentionally empty as we handle submission in the form
        submitLabel={selectedStudentAssessment?.id ? "Atualizar" : "Salvar"}
      >
        <StudentAssessmentForm
          onSubmit={handleStudentAssessmentSubmit}
          initialData={selectedStudentAssessment || undefined}
          students={students}
          assessments={filteredAssessments}
          isSubmitting={isSubmitting}
        />
      </CrudModal>

      {/* Student Assessment Delete Confirmation */}
      <DeleteConfirmationDialog
        isOpen={isStudentAssessmentDeleteOpen}
        isLoading={isSubmitting}
        title="Excluir Nota do Aluno"
        description={`Tem certeza que deseja excluir esta nota? Esta ação não pode ser desfeita.`}
        onClose={() => setIsStudentAssessmentDeleteOpen(false)}
        onConfirm={handleStudentAssessmentDelete}
      />
    </>
  );
};

export { 
  StudentAssessmentModals,
  type StudentAssessmentModalsProps 
};
