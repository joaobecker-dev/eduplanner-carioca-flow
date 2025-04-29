import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, FileText, BarChartBig, FolderOpen, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import SectionHeader from '@/components/ui-components/SectionHeader';
import DashboardCard from '@/components/ui-components/DashboardCard';
import StatsCard from '@/components/ui-components/StatsCard';
import { CalendarEvent, TeachingPlan, LessonPlan, Assessment, Material } from '@/types';
import { services } from '@/lib/services';
import { toast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [teachingPlans, setTeachingPlans] = useState<TeachingPlan[]>([]);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Get current date and format it for API calls
        const now = new Date();
        const twoWeeksFromNow = new Date(now);
        twoWeeksFromNow.setDate(now.getDate() + 14);
        
        const startDate = now.toISOString();
        const endDate = twoWeeksFromNow.toISOString();
        
        // Fetch all needed data
        const [
          teachingPlansData,
          lessonPlansData,
          assessmentsData,
          materialsData,
          eventsData
        ] = await Promise.all([
          services.teachingPlan.getAll(),
          services.lessonPlan.getAll(),
          services.assessment.getAll(),
          services.material.getAll(),
          services.calendarEvent.getByDateRange(startDate, endDate)
        ]);
        
        setTeachingPlans(teachingPlansData);
        setLessonPlans(lessonPlansData);
        setAssessments(assessmentsData);
        setMaterials(materialsData);
        setUpcomingEvents(eventsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Erro ao carregar dados do dashboard",
          description: "Não foi possível obter os dados. Por favor, tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Format date to Brazilian Portuguese format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  // Get day of week in Portuguese
  const getDayOfWeek = (dateString: string): string => {
    const date = new Date(dateString);
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[date.getDay()];
  };

  const formatEventTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader 
        title="Dashboard" 
        description="Bem-vindo ao EduPlanner" 
        icon={BookOpen}
      />
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="w-full h-32 animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="Planos de Ensino" 
              value={teachingPlans.length} 
              icon={FileText} 
              color="blue"
            />
            <StatsCard 
              title="Planos de Aula" 
              value={lessonPlans.length} 
              icon={BookOpen}
              color="green"
            />
            <StatsCard 
              title="Avaliações" 
              value={assessments.length} 
              icon={BarChartBig}
              color="orange"
            />
            <StatsCard 
              title="Materiais" 
              value={materials.length} 
              icon={FolderOpen}
              color="purple"
            />
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Quick Access */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-lg font-semibold">Acesso Rápido</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DashboardCard 
                  title="Planos de Ensino"
                  icon={FileText}
                  count={teachingPlans.length}
                  actionLabel="Gerenciar Planos"
                  onAction={() => navigate('/planejamento')}
                  color="blue"
                  items={teachingPlans.slice(0, 4).map(plan => plan.title)}
                />
                
                <DashboardCard 
                  title="Avaliações"
                  icon={BarChartBig}
                  count={assessments.length}
                  actionLabel="Ver Avaliações"
                  onAction={() => navigate('/avaliacoes')}
                  color="orange"
                  items={assessments.slice(0, 4).map(assessment => assessment.title)}
                />
                
                <DashboardCard 
                  title="Materiais"
                  icon={FolderOpen}
                  count={materials.length}
                  actionLabel="Acessar Materiais"
                  onAction={() => navigate('/materiais')}
                  color="purple"
                  items={materials.slice(0, 4).map(material => material.title)}
                />
                
                <DashboardCard 
                  title="Calendário"
                  icon={CalendarIcon}
                  count={upcomingEvents.length}
                  actionLabel="Ver Calendário"
                  onAction={() => navigate('/calendario')}
                  color="green"
                  items={upcomingEvents.slice(0, 4).map(event => event.title)}
                />
              </div>
            </div>

            {/* Right Column - Upcoming Events */}
            <div className="lg:col-span-1">
              <Card>
                <div className="bg-edu-blue-700 text-white p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Próximos Eventos</h3>
                    <CalendarIcon size={18} />
                  </div>
                </div>
                <CardContent className="p-0 max-h-[400px] overflow-y-auto">
                  {upcomingEvents.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {upcomingEvents.slice(0, 6).map((event) => (
                        <div key={event.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-start gap-3">
                            <div className="bg-edu-blue-100 text-edu-blue-700 p-2 rounded-md text-center min-w-14">
                              <div className="text-xs font-semibold">{getDayOfWeek(event.startDate).substring(0, 3)}</div>
                              <div className="text-lg font-bold">{formatDate(event.startDate).split('/')[0]}</div>
                            </div>
                            <div>
                              <h4 className="font-medium text-edu-gray-800">{event.title}</h4>
                              <div className="flex items-center text-xs text-edu-gray-500 mt-1">
                                <span>{formatEventTime(event.startDate)}</span>
                                {event.location && (
                                  <span className="ml-2 px-2 py-0.5 bg-edu-gray-100 rounded-full">
                                    {event.location}
                                  </span>
                                )}
                              </div>
                              {event.description && (
                                <p className="text-xs text-edu-gray-600 mt-1">{event.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-edu-gray-500">
                      <p>Nenhum evento próximo</p>
                    </div>
                  )}
                  {upcomingEvents.length > 6 && (
                    <div className="p-3 text-center border-t">
                      <button 
                        className="text-edu-blue-600 text-sm hover:underline"
                        onClick={() => navigate('/calendario')}
                      >
                        Ver todos os eventos
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
