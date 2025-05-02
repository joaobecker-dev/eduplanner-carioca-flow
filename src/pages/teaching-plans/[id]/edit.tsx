import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { services } from "@/lib/services";
import TeachingPlanForm from "@/components/teaching-plan/TeachingPlanForm";
import { TeachingPlanFormData } from "@/components/teaching-plan/types";
import { AnnualPlan, Subject } from "@/types";
import { normalizeToISO } from "@/integrations/supabase/supabaseAdapter";

export default function TeachingPlanEdit() {
  const router = useRouter();
  const { id } = router.query;
  const teachingPlanId = id as string;

  const [initialData, setInitialData] = useState<TeachingPlanFormData | null>(null);

  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ["subjects"],
    queryFn: services.subject.getAll,
  });

    const { data: annualPlans = [] } = useQuery<AnnualPlan[]>({
    queryKey: ["annualPlans"],
    queryFn: services.annualPlan.getAll,
  });

  const { data: teachingPlan, isLoading } = useQuery({
    queryKey: ["teachingPlans", teachingPlanId],
    queryFn: () => services.teachingPlan.getById(teachingPlanId),
    enabled: !!teachingPlanId,
  });

  useEffect(() => {
    if (teachingPlan) {
      setInitialData({
        title: teachingPlan.title,
        description: teachingPlan.description || "",
        subjectId: teachingPlan.subjectId,
        annualPlanId: teachingPlan.annualPlanId,
        content: teachingPlan.content,
        methodology: teachingPlan.methodology,
        resources: teachingPlan.resources,
        evaluation: teachingPlan.evaluation,
        references: teachingPlan.references,
        classDate: teachingPlan.classDate ? new Date(teachingPlan.classDate) : undefined,
      });
    }
  }, [teachingPlan]);

  const mutation = useMutation({
    mutationFn: async (data: TeachingPlanFormData) => {
      if (!teachingPlanId) return;
      return services.teachingPlan.update(teachingPlanId, {
        ...data,
        classDate: data.classDate ? data.classDate.toISOString() : undefined,
      });
    },
    onSuccess: () => {
      toast.success("Plano de aula atualizado com sucesso!");
      router.push("/planejamento");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao atualizar plano de aula");
    },
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container py-10">
      {initialData && (
        <TeachingPlanForm
          initialData={initialData}
          onSubmit={mutation.mutate}
          isSubmitting={mutation.isPending}
          subjects={subjects}
          annualPlans={annualPlans} // Add the missing prop
        />
      )}
    </div>
  );
}
