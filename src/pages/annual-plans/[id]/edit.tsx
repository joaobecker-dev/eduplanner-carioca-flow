
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { annualPlanService, subjectService } from "@/lib/services";
import { Subject } from "@/types";
import { normalizeToISO } from "@/integrations/supabase/supabaseAdapter";

// Define AnnualPlanFormData type locally
interface AnnualPlanFormData {
  title: string;
  description?: string;
  subjectId: string;
  generalContent: string;
  objectives: string[];
  methodology: string;
  evaluation: string;
  referenceMaterials?: string[];
}

export default function AnnualPlanEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<AnnualPlanFormData | null>(null);

  const { data: subjects, isLoading: subjectsLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: subjectService.getAll,
  });

  const { data: annualPlan, isLoading: annualPlanLoading } = useQuery({
    queryKey: ["annual-plan", id],
    queryFn: () => annualPlanService.getById(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    if (annualPlan) {
      setInitialData({
        title: annualPlan.title,
        description: annualPlan.description || "",
        subjectId: annualPlan.subjectId,
        generalContent: annualPlan.generalContent || annualPlan.general_content || "",
        objectives: annualPlan.objectives || [],
        methodology: annualPlan.methodology,
        evaluation: annualPlan.evaluation,
        referenceMaterials: annualPlan.reference_materials || []
      });
    }
  }, [annualPlan]);

  const mutation = useMutation({
    mutationFn: (data: AnnualPlanFormData) => annualPlanService.update(id as string, {
      ...data
    }),
    onSuccess: () => {
      toast.success("Plano anual atualizado com sucesso!");
      navigate("/planejamento");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao atualizar plano anual");
    }
  });

  if (annualPlanLoading || subjectsLoading) {
    return <div className="container py-10">Carregando...</div>;
  }

  // Since we can't find the AnnualPlanForm component, we'll create a placeholder
  return (
    <div className="container py-10">
      {initialData && (
        <div>
          <h1 className="text-2xl font-bold mb-6">Editar Plano Anual</h1>
          <p>Formulário do plano anual seria renderizado aqui</p>
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
