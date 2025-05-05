
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AssessmentTableStatusProps {
  isLoading: boolean;
  error: unknown;
  onRefresh: () => void;
  isEmpty?: boolean;
}

const AssessmentTableStatus: React.FC<AssessmentTableStatusProps> = ({ 
  isLoading, 
  error, 
  onRefresh,
  isEmpty 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando avaliações...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Erro ao carregar as avaliações</p>
        <Button onClick={onRefresh} className="mt-4">
          Tentar Novamente
        </Button>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Nenhum aluno está atribuído a esta avaliação.</p>
      </div>
    );
  }

  return null;
};

export default AssessmentTableStatus;
