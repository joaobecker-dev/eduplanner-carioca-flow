
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { lessonPlanService } from "@/lib/services/lessonPlanService";
import { teachingPlanService } from "@/lib/services/teachingPlanService";
import { Button } from "@/components/ui/button";
import { DetailSection } from "@/components/ui/detail-section";
import { DetailField } from "@/components/ui/detail-field";
import { DetailList } from "@/components/ui/detail-list";
import { ArrowLeft, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils/date-formatter";

const LessonPlanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: lessonPlan, isLoading, error } = useQuery({
    queryKey: ["lessonPlan", id],
    queryFn: () => lessonPlanService.getById(id as string),
    enabled: !!id,
  });

  // Handle error using useEffect instead of inline onError
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Erro ao carregar plano de aula",
        description: (error as Error).message || "Não foi possível carregar os dados do plano de aula.",
        variant: "destructive",
      });
    }
  }, [error]);

  const { data: teachingPlan } = useQuery({
    queryKey: ["teachingPlan", lessonPlan?.teachingPlanId],
    queryFn: () => teachingPlanService.getById(lessonPlan?.teachingPlanId as string),
    enabled: !!lessonPlan?.teachingPlanId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando plano de aula...</p>
      </div>
    );
  }

  if (error || !lessonPlan) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">Erro ao carregar o plano de aula. O ID informado pode ser inválido.</p>
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
          <h1 className="text-2xl font-bold">{lessonPlan.title}</h1>
        </div>
        <Button onClick={() => navigate(`/lesson-plans/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" /> Editar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DetailSection title="Informações Gerais">
          <DetailField 
            label="Data" 
            value={formatDate(lessonPlan.date)} 
          />
          <DetailField 
            label="Duração" 
            value={`${lessonPlan.duration} minutos`} 
          />
          <DetailField 
            label="Plano de Ensino" 
            value={teachingPlan?.title || "–"} 
          />
        </DetailSection>

        <DetailSection title="Objetivos">
          <DetailList items={lessonPlan.objectives || []} />
        </DetailSection>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DetailSection title="Conteúdos">
          <DetailList items={lessonPlan.contents || []} />
        </DetailSection>

        <DetailSection title="Atividades">
          <DetailList items={lessonPlan.activities || []} />
        </DetailSection>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DetailSection title="Recursos">
          <DetailList items={lessonPlan.resources || []} />
        </DetailSection>

        <DetailSection title="Tarefa de Casa">
          <div className="whitespace-pre-wrap">
            {lessonPlan.homework || "Não informado"}
          </div>
        </DetailSection>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailSection title="Avaliação">
          <div className="whitespace-pre-wrap">
            {lessonPlan.evaluation || "Não informado"}
          </div>
        </DetailSection>

        <DetailSection title="Observações">
          <div className="whitespace-pre-wrap">
            {lessonPlan.notes || "Não informado"}
          </div>
        </DetailSection>
      </div>
    </div>
  );
};

export default LessonPlanDetail;
