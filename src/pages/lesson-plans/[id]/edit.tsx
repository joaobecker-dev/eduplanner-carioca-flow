
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
import { LessonPlan } from '@/types';

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
      // Process string array fields
      const processedValues: Partial<LessonPlan> = {
        ...values,
        // Convert string fields to arrays if they're strings
        objectives: typeof values.objectives === 'string' ? values.objectives.split('\n').filter(Boolean) : values.objectives,
        contents: typeof values.contents === 'string' ? values.contents.split('\n').filter(Boolean) : values.contents,
        activities: typeof values.activities === 'string' ? values.activities.split('\n').filter(Boolean) : values.activities,
        resources: typeof values.resources === 'string' ? values.resources.split('\n').filter(Boolean) : values.resources,
        // Convert Date to ISO string if it's a Date object
        date: values.date instanceof Date ? values.date.toISOString() : values.date
      };
      return lessonPlanService.update(id as string, processedValues);
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

  // Convert string date to Date object for the form
  const formInitialData = {
    ...lessonPlan,
    date: new Date(lessonPlan.date),
    objectives: Array.isArray(lessonPlan.objectives) ? lessonPlan.objectives.join('\n') : lessonPlan.objectives,
    contents: Array.isArray(lessonPlan.contents) ? lessonPlan.contents.join('\n') : lessonPlan.contents,
    activities: Array.isArray(lessonPlan.activities) ? lessonPlan.activities.join('\n') : lessonPlan.activities,
    resources: Array.isArray(lessonPlan.resources) ? lessonPlan.resources.join('\n') : lessonPlan.resources
  };

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
        initialData={formInitialData}
        onSubmit={mutation.mutate}
        isSubmitting={mutation.isPending}
        teachingPlans={teachingPlans}
      />
    </div>
  );
};

export default LessonPlanEdit;
