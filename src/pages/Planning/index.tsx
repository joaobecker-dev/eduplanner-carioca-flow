
import React, { useState, useEffect } from 'react';
import Planning from '../Planning';
import { PlanningModals } from './PlanningModals';
import { 
  academicPeriodService, 
  subjectService, 
  annualPlanService, 
  teachingPlanService, 
  lessonPlanService 
} from '@/lib/services';

const PlanningPage: React.FC = () => {
  const [academicPeriods, setAcademicPeriods] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [annualPlans, setAnnualPlans] = useState([]);
  const [teachingPlans, setTeachingPlans] = useState([]);
  const [lessonPlans, setLessonPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [academicPeriodsData, subjectsData, annualPlansData, teachingPlansData, lessonPlansData] = await Promise.all([
        academicPeriodService.getAll(),
        subjectService.getAll(),
        annualPlanService.getAll(),
        teachingPlanService.getAll(),
        lessonPlanService.getAll()
      ]);
      
      setAcademicPeriods(academicPeriodsData);
      setSubjects(subjectsData);
      setAnnualPlans(annualPlansData);
      setTeachingPlans(teachingPlansData);
      setLessonPlans(lessonPlansData);
    } catch (error) {
      console.error('Error fetching planning data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Planning />
      <PlanningModals
        subjects={subjects}
        academicPeriods={academicPeriods}
        annualPlans={annualPlans}
        teachingPlans={teachingPlans}
        refreshData={fetchData}
      />
    </>
  );
};

export default PlanningPage;
