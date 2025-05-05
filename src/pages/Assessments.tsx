
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AssessmentsModals } from './Assessments/AssessmentsModals';
import { StudentAssessmentModals } from './Assessments/StudentAssessmentModals';
import { useQuery } from '@tanstack/react-query';
import { subjectService, assessmentService, studentService } from '@/lib/services';

const Assessments: React.FC = () => {
  const [refreshCounter, setRefreshCounter] = useState(0);
  
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
      
      {/* Rest of the Assessments page content */}
      <div>
        {/* The existing assessments content would be here */}
      </div>
    </div>
  );
};

export default Assessments;
