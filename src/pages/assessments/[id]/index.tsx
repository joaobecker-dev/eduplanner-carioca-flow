import React from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assessmentService } from '@/lib/services';
import { formatDate } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ArrowLeft, Calendar } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import DetailField from '@/components/ui-components/DetailField';
import DetailSection from '@/components/ui-components/DetailSection';
import PageHeader from '@/components/ui-components/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { Assessment } from '@/types';

const AssessmentDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const { data: assessment, isLoading: loading } = useQuery({
    queryKey: ['assessment', id],
    queryFn: () => assessmentService.getById(id as string),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => assessmentService.delete(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      toast({
        title: 'Avaliação excluída',
        description: 'A avaliação foi excluída com sucesso.',
      });
      router.push('/assessments');
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao excluir',
        description: error.message || 'Ocorreu um erro ao excluir a avaliação.',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
    setDeleteDialogOpen(false);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full max-w-sm" />
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-32 w-full" />
        </div>
      );
    }

    if (!assessment) {
      return <div>Avaliação não encontrada</div>;
    }

    return (
      <div className="space-y-6">
        <DetailField
          label="Título"
          value={assessment.title}
        />

        {assessment.description && (
          <DetailField
            label="Descrição"
            value={assessment.description}
          />
        )}

        <DetailField
          label="Tipo"
          value={getAssessmentTypeLabel(assessment.type)}
        />

        <DetailField
          label="Data"
          value={formatDate(assessment.date)}
        />

        <DetailField
          label="Pontuação total"
          value={assessment.totalPoints ? `${assessment.totalPoints} pontos` : 'Não definida'}
        />

        <DetailField
          label="Peso"
          value={assessment.weight ? `${assessment.weight}` : 'Não definido'}
        />

        {assessment.dueDate && (
          <DetailField
            label="Data de entrega"
            value={formatDate(assessment.dueDate)}
          />
        )}

        {assessment.subjectId && (
          <DetailField
            label="Disciplina"
            value={assessment.subject?.name || assessment.subjectId}
          />
        )}

        {assessment.teachingPlanId && (
          <DetailField
            label="Plano de ensino"
            value={assessment.teachingPlan?.title || assessment.teachingPlanId}
          />
        )}
      </div>
    );
  };

  const getAssessmentTypeLabel = (type: string): string => {
    const types: Record<string, string> = {
      'exam': 'Prova',
      'quiz': 'Questionário',
      'assignment': 'Trabalho',
      'project': 'Projeto',
      'presentation': 'Apresentação',
      'participation': 'Participação',
      'other': 'Outro'
    };
    return types[type] || type;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Detalhes da Avaliação"
        description="Visualize os detalhes da avaliação"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/assessments/${id}/edit`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/assessments/${id}/grades`)}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Notas
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </div>
        }
      />

      <div className="bg-white shadow rounded-lg p-6">
        {renderContent()}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AssessmentDetail;
