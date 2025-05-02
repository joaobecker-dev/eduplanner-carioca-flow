
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { annualPlanService } from '@/lib/services/annualPlanService';
import { subjectService } from '@/lib/services/subjectService';
import { academicPeriodService } from '@/lib/services/academicPeriodService';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AnnualPlanForm from '@/components/forms/AnnualPlanForm';
import { toast } from '@/hooks/use-toast';
import { AnnualPlanFormValues } from '@/components/forms/AnnualPlanForm';

const AnnualPlanEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch annual plan data
  const { data: annualPlan, isLoading: isLoadingPlan, error: planError } = useQuery({
    queryKey: ['annualPlan', id],
    queryFn: () => annualPlanService.getById(id as string),
    enabled: !!id,
  });

  // Fetch subjects
  const { data: subjects = [], isLoading: isLoadingSubjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectService.getAll,
  });

  // Fetch academic periods
  const { data: academicPeriods = [], isLoading: isLoadingPeriods } = useQuery({
    queryKey: ['academicPeriods'],
    queryFn: academicPeriodService.getAll,
  });

  // Handle errors using useEffect
  useEffect(() => {
    if (planError) {
      toast({
        title: "Erro ao carregar plano anual",
        description: (planError as Error).message || "Não foi possível carregar os dados do plano anual.",
        variant: "destructive",
      });
    }
  }, [planError]);

  // Update mutation
  const mutation = useMutation({
    mutationFn: (values: AnnualPlanFormValues) => annualPlanService.update(id as string, values),
    onSuccess: () => {
      toast({
        title: "Plano anual atualizado",
        description: "O plano anual foi atualizado com sucesso.",
      });
      navigate(`/annual-plans/${id}`);
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar",
        description: (error as Error).message || "Ocorreu um erro ao atualizar o plano anual.",
        variant: "destructive",
      });
    }
  });

  const isLoading = isLoadingPlan || isLoadingSubjects || isLoadingPeriods;

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
          <p>Carregando dados do plano anual...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (planError || !annualPlan) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500 mb-4">Erro ao carregar o plano anual. O ID informado pode ser inválido.</p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </div>
      </div>
    );
  }

  // Prepare data for the form
  const formInitialData = {
    ...annualPlan,
    // Map any snake_case properties to camelCase as needed
    referenceMaterials: annualPlan.reference_materials || [],
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <h1 className="text-2xl font-bold">Editar Plano Anual</h1>
        </div>
      </div>

      <AnnualPlanForm
        initialData={formInitialData}
        onSubmit={mutation.mutate}
        isSubmitting={mutation.isLoading}
        subjects={subjects}
        academicPeriods={academicPeriods}
      />
    </div>
  );
};

export default AnnualPlanEdit;
