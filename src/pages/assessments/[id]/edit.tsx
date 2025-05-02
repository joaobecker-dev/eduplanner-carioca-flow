
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { assessmentService } from '@/lib/services/assessmentService';
import { subjectService } from '@/lib/services/subjectService';
import { teachingPlanService } from '@/lib/services/teachingPlanService';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AssessmentForm from '@/components/forms/AssessmentForm';
import { toast } from '@/hooks/use-toast';
import { AssessmentFormValues } from '@/components/forms/AssessmentForm';

const AssessmentEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch assessment data
  const { data: assessment, isLoading: isLoadingAssessment, error: assessmentError } = useQuery({
    queryKey: ['assessment', id],
    queryFn: () => assessmentService.getById(id as string),
    enabled: !!id,
  });

  // Fetch subjects
  const { data: subjects = [], isLoading: isLoadingSubjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectService.getAll,
  });

  // Fetch teaching plans
  const { data: teachingPlans = [], isLoading: isLoadingTeachingPlans } = useQuery({
    queryKey: ['teachingPlans'],
    queryFn: teachingPlanService.getAll,
  });

  // Handle errors using useEffect
  useEffect(() => {
    if (assessmentError) {
      toast({
        title: "Erro ao carregar avaliação",
        description: (assessmentError as Error).message || "Não foi possível carregar os dados da avaliação.",
        variant: "destructive",
      });
    }
  }, [assessmentError]);

  // Update mutation
  const mutation = useMutation({
    mutationFn: (values: AssessmentFormValues) => assessmentService.update(id as string, values),
    onSuccess: () => {
      toast({
        title: "Avaliação atualizada",
        description: "A avaliação foi atualizada com sucesso.",
      });
      navigate(`/assessments/${id}`);
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar",
        description: (error as Error).message || "Ocorreu um erro ao atualizar a avaliação.",
        variant: "destructive",
      });
    }
  });

  const isLoading = isLoadingAssessment || isLoadingSubjects || isLoadingTeachingPlans;

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </div>
        <div className="flex justify-center items-center h-64">
          <p>Carregando dados da avaliação...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (assessmentError || !assessment) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500 mb-4">Erro ao carregar a avaliação. O ID informado pode ser inválido.</p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </div>
      </div>
    );
  }

  // Format data for the form
  const formInitialData = {
    ...assessment,
    // Map snake_case to camelCase properties as needed
    totalPoints: assessment.total_points || assessment.totalPoints,
    dueDate: assessment.due_date || assessment.dueDate,
    teachingPlanId: assessment.teaching_plan_id || assessment.teachingPlanId
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <h1 className="text-2xl font-bold">Editar Avaliação</h1>
        </div>
      </div>

      <AssessmentForm
        initialData={formInitialData}
        onSubmit={mutation.mutate}
        isSubmitting={mutation.isLoading}
        subjects={subjects}
        teachingPlans={teachingPlans}
      />
    </div>
  );
};

export default AssessmentEdit;
