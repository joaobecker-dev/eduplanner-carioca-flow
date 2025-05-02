
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { teachingPlanService } from '@/lib/services/teachingPlanService';
import { subjectService } from '@/lib/services/subjectService';
import { annualPlanService } from '@/lib/services/annualPlanService';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import TeachingPlanForm from '@/components/forms/TeachingPlanForm';
import { toast } from '@/hooks/use-toast';
import { TeachingPlanFormValues } from '@/components/forms/TeachingPlanForm';

const TeachingPlanEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch teaching plan data
  const { data: teachingPlan, isLoading: isLoadingPlan, error: planError } = useQuery({
    queryKey: ['teachingPlan', id],
    queryFn: () => teachingPlanService.getById(id as string),
    enabled: !!id,
  });

  // Fetch subjects
  const { data: subjects = [], isLoading: isLoadingSubjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectService.getAll,
  });

  // Fetch annual plans
  const { data: annualPlans = [], isLoading: isLoadingAnnualPlans } = useQuery({
    queryKey: ['annualPlans'],
    queryFn: annualPlanService.getAll,
  });

  // Handle errors using useEffect
  useEffect(() => {
    if (planError) {
      toast({
        title: "Erro ao carregar plano de ensino",
        description: (planError as Error).message || "Não foi possível carregar os dados do plano de ensino.",
        variant: "destructive",
      });
    }
  }, [planError]);

  // Update mutation
  const mutation = useMutation({
    mutationFn: (values: TeachingPlanFormValues) => {
      // Convert date objects to ISO strings
      const formattedValues = {
        ...values,
        startDate: values.startDate instanceof Date ? values.startDate.toISOString() : values.startDate,
        endDate: values.endDate instanceof Date ? values.endDate.toISOString() : values.endDate
      };
      
      return teachingPlanService.update(id as string, formattedValues);
    },
    onSuccess: () => {
      toast({
        title: "Plano de ensino atualizado",
        description: "O plano de ensino foi atualizado com sucesso.",
      });
      navigate(`/teaching-plans/${id}`);
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar",
        description: (error as Error).message || "Ocorreu um erro ao atualizar o plano de ensino.",
        variant: "destructive",
      });
    }
  });

  const isLoading = isLoadingPlan || isLoadingSubjects || isLoadingAnnualPlans;

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
          <p>Carregando dados do plano de ensino...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (planError || !teachingPlan) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500 mb-4">Erro ao carregar o plano de ensino. O ID informado pode ser inválido.</p>
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
          <h1 className="text-2xl font-bold">Editar Plano de Ensino</h1>
        </div>
      </div>

      <TeachingPlanForm
        initialData={teachingPlan}
        onSubmit={mutation.mutate}
        isSubmitting={mutation.status === "pending"}
        subjects={subjects}
        annualPlans={annualPlans}
      />
    </div>
  );
};

export default TeachingPlanEdit;
