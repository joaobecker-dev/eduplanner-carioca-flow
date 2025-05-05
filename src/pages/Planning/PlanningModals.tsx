
import React from 'react';
import { AnnualPlan, TeachingPlan, LessonPlan } from '@/types';
import AnnualPlanModals from './AnnualPlanModals';
import TeachingPlanModals from './TeachingPlanModals';
import LessonPlanModals from './LessonPlanModals';

interface PlanningModalsProps {
  subjects: any[];
  academicPeriods: any[];
  annualPlans: any[];
  teachingPlans: any[];
  refreshData: () => void;
}

const PlanningModals: React.FC<PlanningModalsProps> = ({
  subjects, 
  academicPeriods, 
  annualPlans, 
  teachingPlans,
  refreshData
}) => {
  return (
    <>
      <AnnualPlanModals
        subjects={subjects}
        academicPeriods={academicPeriods}
        refreshData={refreshData}
      />
      
      <TeachingPlanModals
        subjects={subjects}
        annualPlans={annualPlans}
        refreshPlans={refreshData} // We're passing refreshData to match the TeachingPlanModalsProps
      />
      
      <LessonPlanModals
        teachingPlans={teachingPlans}
        refreshData={refreshData}
      />
    </>
  );
};

// Export both the component and handlers for parent components
export { 
  PlanningModals,
  type PlanningModalsProps
};
