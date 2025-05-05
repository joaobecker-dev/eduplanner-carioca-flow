
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatsCard from '@/components/ui-components/StatsCard';
import { 
  FileText, 
  BookOpen, 
  BarChart, 
  CalendarIcon, 
  Users,
  PenTool,
  FolderOpen,
  Layers
} from 'lucide-react';
import { 
  AcademicPeriod, 
  Subject, 
  AnnualPlan,
  TeachingPlan, 
  LessonPlan, 
  Assessment,
  Material,
  CalendarEvent
} from '@/types';

interface DashboardSummaryProps {
  isLoading: boolean;
  academicPeriods: AcademicPeriod[];
  subjects: Subject[];
  annualPlans: AnnualPlan[];
  teachingPlans: TeachingPlan[];
  lessonPlans: LessonPlan[];
  assessments: Assessment[];
  materials: Material[];
  upcomingEvents: CalendarEvent[];
  onRefresh?: () => void;
  // Add compatibility with the older props structure
  stats?: Array<{ label: string; value: number | string }>;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  isLoading,
  academicPeriods = [],
  subjects = [],
  annualPlans = [],
  teachingPlans = [],
  lessonPlans = [],
  assessments = [],
  materials = [],
  upcomingEvents = [],
  onRefresh,
  stats
}) => {
  // If stats prop is provided (older usage), render using that
  if (stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.label}
            value={stat.value}
            icon={index === 0 ? BookOpen : index === 1 ? Users : index === 2 ? PenTool : BarChart}
            color={index === 0 ? 'blue' : index === 1 ? 'purple' : index === 2 ? 'green' : 'orange'}
            isLoading={isLoading}
          />
        ))}
      </div>
    );
  }

  // Count for upcoming week events
  const upcomingWeekEvents = upcomingEvents.filter(event => {
    const eventDate = new Date(event.startDate);
    const now = new Date();
    const weekFromNow = new Date();
    weekFromNow.setDate(now.getDate() + 7);
    return eventDate >= now && eventDate <= weekFromNow;
  }).length;
  
  // Count Teaching Plans by status
  const activePlans = teachingPlans.filter(plan => {
    const now = new Date();
    const startDate = new Date(plan.startDate);
    const endDate = new Date(plan.endDate);
    return startDate <= now && now <= endDate;
  }).length;

  // Count Lesson Plans by status
  const upcomingLessons = lessonPlans.filter(lesson => {
    const lessonDate = new Date(lesson.date);
    const now = new Date();
    return lessonDate > now;
  }).length;
  
  // Count evaluations by type
  const testsCount = assessments.filter(assessment => 
    assessment.type === "diagnostic" || assessment.type === "formative" || assessment.type === "summative"
  ).length;
  
  const assignmentsCount = assessments.length - testsCount;
  
  // Calculate materials by type distribution
  const documentCount = materials.filter(material => material.type === "document").length;
  const videoCount = materials.filter(material => material.type === "video").length;
  const linkCount = materials.filter(material => material.type === "link").length;
  const imageCount = materials.filter(material => material.type === "image").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Visão Geral</h3>
        {onRefresh && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onRefresh} 
            disabled={isLoading}
            className="h-8 w-8"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Períodos Acadêmicos" 
          value={academicPeriods.length} 
          icon={Layers}
          color="purple"
          isLoading={isLoading}
        />
        
        <StatsCard 
          title="Disciplinas" 
          value={subjects.length}
          icon={BookOpen}
          color="blue"
          isLoading={isLoading}
        />
        
        <StatsCard 
          title="Planos de Ensino"
          value={teachingPlans.length}
          subtitle={`${activePlans} ativos`}
          icon={FileText}
          color="green"
          isLoading={isLoading}
        />
        
        <StatsCard 
          title="Planos de Aula"
          value={lessonPlans.length}
          subtitle={`${upcomingLessons} próximas`}
          icon={PenTool}
          color="blue"
          isLoading={isLoading}
        />
        
        <StatsCard 
          title="Avaliações"
          value={assessments.length}
          subtitle={`${testsCount} provas, ${assignmentsCount} trabalhos`}
          icon={BarChart}
          color="orange"
          isLoading={isLoading}
        />
        
        <StatsCard 
          title="Materiais"
          value={materials.length}
          subtitle={`${documentCount} docs, ${videoCount} vídeos, ${linkCount} links`}
          icon={FolderOpen}
          color="purple"
          isLoading={isLoading}
        />
        
        <StatsCard 
          title="Eventos"
          value={upcomingEvents.length}
          subtitle={`${upcomingWeekEvents} nesta semana`}
          icon={CalendarIcon}
          color="red"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default DashboardSummary;
