
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { annualPlanService } from "@/lib/services/annualPlanService";
import { subjectService } from "@/lib/services/subjectService";
import { academicPeriodService } from "@/lib/services/academicPeriodService";
import { Button } from "@/components/ui/button";
import { DetailSection } from "@/components/ui/detail-section";
import { DetailField } from "@/components/ui/detail-field";
import { DetailList } from "@/components/ui/detail-list";
import { ArrowLeft, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AnnualPlanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: annualPlan, isLoading, error } = useQuery({
    queryKey: ["annualPlan", id],
    queryFn: () => annualPlanService.getById(id as string),
    enabled: !!id,
    onError: (err: any) => {
      toast({
        title: "Erro ao carregar plano anual",
        description: err.message || "Não foi possível carregar os dados do plano anual.",
        variant: "destructive",
      });
    },
  });

  const { data: subject } = useQuery({
    queryKey: ["subject", annualPlan?.subjectId],
    queryFn: () => subjectService.getById(annualPlan?.subjectId as string),
    enabled: !!annualPlan?.subjectId,
  });

  const { data: academicPeriod } = useQuery({
    queryKey: ["academicPeriod", annualPlan?.academicPeriodId],
    queryFn: () => academicPeriodService.getById(annualPlan?.academicPeriodId as string),
    enabled: !!annualPlan?.academicPeriodId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando plano anual...</p>
      </div>
    );
  }

  if (error || !annualPlan) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">Erro ao carregar o plano anual. O ID informado pode ser inválido.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
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
          <h1 className="text-2xl font-bold">{annualPlan.title}</h1>
          {annualPlan.description && (
            <p className="text-gray-600 mt-1">{annualPlan.description}</p>
          )}
        </div>
        <Button onClick={() => navigate(`/annual-plans/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" /> Editar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DetailSection title="Informações Gerais">
          <DetailField 
            label="Período Acadêmico" 
            value={academicPeriod?.name || "–"} 
          />
          <DetailField 
            label="Disciplina" 
            value={subject?.name || "–"} 
          />
        </DetailSection>

        <DetailSection title="Objetivos">
          <DetailList items={annualPlan.objectives || []} />
        </DetailSection>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <DetailSection title="Conteúdo Geral">
          <div className="whitespace-pre-wrap">
            {annualPlan.generalContent || "Não informado"}
          </div>
        </DetailSection>

        <DetailSection title="Metodologia">
          <div className="whitespace-pre-wrap">
            {annualPlan.methodology || "Não informado"}
          </div>
        </DetailSection>

        <DetailSection title="Avaliação">
          <div className="whitespace-pre-wrap">
            {annualPlan.evaluation || "Não informado"}
          </div>
        </DetailSection>

        <DetailSection title="Materiais de Referência">
          <DetailList 
            items={annualPlan.referenceMaterials || []} 
            emptyMessage="Nenhum material de referência informado" 
          />
        </DetailSection>
      </div>
    </div>
  );
};

export default AnnualPlanDetail;
