
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { annualPlanService } from '@/lib/services/annualPlanService';
import { subjectService } from '@/lib/services/subjectService';
import { academicPeriodService } from '@/lib/services/academicPeriodService';
import { toast } from '@/hooks/use-toast';
import { AnnualPlanFormValues } from '@/components/forms/AnnualPlanForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnnualPlanForm from '@/components/forms/AnnualPlanForm';

const AnnualPlanEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: annualPlan, isLoading: isLoadingAnnualPlan } = useQuery({
    queryKey: ['annualPlan', id],
    queryFn: () => annualPlanService.getById(id as string),
    enabled: !!id,
  });

  const { data: subjects = [], isLoading: isLoadingSubjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectService.getAll,
  });

  const { data: academicPeriods = [], isLoading: isLoadingAcademicPeriods } = useQuery({
    queryKey: ['academicPeriods'],
    queryFn: academicPeriodService.getAll,
  });

  const updateMutation = useMutation({
    mutationFn: (data: AnnualPlanFormValues) =>
      annualPlanService.update(id as string, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "O plano anual foi atualizado com sucesso!",
      });
      navigate(`/annual-plans/${id}`);
    },
    onError: (error) => {
      console.error("Error updating annual plan:", error);
      toast({
        title: "Error",
        description: "Ocorreu um erro ao atualizar o plano anual.",
        variant: "destructive",
      });
    },
  });

  if (isLoadingAnnualPlan || isLoadingSubjects || isLoadingAcademicPeriods) {
    return <div>Loading...</div>;
  }

  if (!annualPlan) {
    return <div>Annual plan not found</div>;
  }

  // Map the data to the form structure
  const initialData = {
    ...annualPlan,
    generalContent: annualPlan.generalContent,
    referenceMaterials: annualPlan.referenceMaterials || [],
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <h1 className="text-2xl font-bold">Editar Plano Anual</h1>
        </div>
      </div>

      <div className="bg-background rounded-lg border p-6">
        <AnnualPlanForm
          initialData={initialData}
          subjects={subjects}
          academicPeriods={academicPeriods}
          onSubmit={updateMutation.mutate}
          isSubmitting={updateMutation.isPending}
        />
      </div>
    </div>
  );
};

export default AnnualPlanEdit;
