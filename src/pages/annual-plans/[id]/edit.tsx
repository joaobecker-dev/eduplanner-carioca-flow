import { AnnualPlanFormData } from "@/schemas/annualPlanSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import AnnualPlanForm from "~/components/forms/AnnualPlanForm";
import { annualPlanService, subjectService } from "~/lib/services";
import { annualPlanSchema } from "~/schemas/annualPlanSchema";
import { normalizeToISO } from "@/integrations/supabase/supabaseAdapter";

export default function AnnualPlanEdit() {
  const router = useRouter();
  const { id } = router.query;
  const [initialData, setInitialData] = React.useState<AnnualPlanFormData | null>(null);

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
        schoolYear: annualPlan.schoolYear,
        objectives: annualPlan.objectives,
        methodology: annualPlan.methodology,
        evaluation: annualPlan.evaluation,
        resources: annualPlan.resources,
        references: annualPlan.references,
        startDate: annualPlan.startDate ? new Date(annualPlan.startDate) : undefined,
        endDate: annualPlan.endDate ? new Date(annualPlan.endDate) : undefined,
      });
    }
  }, [annualPlan]);

  const mutation = useMutation({
    mutationFn: (data: AnnualPlanFormData) => annualPlanService.update(id as string, data),
  });

  // Find the form submit handler and fix the date handling
  const handleSubmit = async (values: FormData) => {
    if (!initialData) return;
    
    try {
      await onSubmit({
        title: values.title,
        description: values.description,
        subjectId: values.subjectId,
        schoolYear: values.schoolYear,
        objectives: values.objectives,
        methodology: values.methodology,
        evaluation: values.evaluation,
        resources: values.resources,
        references: values.references,
        // Convert Date objects to strings
        startDate: values.startDate ? normalizeToISO(values.startDate) : undefined,
        endDate: values.endDate ? normalizeToISO(values.endDate) : undefined,
      });
      toast.success("Plano anual atualizado com sucesso!");
      router.push("/planejamento");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar plano anual");
    }
  };

  const onSubmit = async (data: AnnualPlanFormData) => {
    await annualPlanService.update(id as string, data);
  };

  return (
    <div className="container py-10">
      {initialData && (
        <AnnualPlanForm
          initialData={initialData}
          onSubmit={mutation.mutate}
          isSubmitting={mutation.isPending}
          subjects={subjects}
        />
      )}
    </div>
  );
}
