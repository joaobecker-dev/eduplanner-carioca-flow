
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { teachingPlanService } from "@/lib/services/teachingPlanService";
import { subjectService } from "@/lib/services/subjectService";
import { annualPlanService } from "@/lib/services/annualPlanService";
import { Button } from "@/components/ui/button";
import { DetailSection } from "@/components/ui/detail-section";
import { DetailField } from "@/components/ui/detail-field";
import { DetailList } from "@/components/ui/detail-list";
import { ArrowLeft, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils/date-formatter";

const TeachingPlanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: teachingPlan, isLoading, error } = useQuery({
    queryKey: ["teachingPlan", id],
    queryFn: () => teachingPlanService.getById(id as string),
    enabled: !!id,
    onError: (err: any) => {
      toast({
        title: "Erro ao carregar plano de ensino",
        description: err.message || "Não foi possível carregar os dados do plano de ensino.",
        variant: "destructive",
      });
    },
  });

  const { data: subject } = useQuery({
    queryKey: ["subject", teachingPlan?.subjectId],
    queryFn: () => subjectService.getById(teachingPlan?.subjectId as string),
    enabled: !!teachingPlan?.subjectId,
  });

  const { data: annualPlan } = useQuery({
    queryKey: ["annualPlan", teachingPlan?.annualPlanId],
    queryFn: () => annualPlanService.getById(teachingPlan?.annualPlanId as string),
    enabled: !!teachingPlan?.annualPlanId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando plano de ensino...</p>
      </div>
    );
  }

  if (error || !teachingPlan) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">Erro ao carregar o plano de ensino. O ID informado pode ser inválido.</p>
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
          <h1 className="text-2xl font-bold">{teachingPlan.title}</h1>
          {teachingPlan.description && (
            <p className="text-gray-600 mt-1">{teachingPlan.description}</p>
          )}
        </div>
        <Button onClick={() => navigate(`/teaching-plans/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" /> Editar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DetailSection title="Informações Gerais">
          <DetailField 
            label="Disciplina" 
            value={subject?.name || "–"} 
          />
          <DetailField 
            label="Plano Anual" 
            value={annualPlan?.title || "–"} 
          />
        </DetailSection>

        <DetailSection title="Período">
          <DetailField 
            label="Data de Início" 
            value={formatDate(teachingPlan.startDate)} 
          />
          <DetailField 
            label="Data de Término" 
            value={formatDate(teachingPlan.endDate)} 
          />
        </DetailSection>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DetailSection title="Objetivos">
          <DetailList items={teachingPlan.objectives || []} />
        </DetailSection>

        <DetailSection title="Conteúdos">
          <DetailList items={teachingPlan.contents || []} />
        </DetailSection>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <DetailSection title="Metodologia">
          <div className="whitespace-pre-wrap">
            {teachingPlan.methodology || "Não informado"}
          </div>
        </DetailSection>

        <DetailSection title="Avaliação">
          <div className="whitespace-pre-wrap">
            {teachingPlan.evaluation || "Não informado"}
          </div>
        </DetailSection>

        <DetailSection title="Recursos">
          <DetailList 
            items={teachingPlan.resources || []} 
            emptyMessage="Nenhum recurso informado" 
          />
        </DetailSection>

        <DetailSection title="Referências BNCC">
          <DetailList 
            items={teachingPlan.bnccReferences || []} 
            emptyMessage="Nenhuma referência BNCC informada" 
          />
        </DetailSection>
      </div>
    </div>
  );
};

export default TeachingPlanDetail;
