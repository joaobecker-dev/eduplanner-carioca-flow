
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { assessmentService } from "@/lib/services/assessmentService";
import { subjectService } from "@/lib/services/subjectService";
import { teachingPlanService } from "@/lib/services/teachingPlanService";
import { Button } from "@/components/ui/button";
import { DetailSection } from "@/components/ui/detail-section";
import { DetailField } from "@/components/ui/detail-field";
import { ArrowLeft, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils/date-formatter";

const AssessmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: assessment, isLoading, error } = useQuery({
    queryKey: ["assessment", id],
    queryFn: () => assessmentService.getById(id as string),
    enabled: !!id,
  });

  // Handle error using useEffect instead of inline onError
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Erro ao carregar avaliação",
        description: (error as Error).message || "Não foi possível carregar os dados da avaliação.",
        variant: "destructive",
      });
    }
  }, [error]);

  const { data: subject } = useQuery({
    queryKey: ["subject", assessment?.subjectId],
    queryFn: () => subjectService.getById(assessment?.subjectId as string),
    enabled: !!assessment?.subjectId,
  });

  const { data: teachingPlan } = useQuery({
    queryKey: ["teachingPlan", assessment?.teachingPlanId],
    queryFn: () => teachingPlanService.getById(assessment?.teachingPlanId as string),
    enabled: !!assessment?.teachingPlanId,
  });

  // Map assessment types to Portuguese display text
  const getAssessmentTypeDisplay = (type: string): string => {
    const typeMap: Record<string, string> = {
      'diagnostic': 'Diagnóstica',
      'formative': 'Formativa',
      'summative': 'Somativa'
    };
    return typeMap[type] || type;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando avaliação...</p>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">Erro ao carregar a avaliação. O ID informado pode ser inválido.</p>
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
          <h1 className="text-2xl font-bold">{assessment.title}</h1>
          {assessment.description && (
            <p className="text-gray-600 mt-1">{assessment.description}</p>
          )}
        </div>
        <Button onClick={() => navigate(`/assessments/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" /> Editar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DetailSection title="Informações Gerais">
          <DetailField 
            label="Tipo de Avaliação" 
            value={getAssessmentTypeDisplay(assessment.type)} 
          />
          <DetailField 
            label="Total de Pontos" 
            value={assessment.total_points || assessment.totalPoints} 
          />
        </DetailSection>

        <DetailSection title="Disciplina">
          <DetailField 
            label="Disciplina" 
            value={subject?.name || "–"} 
          />
          <DetailField 
            label="Plano de Ensino" 
            value={teachingPlan?.title || "Não vinculado"} 
          />
        </DetailSection>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailSection title="Datas">
          <DetailField 
            label="Data da Avaliação" 
            value={formatDate(assessment.date)} 
          />
          <DetailField 
            label="Data de Entrega" 
            value={formatDate(assessment.due_date || assessment.dueDate)} 
          />
        </DetailSection>
      </div>
    </div>
  );
};

export default AssessmentDetail;
