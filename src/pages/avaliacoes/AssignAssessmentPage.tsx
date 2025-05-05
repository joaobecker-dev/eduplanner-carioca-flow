
import React from 'react';
import { Link } from 'react-router-dom';
import { AssignAssessmentForm } from '@/components/forms/AssignAssessmentForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const AssignAssessmentPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Atribuir Avaliação</h1>
          <p className="text-gray-500 mt-1">
            Atribua avaliações para alunos ou classes inteiras
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/avaliacoes">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <AssignAssessmentForm />
    </div>
  );
};

export default AssignAssessmentPage;
