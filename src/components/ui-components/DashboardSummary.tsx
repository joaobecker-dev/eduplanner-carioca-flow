
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatsCard from '@/components/ui-components/StatsCard';
import { AcademicPeriod, Subject, AnnualPlan, TeachingPlan, LessonPlan, Assessment, Material, CalendarEvent } from '@/types';

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
  onRefresh: () => void;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  isLoading,
  academicPeriods,
  subjects,
  annualPlans,
  teachingPlans,
  lessonPlans,
  assessments,
  materials,
  upcomingEvents,
  onRefresh
}) => {
  // Calculate the number of events per type
  const classEvents = upcomingEvents.filter(event => event.type === 'class').length;
  const examEvents = upcomingEvents.filter(event => event.type === 'exam').length;
  const otherEvents = upcomingEvents.length - classEvents - examEvents;

  // Calculate the number of days until the next event
  const getNextEventDays = () => {
    if (upcomingEvents.length === 0) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextEventDate = upcomingEvents
      .map(event => new Date(event.startDate))
      .sort((a, b) => a.getTime() - b.getTime())[0];
    
    const diffTime = nextEventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const nextEventDays = getNextEventDays();

  // Calculate the number of materials per type
  const documentMaterials = materials.filter(material => material.type === 'document').length;
  const videoMaterials = materials.filter(material => material.type === 'video').length;
  const otherMaterials = materials.length - documentMaterials - videoMaterials;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Resumo</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          {isLoading ? 'Atualizando...' : 'Atualizar dados'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Períodos e Disciplinas"
          value={`${academicPeriods.length} / ${subjects.length}`}
          description={`${academicPeriods.length} períodos e ${subjects.length} disciplinas`}
          color="blue"
        />
        
        <StatsCard
          title="Planos"
          value={annualPlans.length + teachingPlans.length + lessonPlans.length}
          description={`${annualPlans.length} anuais, ${teachingPlans.length} de ensino, ${lessonPlans.length} de aula`}
          color="green"
        />
        
        <StatsCard
          title="Avaliações"
          value={assessments.length}
          description={nextEventDays !== null ? `Próxima em ${nextEventDays} dias` : 'Nenhuma próxima avaliação'}
          color="orange"
        />
        
        <StatsCard
          title="Materiais"
          value={materials.length}
          description={`${documentMaterials} documentos, ${videoMaterials} vídeos, ${otherMaterials} outros`}
          color="purple"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Eventos no Calendário"
          value={upcomingEvents.length}
          description={`${classEvents} aulas, ${examEvents} avaliações, ${otherEvents} outros`}
          color="blue"
        />
        
        <StatsCard
          title="Atividades Avaliativas"
          value={assessments.filter(a => a.type === 'test' || a.type === 'project').length}
          description={`${assessments.filter(a => a.type === 'test').length} provas, ${assessments.filter(a => a.type === 'project').length} projetos`}
          color="orange"
        />
        
        <StatsCard
          title="Planos de Aula Esta Semana"
          value={lessonPlans.filter(plan => {
            const planDate = new Date(plan.date);
            const today = new Date();
            const nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 7);
            return planDate >= today && planDate <= nextWeek;
          }).length}
          description="Planos para os próximos 7 dias"
          color="green"
        />
      </div>
    </div>
  );
};

export default DashboardSummary;
