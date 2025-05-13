
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { lessonPlanService } from '@/lib/services/lessonPlanService';
import { teachingPlanService } from '@/lib/services/teachingPlanService';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import LessonPlanForm from '@/components/forms/LessonPlanForm';
import { toast } from '@/hooks/use-toast';
import { LessonPlanFormValues } from '@/components/forms/LessonPlanForm';

const LessonPlanEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch lesson plan data
  const { data: lessonPlan, isLoading: isLoadingPlan, error: planError } = useQuery({
    queryKey: ['lessonPlan', id],
    queryFn: () => lessonPlanService.getById(id as string),
    enabled: !!id,
  });

  // Fetch teaching plans for dropdown
  const { data: teachingPlans = [], isLoading: isLoadingTeachingPlans } = useQuery({
    queryKey: ['teachingPlans'],
    queryFn: teachingPlanService.getAll,
  });

  // Handle errors using useEffect
  useEffect(() => {
    if (planError) {
      toast({
        title: "Erro ao carregar plano de aula",
        description: (planError as Error).message || "Não foi possível carregar os dados do plano de aula.",
        variant: "destructive",
      });
    }
  }, [planError]);

  // Update mutation
  const mutation = useMutation({
    mutationFn: (values: LessonPlanFormValues) => {
      // Convert string date to ISO string if needed
      const formattedValues = {
        ...values,
        date: values.date instanceof Date ? values.date.toISOString() : values.date
      };
      return lessonPlanService.update(id as string, formattedValues);
    },
    onSuccess: () => {
      toast({
        title: "Plano de aula atualizado",
        description: "O plano de aula foi atualizado com sucesso.",
      });
      navigate(`/lesson-plans/${id}`);
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar",
        description: (error as Error).message || "Ocorreu um erro ao atualizar o plano de aula.",
        variant: "destructive",
      });
    }
  });

  const isLoading = isLoadingPlan || isLoadingTeachingPlans;

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
          <p>Carregando dados do plano de aula...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (planError || !lessonPlan) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500 mb-4">Erro ao carregar o plano de aula. O ID informado pode ser inválido.</p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <h1 className="text-2xl font-bold">Editar Plano de Aula</h1>
        </div>
      </div>

      <LessonPlanForm
        initialData={lessonPlan}
        onSubmit={mutation.mutate}
        isSubmitting={mutation.isPending}
        teachingPlans={teachingPlans}
      />
    </div>
  );
};

export default LessonPlanEdit;
