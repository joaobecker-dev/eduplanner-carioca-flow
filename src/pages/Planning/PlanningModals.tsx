
import React from 'react';
import { AnnualPlan, TeachingPlan, LessonPlan } from '@/types';
import { AnnualPlanModals } from './AnnualPlanModals';
import TeachingPlanModals from './TeachingPlanModals';
import { LessonPlanModals } from './LessonPlanModals';

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
  // Initialize the required props for TeachingPlanModals
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<TeachingPlan | null>(null);
  const [showEditModal, setShowEditModal] = React.useState(false);

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
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
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
