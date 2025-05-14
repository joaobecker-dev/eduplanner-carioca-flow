
import React from 'react';
import TeachingPlanModals from './TeachingPlanModals';
import { AnnualPlanModals } from './AnnualPlanModals';
import LessonPlanModals from './LessonPlanModals';

interface PlanningModalsProps {
  modalType?: string; 
  isOpen?: boolean;
  closeModal?: () => void;
  onSuccess?: () => void;
  teachingPlans?: any[];
  planId?: string | null;
  refreshData?: () => void;
  subjects?: any[];
  academicPeriods?: any[];
  annualPlans?: any[];
}

// This is a simplified version - the actual component might be more complex
const PlanningModals: React.FC<PlanningModalsProps> = ({ 
  modalType, 
  isOpen = false, 
  closeModal = () => {}, 
  onSuccess = () => {}, 
  teachingPlans = [], 
  planId = null,
  refreshData = () => {},
  subjects = [],
  academicPeriods = [],
  annualPlans = []
}) => {
  // We'll adapt according to what's available in the codebase
  
  switch (modalType) {
    case 'teachingPlan':
      return (
        <TeachingPlanModals 
          showCreateModal={isOpen}
          setShowCreateModal={() => closeModal()}
          showDeleteModal={false}
          setShowDeleteModal={() => {}}
          selectedPlan={planId ? { id: planId } : null}
          setSelectedPlan={() => {}}
          showEditModal={false}
          setShowEditModal={() => {}}
          subjects={subjects}
          annualPlans={annualPlans}
          refreshPlans={refreshData}
        />
      );
    case 'annualPlan':
      return (
        <AnnualPlanModals
          subjects={subjects}
          academicPeriods={academicPeriods}
          refreshData={refreshData}
        />
      );
    case 'lessonPlan':
      return (
        <LessonPlanModals 
          isOpen={isOpen}
          setIsOpen={() => closeModal()}
          teachingPlans={teachingPlans}
          onSuccess={onSuccess}
        />
      );
    default:
      return null;
  }
};

export default PlanningModals;
