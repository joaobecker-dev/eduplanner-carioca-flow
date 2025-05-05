
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { StudentAssessmentTable } from '@/components/StudentAssessmentTable';
import { assessmentService } from '@/lib/services';
import { ArrowLeft } from 'lucide-react';

export default function StudentAssessmentGradingPage() {
  const { assessmentId = '' } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  
  const { data: assessment, isLoading, error } = useQuery({
    queryKey: ['assessment', assessmentId],
    queryFn: () => assessmentService.getById(assessmentId),
    enabled: !!assessmentId,
  });

  const handleBack = () => {
    navigate('/avaliacoes');
  };

  if (isLoading) {
    return <div className="container mx-auto py-8">Carregando...</div>;
  }

  if (error || !assessment) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-md bg-destructive/10 p-4 mb-4">
          <p className="text-destructive">
            Erro ao carregar a avaliação. Verifique se o ID está correto.
          </p>
        </div>
        <Button onClick={handleBack}>Voltar para Avaliações</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center">
            <Button variant="outline" size="sm" onClick={handleBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
            </Button>
            <h1 className="text-2xl font-bold">{assessment.title}</h1>
          </div>
          <p className="text-muted-foreground">
            Correção de avaliação • {assessment.type === 'diagnostic' ? 'Diagnóstica' : 
                                     assessment.type === 'formative' ? 'Formativa' : 
                                     assessment.type === 'summative' ? 'Somativa' : ''}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-md border shadow-sm">
        <div className="p-6">
          <StudentAssessmentTable assessmentId={assessmentId} />
        </div>
      </div>
    </div>
  );
}
