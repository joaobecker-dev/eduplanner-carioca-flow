
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Edit } from 'lucide-react';
import { AssessmentsModals } from './Assessments/AssessmentsModals';
import StudentAssessmentModals from './Assessments/StudentAssessmentModals';
import { useQuery } from '@tanstack/react-query';
import { subjectService, assessmentService, studentService, studentAssessmentService } from '@/lib/services';

const Assessments: React.FC = () => {
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [assessmentsWithStudents, setAssessmentsWithStudents] = useState<Record<string, boolean>>({});
  
  // Fetch subjects
  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectService.getAll,
  });

  // Fetch teaching plans
  const { data: teachingPlans = [] } = useQuery({
    queryKey: ['teachingPlans'],
    queryFn: async () => {
      // This is a simplification - if needed, implement proper filtering
      return await Promise.resolve([]);
    },
  });

  // Fetch assessments
  const { data: assessments = [], refetch: refetchAssessments } = useQuery({
    queryKey: ['assessments', refreshCounter],
    queryFn: assessmentService.getAll,
  });

  // Fetch students
  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: studentService.getAll,
  });

  // Check which assessments have students assigned
  useEffect(() => {
    const checkAssessmentsWithStudents = async () => {
      const result: Record<string, boolean> = {};
      
      for (const assessment of assessments) {
        try {
          const studentAssessments = await studentAssessmentService.getByAssessment(assessment.id);
          result[assessment.id] = studentAssessments.length > 0;
        } catch (error) {
          console.error(`Error checking student assessments for ${assessment.id}:`, error);
          result[assessment.id] = false;
        }
      }
      
      setAssessmentsWithStudents(result);
    };
    
    if (assessments.length > 0) {
      checkAssessmentsWithStudents();
    }
  }, [assessments]);

  const refreshData = () => {
    setRefreshCounter(prev => prev + 1);
    refetchAssessments();
  };

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
      <AssessmentsModals 
        subjects={subjects}
        teachingPlans={teachingPlans}
        refreshData={refreshData}
      />
      <StudentAssessmentModals 
        students={students}
        assessments={assessments}
        refreshData={refreshData}
      />
      
      {/* Display assessments with grading button */}
      <div className="grid gap-4 mt-6">
        <h2 className="text-xl font-semibold">Avaliações Disponíveis</h2>
        
        {assessments.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma avaliação encontrada.</p>
        ) : (
          <div className="grid gap-4">
            {assessments.map((assessment) => (
              <div 
                key={assessment.id} 
                className="p-4 border rounded-md bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{assessment.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {assessment.type === 'diagnostic' ? 'Diagnóstica' : 
                       assessment.type === 'formative' ? 'Formativa' : 'Somativa'} • 
                      {' '}Pontos: {assessment.totalPoints}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {assessmentsWithStudents[assessment.id] && (
                      <Button variant="outline" asChild>
                        <Link to={`/avaliacoes/correcao/${assessment.id}`}>
                          <Edit className="mr-1 h-4 w-4" />
                          Corrigir Alunos
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessments;
