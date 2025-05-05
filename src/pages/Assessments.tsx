import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AssessmentsModals } from './Assessments/AssessmentsModals';
import { StudentAssessmentModals } from './Assessments/StudentAssessmentModals';

const Assessments: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Avaliações</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/avaliacoes/atribuir">
              <Plus className="mr-1 h-4 w-4" />
              Atribuir Avaliação
            </Link>
          </Button>
        </div>
      </div>

      {/* Assessment modals and other content */}
      <AssessmentsModals />
      <StudentAssessmentModals />
      
      {/* Rest of the Assessments page content */}
      <div>
        {/* The existing assessments content would be here */}
      </div>
    </div>
  );
};

export default Assessments;
