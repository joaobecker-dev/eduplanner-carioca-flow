
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import SectionHeader from '@/components/ui-components/SectionHeader';
import DashboardSummary from '@/components/ui-components/DashboardSummary';
import DashboardCard from '@/components/ui-components/DashboardCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { calendarEventService, subjectService, studentService } from '@/lib/services';

// Simple dashboard without charts for now
const DashboardPage = () => {
  // Fetch calendar events for upcoming items
  const { data: calendarEvents = [] } = useQuery({
    queryKey: ['calendarEvents'],
    queryFn: calendarEventService.getAll,
  });

  // Fetch subjects
  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectService.getAll,
  });

  // Fetch students
  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: studentService.getAll,
  });

  // Get upcoming exams (next 7 days)
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);
  
  const upcomingExams = calendarEvents
    .filter(event => 
      event.type === 'exam' && 
      new Date(event.startDate) >= now && 
      new Date(event.startDate) <= nextWeek
    );

  return (
    <div className="container mx-auto p-4">
      <SectionHeader 
        title="Dashboard" 
        description="Visão geral das principais informações"
      />
      
      <DashboardSummary 
        stats={[
          { label: "Disciplinas", value: subjects.length },
          { label: "Avaliações", value: calendarEvents.filter(e => e.type === 'exam').length },
          { label: "Aulas", value: calendarEvents.filter(e => e.type === 'class').length },
          { label: "Alunos", value: students.length }
        ]}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <DashboardCard
          title="Próximas Avaliações"
          description={`${upcomingExams.length} avaliações nos próximos 7 dias`}
          className="col-span-1"
        >
          <div className="space-y-4">
            {upcomingExams.length === 0 && (
              <p className="text-gray-500 text-sm italic">Nenhuma avaliação nos próximos 7 dias</p>
            )}
            
            {upcomingExams.slice(0, 3).map(exam => (
              <div key={exam.id} className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium">{exam.title}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(exam.startDate).toLocaleDateString()}
                </p>
              </div>
            ))}
            
            {upcomingExams.length > 0 && (
              <Button variant="link" asChild>
                <Link to="/calendar">Ver todas</Link>
              </Button>
            )}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default DashboardPage;
