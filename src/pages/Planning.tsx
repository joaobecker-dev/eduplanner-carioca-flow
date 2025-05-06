import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SectionHeader from '@/components/ui-components/SectionHeader';
import { services } from '@/lib/services';
import { Card, CardContent } from '@/components/ui/card';
import { AnnualPlanModals } from './Planning/AnnualPlanModals';
import { TeachingPlanModals } from './Planning/TeachingPlanModals';
import { LessonPlanModals } from './Planning/LessonPlanModals';
import { AssessmentModals } from './Planning/AssessmentModals';

const Planning = () => {
  const [activeTab, setActiveTab] = useState('annual-plans');

  // Fixed useQuery calls using proper options object
  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: services.subject.getAll,
  });

  const { data: annualPlans = [] } = useQuery({
    queryKey: ['annual-plans'],
    queryFn: services.annualPlan.getAll,
  });

  const { data: teachingPlans = [] } = useQuery({
    queryKey: ['teaching-plans'],
    queryFn: services.teachingPlan.getAll,
  });

  const { data: lessonPlans = [] } = useQuery({
    queryKey: ['lesson-plans'],
    queryFn: services.lessonPlan.getAll,
  });

  const { data: assessments = [] } = useQuery({
    queryKey: ['assessments'],
    queryFn: services.assessment.getAll,
  });
  
  return (
    <div className="w-full flex flex-col gap-4">
      <SectionHeader title="Planejamento" description="Gerencie seu planejamento anual, planos de ensino, planos de aula e avaliações">
        <Button asChild>
          <Link to="/planning/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo
          </Link>
        </Button>
      </SectionHeader>

      <div className="w-full border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('annual-plans')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'annual-plans'
              ? 'border-blue-500 text-blue-600 dark:text-blue-500'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
          >
            Planos Anuais
          </button>
          <button
            onClick={() => setActiveTab('teaching-plans')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'teaching-plans'
              ? 'border-blue-500 text-blue-600 dark:text-blue-500'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
          >
            Planos de Ensino
          </button>
          <button
            onClick={() => setActiveTab('lesson-plans')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'lesson-plans'
              ? 'border-blue-500 text-blue-600 dark:text-blue-500'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
          >
            Planos de Aula
          </button>
          <button
            onClick={() => setActiveTab('assessments')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'assessments'
              ? 'border-blue-500 text-blue-600 dark:text-blue-500'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
          >
            Avaliações
          </button>
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTab === 'annual-plans' && (
          <AnnualPlanModals annualPlans={annualPlans} subjects={subjects} />
        )}
        {activeTab === 'teaching-plans' && (
          <TeachingPlanModals teachingPlans={teachingPlans} subjects={subjects} annualPlans={annualPlans} />
        )}
        {activeTab === 'lesson-plans' && (
          <LessonPlanModals lessonPlans={lessonPlans} teachingPlans={teachingPlans} />
        )}
        {activeTab === 'assessments' && (
          <AssessmentModals assessments={assessments} subjects={subjects} teachingPlans={teachingPlans} />
        )}
      </div>
    </div>
  );
};

export default Planning;
