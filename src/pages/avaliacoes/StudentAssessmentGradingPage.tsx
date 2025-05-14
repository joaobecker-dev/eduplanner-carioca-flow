
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Assessment } from '@/types';
import { assessmentService } from '@/lib/services';
import { StudentAssessmentTable } from '@/components/StudentAssessmentTable';

interface StudentAssessmentGradingPageProps {
  assessmentId?: string;
}

const StudentAssessmentGradingPage: React.FC<StudentAssessmentGradingPageProps> = ({ assessmentId: propAssessmentId }) => {
  const { assessmentId: paramAssessmentId } = useParams();
  // Use the prop if provided, otherwise use the param
  const assessmentId = propAssessmentId || paramAssessmentId;
  
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAssessment = async () => {
      if (assessmentId) {
        try {
          const data = await assessmentService.getById(assessmentId);
          setAssessment(data);
        } catch (error) {
          console.error("Error fetching assessment:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAssessment();
  }, [assessmentId]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!assessment) {
    return <div>Erro ao carregar dados da avaliação</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Correção de Avaliação</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold">{assessment.title}</h2>
        {assessment.description && (
          <p className="text-gray-600 mt-2">{assessment.description}</p>
        )}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Tipo</p>
            <p>{assessment.type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Data</p>
            <p>{new Date(assessment.date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pontuação Máxima</p>
            <p>{assessment.totalPoints || '-'}</p>
          </div>
        </div>
      </div>

      <StudentAssessmentTable
        assessmentId={assessmentId as string}
      />
    </div>
  );
};

export default StudentAssessmentGradingPage;
