
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardSummary from '@/components/ui-components/DashboardSummary';
import DashboardCard from '@/components/ui-components/DashboardCard';
import { Link } from 'react-router-dom';
import { subjectService, studentService, calendarEventService } from '@/lib/services';

// Simple dashboard without charts for now
const Dashboard: React.FC = () => {
  const now = new Date();
  const today = format(now, 'yyyy-MM-dd');
  
  // Fetch data
  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectService.getAll
  });

  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: studentService.getAll
  });

  const { data: events = [] } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: calendarEventService.getAll
  });

  // Stats for the summary cards
  const subjectsCount = subjects.length;
  const studentsCount = students.length;
  const classesCount = events && Array.isArray(events) ? events.filter((event: any) => event.type === 'class').length : 0;
  const examsCount = events && Array.isArray(events) ? events.filter((event: any) => event.type === 'exam').length : 0;

  // Get today's events
  const todayEvents = events && Array.isArray(events) ? events.filter((event: any) => {
    const eventDate = format(new Date(event.startDate), 'yyyy-MM-dd');
    return eventDate === today;
  }) : [];

  // Get upcoming events (next 7 days)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const upcomingEvents = events && Array.isArray(events) ? events.filter((event: any) => {
    const eventDate = new Date(event.startDate);
    return eventDate > now && eventDate <= nextWeek;
  }).slice(0, 5) : [];  // Get only the first 5 events

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      
      <DashboardSummary 
        isLoading={false}
        academicPeriods={[]}
        subjects={subjects}
        annualPlans={[]}
        teachingPlans={[]}
        lessonPlans={[]}
        assessments={[]}
        materials={[]}
        upcomingEvents={[]}
        stats={[
          { label: 'Disciplinas', value: subjectsCount },
          { label: 'Estudantes', value: studentsCount },
          { label: 'Aulas', value: classesCount },
          { label: 'Avaliações', value: examsCount }
        ]} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashboardCard 
          title="Eventos de Hoje" 
          description={`${todayEvents.length} eventos agendados`} 
          className="min-h-[350px]"
        >
          {todayEvents.length > 0 ? (
            <div className="space-y-2">
              {todayEvents.map((event: any) => (
                <Card key={event.id} className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">{format(new Date(event.startDate), 'HH:mm')}</p>
                      </div>
                      <div className="text-xs font-medium px-2 py-1 rounded-full" 
                           style={{ backgroundColor: event.color ? `${event.color}33` : '#e2e8f0', 
                                    color: event.color || '#1f2937' }}>
                        {event.type}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-4 py-8">
              <p className="text-muted-foreground">Nenhum evento agendado para hoje</p>
              <Button asChild variant="outline">
                <Link to="/calendar">Ir para Calendário</Link>
              </Button>
            </div>
          )}
        </DashboardCard>
        
        <DashboardCard 
          title="Próximos Eventos" 
          description="Nos próximos 7 dias" 
          className="min-h-[350px]"
        >
          {upcomingEvents.length > 0 ? (
            <div className="space-y-2">
              {upcomingEvents.map((event: any) => (
                <Card key={event.id} className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">{format(new Date(event.startDate), 'dd/MM - HH:mm')}</p>
                      </div>
                      <div className="text-xs font-medium px-2 py-1 rounded-full" 
                           style={{ backgroundColor: event.color ? `${event.color}33` : '#e2e8f0', 
                                    color: event.color || '#1f2937' }}>
                        {event.type}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-4 py-8">
              <p className="text-muted-foreground">Nenhum evento nos próximos dias</p>
              <Button asChild variant="outline">
                <Link to="/calendar">Ir para Calendário</Link>
              </Button>
            </div>
          )}
        </DashboardCard>
      </div>
    </div>
  );
};

export default Dashboard;
