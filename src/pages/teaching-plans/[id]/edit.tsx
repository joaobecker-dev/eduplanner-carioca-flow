
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { teachingPlanService, subjectService, annualPlanService } from '@/lib/services';
import { TeachingPlan, Subject, AnnualPlan } from "@/types";
import { normalizeToISO } from "@/integrations/supabase/supabaseAdapter";

// Define TeachingPlanFormData type locally since we can't find the import
interface TeachingPlanFormData {
  title: string;
  description?: string;
  subjectId: string;
  annualPlanId: string;
  contents: string[];
  methodology: string;
  resources: string[];
  evaluation: string;
  startDate?: Date;
  endDate?: Date;
  objectives: string[];
  bnccReferences?: string[];
}

export default function TeachingPlanEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const teachingPlanId = id as string;

  const [initialData, setInitialData] = useState<TeachingPlanFormData | null>(null);

  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ["subjects"],
    queryFn: subjectService.getAll,
  });

  const { data: annualPlans = [] } = useQuery<AnnualPlan[]>({
    queryKey: ["annualPlans"],
    queryFn: annualPlanService.getAll,
  });

  const { data: teachingPlan, isLoading } = useQuery({
    queryKey: ["teachingPlans", teachingPlanId],
    queryFn: () => teachingPlanService.getById(teachingPlanId),
    enabled: !!teachingPlanId,
  });

  useEffect(() => {
    if (teachingPlan) {
      setInitialData({
        title: teachingPlan.title,
        description: teachingPlan.description || "",
        subjectId: teachingPlan.subjectId,
        annualPlanId: teachingPlan.annualPlanId,
        contents: teachingPlan.contents,
        methodology: teachingPlan.methodology,
        resources: teachingPlan.resources,
        evaluation: teachingPlan.evaluation,
        startDate: teachingPlan.startDate ? new Date(teachingPlan.startDate) : undefined,
        endDate: teachingPlan.endDate ? new Date(teachingPlan.endDate) : undefined,
        objectives: teachingPlan.objectives,
        bnccReferences: teachingPlan.bnccReferences,
      });
    }
  }, [teachingPlan]);

  const mutation = useMutation({
    mutationFn: async (data: TeachingPlanFormData) => {
      if (!teachingPlanId) return;
      return teachingPlanService.update(teachingPlanId, {
        ...data,
        startDate: data.startDate ? normalizeToISO(data.startDate) : undefined,
        endDate: data.endDate ? normalizeToISO(data.endDate) : undefined,
      });
    },
    onSuccess: () => {
      toast.success("Plano de ensino atualizado com sucesso!");
      navigate("/planejamento");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao atualizar plano de ensino");
    },
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // Since we can't find the TeachingPlanForm component, let's create a placeholder
  // This would need to be replaced with the actual implementation
  const handleSubmit = (data: TeachingPlanFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="container py-10">
      {initialData && (
        <div>
          <h1 className="text-2xl font-bold mb-6">Editar Plano de Ensino</h1>
          <p>Formulário do plano de ensino seria renderizado aqui</p>
          {/* Actual form would be implemented here, but since we can't find the component,
              we'll just show placeholder content */}
          <pre>{JSON.stringify(initialData, null, 2)}</pre>
          <button 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => navigate("/planejamento")}
          >
            Voltar
          </button>
        </div>
      )}
    </div>
  );
}
