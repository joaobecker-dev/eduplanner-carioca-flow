
import React, { useState, useEffect } from 'react';
import { FileText, BookOpen, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import SectionHeader from '@/components/ui-components/SectionHeader';
import { services } from '@/lib/services';
import { toast } from '@/hooks/use-toast';
import { AnnualPlan, TeachingPlan, LessonPlan, Subject, AcademicPeriod } from '@/types';
import { PlanningModals } from './PlanningModals';
import AdvancedFilter, { FilterGroup } from '@/components/ui-components/AdvancedFilter';

const Planning: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('annual-plans');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Data state
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [academicPeriods, setAcademicPeriods] = useState<AcademicPeriod[]>([]);
  const [annualPlans, setAnnualPlans] = useState<AnnualPlan[]>([]);
  const [teachingPlans, setTeachingPlans] = useState<TeachingPlan[]>([]);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);

  // Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedAnnualPlan, setSelectedAnnualPlan] = useState<string>('all');
  const [selectedTeachingPlan, setSelectedTeachingPlan] = useState<string>('all');
  
  // Filtered data
  const [filteredAnnualPlans, setFilteredAnnualPlans] = useState<AnnualPlan[]>([]);
  const [filteredTeachingPlans, setFilteredTeachingPlans] = useState<TeachingPlan[]>([]);
  const [filteredLessonPlans, setFilteredLessonPlans] = useState<LessonPlan[]>([]);

  // Load initial data
  useEffect(() => {
    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    // Filter annual plans
    let filtered = [...annualPlans];
    
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(plan => plan.subjectId === selectedSubject);
    }
    
    if (selectedPeriod !== 'all') {
      filtered = filtered.filter(plan => plan.academicPeriodId === selectedPeriod);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(plan => 
        plan.title.toLowerCase().includes(query) || 
        (plan.description && plan.description.toLowerCase().includes(query))
      );
    }
    
    setFilteredAnnualPlans(filtered);
  }, [annualPlans, selectedSubject, selectedPeriod, searchQuery]);

  useEffect(() => {
    // Filter teaching plans
    let filtered = [...teachingPlans];
    
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(plan => plan.subjectId === selectedSubject);
    }
    
    if (selectedAnnualPlan !== 'all') {
      filtered = filtered.filter(plan => plan.annualPlanId === selectedAnnualPlan);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(plan => 
        plan.title.toLowerCase().includes(query) || 
        (plan.description && plan.description.toLowerCase().includes(query))
      );
    }
    
    setFilteredTeachingPlans(filtered);
  }, [teachingPlans, selectedSubject, selectedAnnualPlan, searchQuery]);

  useEffect(() => {
    // Filter lesson plans
    let filtered = [...lessonPlans];
    
    if (selectedTeachingPlan !== 'all') {
      filtered = filtered.filter(plan => plan.teachingPlanId === selectedTeachingPlan);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(plan => 
        plan.title.toLowerCase().includes(query)
      );
    }
    
    setFilteredLessonPlans(filtered);
  }, [lessonPlans, selectedTeachingPlan, searchQuery]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [subjectsData, periodsData, annualPlansData, teachingPlansData, lessonPlansData] = await Promise.all([
        services.subject.getAll(),
        services.academicPeriod.getAll(),
        services.annualPlan.getAll(),
        services.teachingPlan.getAll(),
        services.lessonPlan.getAll(),
      ]);
      
      setSubjects(subjectsData);
      setAcademicPeriods(periodsData);
      setAnnualPlans(annualPlansData);
      setTeachingPlans(teachingPlansData);
      setLessonPlans(lessonPlansData);

      // Set initial filtered data
      setFilteredAnnualPlans(annualPlansData);
      setFilteredTeachingPlans(teachingPlansData);
      setFilteredLessonPlans(lessonPlansData);
    } catch (error) {
      console.error('Error fetching planning data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados de planejamento.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSubject('all');
    setSelectedPeriod('all');
    setSelectedAnnualPlan('all');
    setSelectedTeachingPlan('all');
  };
  
  const getSubjectName = (id?: string): string => {
    if (!id) return 'Geral';
    const subject = subjects.find(s => s.id === id);
    return subject ? subject.name : 'Disciplina não encontrada';
  };

  const getPeriodName = (id?: string): string => {
    if (!id) return 'Geral';
    const period = academicPeriods.find(p => p.id === id);
    return period ? period.name : 'Período não encontrado';
  };
  
  const getAnnualPlanName = (id?: string): string => {
    if (!id) return 'Geral';
    const plan = annualPlans.find(p => p.id === id);
    return plan ? plan.title : 'Plano não encontrado';
  };

  const getTeachingPlanName = (id?: string): string => {
    if (!id) return 'Geral';
    const plan = teachingPlans.find(p => p.id === id);
    return plan ? plan.title : 'Plano não encontrado';
  };

  // Build filter groups for AdvancedFilter component
  const annualPlanFilterGroups: FilterGroup[] = [
    {
      id: 'subject',
      label: 'Disciplina',
      value: selectedSubject,
      onChange: setSelectedSubject,
      options: [
        { label: 'Todas as Disciplinas', value: 'all' },
        ...subjects.map(subject => ({
          label: subject.name,
          value: subject.id
        }))
      ]
    },
    {
      id: 'period',
      label: 'Período Acadêmico',
      value: selectedPeriod,
      onChange: setSelectedPeriod,
      options: [
        { label: 'Todos os Períodos', value: 'all' },
        ...academicPeriods.map(period => ({
          label: period.name,
          value: period.id
        }))
      ]
    }
  ];

  const teachingPlanFilterGroups: FilterGroup[] = [
    {
      id: 'subject',
      label: 'Disciplina',
      value: selectedSubject,
      onChange: setSelectedSubject,
      options: [
        { label: 'Todas as Disciplinas', value: 'all' },
        ...subjects.map(subject => ({
          label: subject.name,
          value: subject.id
        }))
      ]
    },
    {
      id: 'annualPlan',
      label: 'Plano Anual',
      value: selectedAnnualPlan,
      onChange: setSelectedAnnualPlan,
      options: [
        { label: 'Todos os Planos Anuais', value: 'all' },
        ...annualPlans
          .filter(plan => selectedSubject === 'all' || plan.subjectId === selectedSubject)
          .map(plan => ({
            label: plan.title,
            value: plan.id
          }))
      ]
    }
  ];

  const lessonPlanFilterGroups: FilterGroup[] = [
    {
      id: 'teachingPlan',
      label: 'Plano de Ensino',
      value: selectedTeachingPlan,
      onChange: setSelectedTeachingPlan,
      options: [
        { label: 'Todos os Planos de Ensino', value: 'all' },
        ...teachingPlans.map(plan => ({
          label: plan.title,
          value: plan.id
        }))
      ]
    }
  ];

  // Function to render annual plans
  const renderAnnualPlans = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (filteredAnnualPlans.length === 0) {
      return (
        <div className="text-center py-10">
          <FileText className="mx-auto text-gray-400" size={48} />
          <h3 className="mt-4 text-lg font-medium">Nenhum plano anual encontrado</h3>
          <p className="mt-2 text-sm text-gray-500">
            {searchQuery || selectedSubject !== 'all' || selectedPeriod !== 'all'
              ? 'Tente ajustar os filtros de busca.'
              : 'Crie seu primeiro plano anual para começar.'}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAnnualPlans.map((plan) => (
          <Card key={plan.id} className="card-hover overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg line-clamp-1">{plan.title}</CardTitle>
                  <p className="text-sm text-edu-gray-500">{getSubjectName(plan.subjectId)}</p>
                </div>
                <Badge variant="outline" className="bg-edu-blue-50 text-edu-blue-700">
                  Plano Anual
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pb-4">
              {plan.description && (
                <p className="text-sm text-edu-gray-600 mb-2 line-clamp-2">
                  {plan.description}
                </p>
              )}
              
              <div className="text-xs text-edu-gray-500 flex flex-wrap gap-2 mt-2">
                <span className="bg-edu-blue-50 text-edu-blue-700 px-2 py-1 rounded-md">
                  {getPeriodName(plan.academicPeriodId)}
                </span>
                {plan.objectives && plan.objectives.length > 0 && (
                  <span className="bg-edu-green-50 text-edu-green-700 px-2 py-1 rounded-md">
                    {plan.objectives.length} objetivos
                  </span>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="pt-2 border-t flex justify-between">
              <Button variant="ghost" size="sm" className="text-edu-blue-600"
                onClick={() => planningModalsRef.current?.handleEditAnnualPlan(plan)}>
                Editar
              </Button>
              <Button variant="ghost" size="sm" className="text-red-600"
                onClick={() => planningModalsRef.current?.handleDeleteAnnualPlan(plan)}>
                Excluir
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  // Function to render teaching plans
  const renderTeachingPlans = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (filteredTeachingPlans.length === 0) {
      return (
        <div className="text-center py-10">
          <BookOpen className="mx-auto text-gray-400" size={48} />
          <h3 className="mt-4 text-lg font-medium">Nenhum plano de ensino encontrado</h3>
          <p className="mt-2 text-sm text-gray-500">
            {searchQuery || selectedSubject !== 'all' || selectedAnnualPlan !== 'all'
              ? 'Tente ajustar os filtros de busca.'
              : 'Crie seu primeiro plano de ensino para começar.'}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachingPlans.map((plan) => (
          <Card key={plan.id} className="card-hover overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg line-clamp-1">{plan.title}</CardTitle>
                  <p className="text-sm text-edu-gray-500">{getSubjectName(plan.subjectId)}</p>
                </div>
                <Badge variant="outline" className="bg-edu-green-50 text-edu-green-700">
                  Plano de Ensino
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pb-4">
              {plan.description && (
                <p className="text-sm text-edu-gray-600 mb-2 line-clamp-2">
                  {plan.description}
                </p>
              )}
              
              <div className="text-xs flex flex-wrap gap-2 mt-2">
                <span className="bg-edu-blue-50 text-edu-blue-700 px-2 py-1 rounded-md">
                  {format(new Date(plan.startDate), "dd MMM", { locale: ptBR })} - {format(new Date(plan.endDate), "dd MMM", { locale: ptBR })}
                </span>
                {plan.objectives && plan.objectives.length > 0 && (
                  <span className="bg-edu-green-50 text-edu-green-700 px-2 py-1 rounded-md">
                    {plan.objectives.length} objetivos
                  </span>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="pt-2 border-t flex justify-between">
              <Button variant="ghost" size="sm" className="text-edu-blue-600"
                onClick={() => planningModalsRef.current?.handleEditTeachingPlan(plan)}>
                Editar
              </Button>
              <Button variant="ghost" size="sm" className="text-red-600"
                onClick={() => planningModalsRef.current?.handleDeleteTeachingPlan(plan)}>
                Excluir
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  // Function to render lesson plans
  const renderLessonPlans = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (filteredLessonPlans.length === 0) {
      return (
        <div className="text-center py-10">
          <Calendar className="mx-auto text-gray-400" size={48} />
          <h3 className="mt-4 text-lg font-medium">Nenhum plano de aula encontrado</h3>
          <p className="mt-2 text-sm text-gray-500">
            {searchQuery || selectedTeachingPlan !== 'all'
              ? 'Tente ajustar os filtros de busca.'
              : 'Crie seu primeiro plano de aula para começar.'}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLessonPlans.map((plan) => (
          <Card key={plan.id} className="card-hover overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg line-clamp-1">{plan.title}</CardTitle>
                  <p className="text-sm text-edu-gray-500">{getTeachingPlanName(plan.teachingPlanId)}</p>
                </div>
                <Badge variant="outline" className="bg-edu-orange-50 text-edu-orange-700">
                  Plano de Aula
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pb-4">
              <div className="text-xs flex flex-wrap gap-2 mt-2">
                <span className="bg-edu-blue-50 text-edu-blue-700 px-2 py-1 rounded-md">
                  {format(new Date(plan.date), "dd 'de' MMMM", { locale: ptBR })}
                </span>
                <span className="bg-edu-green-50 text-edu-green-700 px-2 py-1 rounded-md">
                  {plan.duration} minutos
                </span>
                {plan.activities && plan.activities.length > 0 && (
                  <span className="bg-edu-orange-50 text-edu-orange-700 px-2 py-1 rounded-md">
                    {plan.activities.length} atividades
                  </span>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="pt-2 border-t flex justify-between">
              <Button variant="ghost" size="sm" className="text-edu-blue-600"
                onClick={() => planningModalsRef.current?.handleEditLessonPlan(plan)}>
                Editar
              </Button>
              <Button variant="ghost" size="sm" className="text-red-600"
                onClick={() => planningModalsRef.current?.handleDeleteLessonPlan(plan)}>
                Excluir
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  // Create a ref to access PlanningModals methods
  const planningModalsRef = useRef<any>(null);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <SectionHeader
        title="Planejamento"
        description="Gerencie seus planos anuais, de ensino e de aula"
        icon={FileText}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList className="bg-white border">
            <TabsTrigger value="annual-plans">Planos Anuais</TabsTrigger>
            <TabsTrigger value="teaching-plans">Planos de Ensino</TabsTrigger>
            <TabsTrigger value="lesson-plans">Planos de Aula</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            {activeTab === 'annual-plans' && (
              <Button onClick={() => planningModalsRef.current?.handleCreateAnnualPlan()}>
                Novo Plano Anual
              </Button>
            )}
            
            {activeTab === 'teaching-plans' && (
              <Button onClick={() => planningModalsRef.current?.handleCreateTeachingPlan()}>
                Novo Plano de Ensino
              </Button>
            )}
            
            {activeTab === 'lesson-plans' && (
              <Button onClick={() => planningModalsRef.current?.handleCreateLessonPlan()}>
                Novo Plano de Aula
              </Button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <TabsContent value="annual-plans">
            <AdvancedFilter
              filterGroups={annualPlanFilterGroups}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Pesquisar planos anuais..."
              onClearFilters={clearFilters}
              className="mb-6"
            />
            {renderAnnualPlans()}
          </TabsContent>
          
          <TabsContent value="teaching-plans">
            <AdvancedFilter
              filterGroups={teachingPlanFilterGroups}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Pesquisar planos de ensino..."
              onClearFilters={clearFilters}
              className="mb-6"
            />
            {renderTeachingPlans()}
          </TabsContent>
          
          <TabsContent value="lesson-plans">
            <AdvancedFilter
              filterGroups={lessonPlanFilterGroups}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Pesquisar planos de aula..."
              onClearFilters={clearFilters}
              className="mb-6"
            />
            {renderLessonPlans()}
          </TabsContent>
        </div>
      </Tabs>

      {/* Modals for CRUD operations */}
      <PlanningModals
        ref={planningModalsRef}
        subjects={subjects}
        academicPeriods={academicPeriods}
        annualPlans={annualPlans}
        teachingPlans={teachingPlans}
        refreshData={fetchData}
      />
    </div>
  );
};

export default Planning;
