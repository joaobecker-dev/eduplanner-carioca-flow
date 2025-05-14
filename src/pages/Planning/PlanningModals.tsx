
import React from 'react';
import { TeachingPlanModal } from './TeachingPlanModals';
import { AnnualPlanModal } from './AnnualPlanModals';
import { LessonPlanModal } from './LessonPlanModals';

// This is a simplified version - the actual component might be more complex
// Update the props or usage pattern as needed
const PlanningModals = ({ 
  modalType, 
  isOpen, 
  closeModal, 
  onSuccess, 
  teachingPlans = [], 
  planId = null,
  refreshData, // Add missing refreshData prop
}) => {
  // We'll adapt according to what's available in the codebase
  // This is a simplified example
  
  switch (modalType) {
    case 'teachingPlan':
      return (
        <TeachingPlanModal 
          isOpen={isOpen} 
          closeModal={closeModal} 
          onSuccess={onSuccess}
          planId={planId}
          refreshData={refreshData}
        />
      );
    case 'annualPlan':
      return (
        <AnnualPlanModal 
          isOpen={isOpen} 
          closeModal={closeModal} 
          onSuccess={onSuccess}
          planId={planId}
          refreshData={refreshData}
        />
      );
    case 'lessonPlan':
      return (
        <LessonPlanModal 
          isOpen={isOpen} 
          closeModal={closeModal} 
          onSuccess={onSuccess}
          planId={planId}
          teachingPlans={teachingPlans}
          refreshData={refreshData}
        />
      );
    default:
      return null;
  }
};

export default PlanningModals;
