
import React, { useState, useEffect, useRef } from 'react';
import { 
  Layers, 
  BookOpen,
  FileText,
  PenTool,
  ChevronDown,
  ChevronUp,
  Filter,
  Search
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SectionHeader from '@/components/ui-components/SectionHeader';
import { 
  AcademicPeriod, 
  Subject, 
  AnnualPlan, 
  TeachingPlan, 
  LessonPlan 
} from '@/types';
import { services } from '@/lib/services';
import { toast } from '@/hooks/use-toast';
import { PlanningModals } from './PlanningModals';
import AdvancedFilter, { FilterGroup } from '@/components/ui-components/AdvancedFilter';
import DeleteConfirmationDialog from '@/components/ui-components/DeleteConfirmationDialog';

const Planning: React.FC = () => {
  // States for data
  const [isLoading, setIsLoading] = useState(true);
  const [academicPeriods, setAcademicPeriods] = useState<AcademicPeriod[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [annualPlans, setAnnualPlans] = useState<AnnualPlan[]>([]);
  const [teachingPlans, setTeachingPlans] = useState<TeachingPlan[]>([]);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAcademicPeriod, setSelectedAcademicPeriod] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedPlanType, setSelectedPlanType] = useState<string>("all");
  
  // Filtered data states
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [filteredAnnualPlans, setFilteredAnnualPlans] = useState<AnnualPlan[]>([]);
  const [filteredTeachingPlans, setFilteredTeachingPlans] = useState<TeachingPlan[]>([]);
  const [filteredLessonPlans, setFilteredLessonPlans] = useState<LessonPlan[]>([]);
  
  // Expanded sections state
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const [expandedAnnualPlans, setExpandedAnnualPlans] = useState<Set<string>>(new Set());
  const [expandedTeachingPlans, setExpandedTeachingPlans] = useState<Set<string>>(new Set());
  
  // Reference to the modals component
  const planningModalsRef = useRef(null);
  
  // Delete confirmation dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemType, setDeleteItemType] = useState<'annual' | 'teaching' | 'lesson' | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all data on component mount
  useEffect(() => {
    fetchData();
  }, []);
  
  // Filter and process data when filters change
  useEffect(() => {
    applyFilters();
  }, [academicPeriods, subjects, annualPlans, teachingPlans, lessonPlans, searchQuery, selectedAcademicPeriod, selectedSubject, selectedPlanType]);
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [
        academicPeriodsData, 
        subjectsData, 
        annualPlansData, 
        teachingPlansData, 
        lessonPlansData
      ] = await Promise.all([
        services.academicPeriod.getAll(),
        services.subject.getAll(),
        services.annualPlan.getAll(),
        services.teachingPlan.getAll(),
        services.lessonPlan.getAll(),
      ]);
      
      setAcademicPeriods(academicPeriodsData);
      setSubjects(subjectsData);
      setAnnualPlans(annualPlansData);
      setTeachingPlans(teachingPlansData);
      setLessonPlans(lessonPlansData);
    } catch (error) {
      console.error('Error fetching planning data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Ocorreu um erro ao buscar os dados de planejamento.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const applyFilters = () => {
    // Filter subjects
    let filteredSubjs = [...subjects];
    if (selectedAcademicPeriod !== 'all') {
      filteredSubjs = filteredSubjs.filter(subject => 
        subject.academicPeriodId === selectedAcademicPeriod
      );
    }
    
    // Filter annual plans
    let filteredAnnuals = [...annualPlans];
    if (selectedAcademicPeriod !== 'all') {
      const subjectIds = filteredSubjs.map(s => s.id);
      filteredAnnuals = filteredAnnuals.filter(plan => 
        subjectIds.includes(plan.subjectId)
      );
    }
    if (selectedSubject !== 'all') {
      filteredAnnuals = filteredAnnuals.filter(plan =>
        plan.subjectId === selectedSubject
      );
    }
    
    // Filter teaching plans
    let filteredTeachings = [...teachingPlans];
    if (selectedPlanType !== 'all' && selectedPlanType !== 'teaching') {
      filteredTeachings = [];
    } else {
      if (selectedAcademicPeriod !== 'all') {
        const annualPlanIds = filteredAnnuals.map(a => a.id);
        filteredTeachings = filteredTeachings.filter(plan =>
          annualPlanIds.includes(plan.annualPlanId)
        );
      }
      if (selectedSubject !== 'all') {
        filteredTeachings = filteredTeachings.filter(plan =>
          plan.subjectId === selectedSubject
        );
      }
    }
    
    // Filter lesson plans
    let filteredLessons = [...lessonPlans];
    if (selectedPlanType !== 'all' && selectedPlanType !== 'lesson') {
      filteredLessons = [];
    } else {
      if (selectedAcademicPeriod !== 'all' || selectedSubject !== 'all') {
        const teachingPlanIds = filteredTeachings.map(t => t.id);
        filteredLessons = filteredLessons.filter(plan =>
          teachingPlanIds.includes(plan.teachingPlanId)
        );
      }
    }
    
    // Apply search query to all filtered items if provided
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      
      filteredSubjs = filteredSubjs.filter(subject =>
        subject.name.toLowerCase().includes(query) ||
        subject.grade.toLowerCase().includes(query)
      );
      
      filteredAnnuals = filteredAnnuals.filter(plan =>
        plan.title.toLowerCase().includes(query) ||
        (plan.description?.toLowerCase().includes(query))
      );
      
      filteredTeachings = filteredTeachings.filter(plan =>
        plan.title.toLowerCase().includes(query) ||
        (plan.description?.toLowerCase().includes(query))
      );
      
      filteredLessons = filteredLessons.filter(plan =>
        plan.title.toLowerCase().includes(query) ||
        plan.contents.some(content => content.toLowerCase().includes(query)) ||
        plan.objectives.some(obj => obj.toLowerCase().includes(query)) ||
        (plan.notes?.toLowerCase().includes(query))
      );
    }
    
    setFilteredSubjects(filteredSubjs);
    setFilteredAnnualPlans(filteredAnnuals);
    setFilteredTeachingPlans(filteredTeachings);
    setFilteredLessonPlans(filteredLessons);
  };

  const getAcademicPeriodName = (id: string) => {
    const period = academicPeriods.find(p => p.id === id);
    return period ? period.name : 'Desconhecido';
  };

  const getSubjectName = (id: string) => {
    const subject = subjects.find(s => s.id === id);
    return subject ? subject.name : 'Desconhecido';
  };

  const getAnnualPlanTitle = (id: string) => {
    const plan = annualPlans.find(p => p.id === id);
    return plan ? plan.title : 'Desconhecido';
  };

  const getTeachingPlanTitle = (id: string) => {
    const plan = teachingPlans.find(p => p.id === id);
    return plan ? plan.title : 'Desconhecido';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const toggleSubjectExpanded = (id: string) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSubjects(newExpanded);
  };

  const toggleAnnualPlanExpanded = (id: string) => {
    const newExpanded = new Set(expandedAnnualPlans);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedAnnualPlans(newExpanded);
  };

  const toggleTeachingPlanExpanded = (id: string) => {
    const newExpanded = new Set(expandedTeachingPlans);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedTeachingPlans(newExpanded);
  };

  const filterGroups: FilterGroup[] = [
    {
      id: 'academicPeriod',
      label: 'Período Acadêmico',
      value: selectedAcademicPeriod,
      onChange: setSelectedAcademicPeriod,
      options: [
        { label: 'Todos os Períodos', value: 'all' },
        ...academicPeriods.map(period => ({
          label: period.name,
          value: period.id
        }))
      ]
    },
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
      id: 'planType',
      label: 'Tipo de Plano',
      value: selectedPlanType,
      onChange: setSelectedPlanType,
      options: [
        { label: 'Todos os Planos', value: 'all' },
        { label: 'Planos de Ensino', value: 'teaching' },
        { label: 'Planos de Aula', value: 'lesson' }
      ]
    }
  ];

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedAcademicPeriod('all');
    setSelectedSubject('all');
    setSelectedPlanType('all');
  };
  
  // Delete handlers
  const handleDeleteClick = (type: 'annual' | 'teaching' | 'lesson', id: string) => {
    setDeleteItemType(type);
    setDeleteItemId(id);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!deleteItemType || !deleteItemId) return;
    
    setIsDeleting(true);
    try {
      let success = false;
      
      switch (deleteItemType) {
        case 'annual':
          success = await services.annualPlan.delete(deleteItemId);
          if (success) {
            // Also refetch teaching plans as they might have been cascaded
            setAnnualPlans(plans => plans.filter(p => p.id !== deleteItemId));
            toast({
              title: "Plano anual excluído",
              description: "O plano anual foi excluído com sucesso.",
            });
          }
          break;
          
        case 'teaching':
          success = await services.teachingPlan.delete(deleteItemId);
          if (success) {
            // Also refetch lesson plans as they might have been cascaded
            setTeachingPlans(plans => plans.filter(p => p.id !== deleteItemId));
            toast({
              title: "Plano de ensino excluído",
              description: "O plano de ensino foi excluído com sucesso.",
            });
          }
          break;
          
        case 'lesson':
          success = await services.lessonPlan.delete(deleteItemId);
          if (success) {
            setLessonPlans(plans => plans.filter(p => p.id !== deleteItemId));
            toast({
              title: "Plano de aula excluído",
              description: "O plano de aula foi excluído com sucesso.",
            });
          }
          break;
      }
      
      if (!success) {
        throw new Error("Falha ao excluir o item");
      }
      
      await fetchData(); // Refresh all data to ensure consistency
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o item. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setDeleteItemType(null);
      setDeleteItemId(null);
    }
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeleteItemType(null);
    setDeleteItemId(null);
  };

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      <SectionHeader
        title="Planejamento"
        description="Gerencie seus planos anuais, planos de ensino e planos de aula"
        icon={Layers}
        actionLabel="Criar novo plano"
        onAction={() => {
          if (planningModalsRef.current) {
            //@ts-ignore
            planningModalsRef.current.handleCreateAnnualPlan();
          }
        }}
      />
      
      {/* Filters */}
      <AdvancedFilter
        filterGroups={filterGroups}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Pesquisar planos por título..."
        onClearFilters={clearFilters}
      />
      
      {/* Main content */}
      <div className="space-y-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredSubjects.length > 0 ? (
          <Accordion type="multiple">
            {filteredSubjects.map((subject) => {
              const subjectAnnualPlans = filteredAnnualPlans.filter(
                plan => plan.subjectId === subject.id
              );
              
              if (subjectAnnualPlans.length === 0 && selectedPlanType === 'all') {
                return null;
              }
              
              return (
                <AccordionItem key={subject.id} value={subject.id} className="border rounded-md mb-4">
                  <AccordionTrigger className="px-4 py-2 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <BookOpen className="text-edu-blue-600" size={20} />
                      <div className="text-left">
                        <h3 className="font-medium">{subject.name}</h3>
                        <div className="text-sm text-edu-gray-500">
                          {subject.grade} • {getAcademicPeriodName(subject.academicPeriodId)}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-2">
                    {/* Annual Plans for this subject */}
                    <div className="space-y-4 ml-8 mt-2">
                      {/* Create annual plan button */}
                      <div className="flex justify-end mb-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (planningModalsRef.current) {
                              //@ts-ignore
                              planningModalsRef.current.handleCreateAnnualPlanForSubject(subject);
                            }
                          }}
                        >
                          Adicionar plano anual
                        </Button>
                      </div>
                      
                      {/* Annual Plans */}
                      {subjectAnnualPlans.length > 0 ? (
                        subjectAnnualPlans.map(annualPlan => {
                          const planTeachingPlans = filteredTeachingPlans.filter(
                            plan => plan.annualPlanId === annualPlan.id
                          );
                          
                          return (
                            <Card key={annualPlan.id} className="overflow-hidden">
                              <div className="bg-edu-blue-50 p-3 flex justify-between items-start cursor-pointer"
                                onClick={() => toggleAnnualPlanExpanded(annualPlan.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="bg-edu-blue-100 p-1.5 rounded-md">
                                    <FileText className="text-edu-blue-600" size={18} />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{annualPlan.title}</h4>
                                    {annualPlan.description && (
                                      <p className="text-sm text-edu-gray-600 line-clamp-1">
                                        {annualPlan.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 mr-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (planningModalsRef.current) {
                                        //@ts-ignore
                                        planningModalsRef.current.handleEditAnnualPlan(annualPlan);
                                      }
                                    }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil text-gray-500 hover:text-edu-blue-600">
                                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                                      <path d="m15 5 4 4"></path>
                                    </svg>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 mr-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteClick('annual', annualPlan.id);
                                    }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2 text-gray-500 hover:text-red-600">
                                      <path d="M3 6h18"></path>
                                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                      <line x1="10" x2="10" y1="11" y2="17"></line>
                                      <line x1="14" x2="14" y1="11" y2="17"></line>
                                    </svg>
                                  </Button>
                                  {expandedAnnualPlans.has(annualPlan.id) ? 
                                    <ChevronUp size={20} /> : 
                                    <ChevronDown size={20} />
                                  }
                                </div>
                              </div>
                              
                              {expandedAnnualPlans.has(annualPlan.id) && (
                                <CardContent className="p-4">
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <h5 className="font-medium text-sm text-edu-gray-600 mb-1">Objetivos:</h5>
                                        <ul className="list-disc list-inside text-sm">
                                          {annualPlan.objectives.map((obj, idx) => (
                                            <li key={idx}>{obj}</li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div>
                                        <h5 className="font-medium text-sm text-edu-gray-600 mb-1">Conteúdo Geral:</h5>
                                        <p className="text-sm">{annualPlan.generalContent}</p>
                                      </div>
                                    </div>
                                    
                                    {/* Teaching Plans Section */}
                                    <div className="mt-6">
                                      <div className="flex justify-between items-center mb-3">
                                        <h5 className="font-medium">Planos de Ensino</h5>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            if (planningModalsRef.current) {
                                              //@ts-ignore
                                              planningModalsRef.current.handleCreateTeachingPlanForAnnualPlan(annualPlan, subject);
                                            }
                                          }}
                                        >
                                          Adicionar plano de ensino
                                        </Button>
                                      </div>
                                      
                                      {planTeachingPlans.length > 0 ? (
                                        <div className="space-y-3">
                                          {planTeachingPlans.map(teachingPlan => {
                                            const planLessonPlans = filteredLessonPlans.filter(
                                              plan => plan.teachingPlanId === teachingPlan.id
                                            );
                                            
                                            return (
                                              <Card key={teachingPlan.id} className="overflow-hidden border-l-4 border-l-edu-green-500">
                                                <div className="bg-white p-3 flex justify-between items-start cursor-pointer"
                                                  onClick={() => toggleTeachingPlanExpanded(teachingPlan.id)}
                                                >
                                                  <div className="flex items-center gap-3">
                                                    <div className="bg-edu-green-100 p-1.5 rounded-md">
                                                      <FileText className="text-edu-green-600" size={18} />
                                                    </div>
                                                    <div>
                                                      <h4 className="font-medium">{teachingPlan.title}</h4>
                                                      <div className="text-xs text-edu-gray-500 flex items-center gap-2 mt-0.5">
                                                        <span>
                                                          {formatDate(teachingPlan.startDate)} - {formatDate(teachingPlan.endDate)}
                                                        </span>
                                                        {planLessonPlans.length > 0 && (
                                                          <Badge variant="outline" className="bg-edu-green-50 text-xs">
                                                            {planLessonPlans.length} aulas
                                                          </Badge>
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="flex items-center">
                                                    <Button
                                                      variant="ghost"
                                                      size="icon"
                                                      className="h-8 w-8 mr-1"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (planningModalsRef.current) {
                                                          //@ts-ignore
                                                          planningModalsRef.current.handleEditTeachingPlan(teachingPlan);
                                                        }
                                                      }}
                                                    >
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil text-gray-500 hover:text-edu-blue-600">
                                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                                                        <path d="m15 5 4 4"></path>
                                                      </svg>
                                                    </Button>
                                                    <Button
                                                      variant="ghost"
                                                      size="icon"
                                                      className="h-8 w-8 mr-1"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteClick('teaching', teachingPlan.id);
                                                      }}
                                                    >
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2 text-gray-500 hover:text-red-600">
                                                        <path d="M3 6h18"></path>
                                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                                        <line x1="10" x2="10" y1="11" y2="17"></line>
                                                        <line x1="14" x2="14" y1="11" y2="17"></line>
                                                      </svg>
                                                    </Button>
                                                    {expandedTeachingPlans.has(teachingPlan.id) ? 
                                                      <ChevronUp size={20} /> : 
                                                      <ChevronDown size={20} />
                                                    }
                                                  </div>
                                                </div>
                                                
                                                {expandedTeachingPlans.has(teachingPlan.id) && (
                                                  <CardContent className="p-4 bg-gray-50">
                                                    <div className="space-y-4">
                                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                          <h5 className="font-medium text-sm text-edu-gray-600 mb-1">Objetivos:</h5>
                                                          <ul className="list-disc list-inside text-sm">
                                                            {teachingPlan.objectives.map((obj, idx) => (
                                                              <li key={idx}>{obj}</li>
                                                            ))}
                                                          </ul>
                                                        </div>
                                                        <div>
                                                          <h5 className="font-medium text-sm text-edu-gray-600 mb-1">Metodologia:</h5>
                                                          <p className="text-sm">{teachingPlan.methodology}</p>
                                                        </div>
                                                      </div>
                                                      
                                                      {/* Lesson Plans Section */}
                                                      <div className="mt-6">
                                                        <div className="flex justify-between items-center mb-3">
                                                          <h5 className="font-medium">Planos de Aula</h5>
                                                          <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                              if (planningModalsRef.current) {
                                                                //@ts-ignore
                                                                planningModalsRef.current.handleCreateLessonPlanForTeachingPlan(teachingPlan);
                                                              }
                                                            }}
                                                          >
                                                            Adicionar plano de aula
                                                          </Button>
                                                        </div>
                                                        
                                                        {planLessonPlans.length > 0 ? (
                                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                            {planLessonPlans.map(lessonPlan => (
                                                              <Card key={lessonPlan.id} className="overflow-hidden border-l-4 border-l-edu-teal-500">
                                                                <CardContent className="p-3">
                                                                  <div className="flex items-start gap-3">
                                                                    <div className="bg-edu-teal-100 p-1.5 rounded-md">
                                                                      <PenTool className="text-edu-teal-600" size={18} />
                                                                    </div>
                                                                    <div>
                                                                      <h4 className="font-medium">{lessonPlan.title}</h4>
                                                                      <div className="text-xs text-edu-gray-500 mt-0.5">
                                                                        {formatDate(lessonPlan.date)} • {lessonPlan.duration} min
                                                                      </div>
                                                                    </div>
                                                                  </div>
                                                                </CardContent>
                                                                <CardFooter className="p-3 pt-0 flex justify-end gap-2">
                                                                  <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8"
                                                                    onClick={() => {
                                                                      if (planningModalsRef.current) {
                                                                        //@ts-ignore
                                                                        planningModalsRef.current.handleEditLessonPlan(lessonPlan);
                                                                      }
                                                                    }}
                                                                  >
                                                                    Editar
                                                                  </Button>
                                                                  <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                    onClick={() => handleDeleteClick('lesson', lessonPlan.id)}
                                                                  >
                                                                    Excluir
                                                                  </Button>
                                                                </CardFooter>
                                                              </Card>
                                                            ))}
                                                          </div>
                                                        ) : (
                                                          <div className="text-center p-4 bg-gray-50 border border-dashed border-gray-300 rounded-md">
                                                            <p className="text-gray-500">Nenhum plano de aula cadastrado</p>
                                                          </div>
                                                        )}
                                                      </div>
                                                    </div>
                                                  </CardContent>
                                                )}
                                              </Card>
                                            );
                                          })}
                                        </div>
                                      ) : (
                                        <div className="text-center p-4 bg-gray-50 border border-dashed border-gray-300 rounded-md">
                                          <p className="text-gray-500">Nenhum plano de ensino cadastrado</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              )}
                            </Card>
                          );
                        })
                      ) : (
                        <div className="text-center p-4 bg-gray-50 border border-dashed border-gray-300 rounded-md">
                          <p className="text-gray-500">Nenhum plano anual cadastrado para esta disciplina</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <FileText className="mx-auto text-gray-400" size={48} />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {searchQuery || selectedAcademicPeriod !== 'all' || selectedSubject !== 'all' || selectedPlanType !== 'all' 
                ? "Nenhum plano encontrado com os filtros aplicados"
                : "Nenhum plano cadastrado"
              }
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || selectedAcademicPeriod !== 'all' || selectedSubject !== 'all' || selectedPlanType !== 'all'
                ? "Tente ajustar os filtros de busca."
                : "Crie seu primeiro plano para começar."
              }
            </p>
            {!(searchQuery || selectedAcademicPeriod !== 'all' || selectedSubject !== 'all' || selectedPlanType !== 'all') && (
              <Button
                className="mt-4 bg-edu-blue-600 hover:bg-edu-blue-700"
                onClick={() => {
                  if (planningModalsRef.current) {
                    //@ts-ignore
                    planningModalsRef.current.handleCreateAnnualPlan();
                  }
                }}
              >
                Criar novo plano
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Modals for creating/editing plans */}
      <PlanningModals
        subjects={subjects}
        academicPeriods={academicPeriods}
        annualPlans={annualPlans}
        teachingPlans={teachingPlans}
        refreshData={fetchData}
      />

      {/* Delete confirmation dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        isLoading={isDeleting}
        title={`Excluir ${
          deleteItemType === 'annual' ? 'plano anual' : 
          deleteItemType === 'teaching' ? 'plano de ensino' : 
          'plano de aula'
        }`}
        description={`Tem certeza que deseja excluir este ${
          deleteItemType === 'annual' ? 'plano anual' : 
          deleteItemType === 'teaching' ? 'plano de ensino' : 
          'plano de aula'
        }? Esta ação não pode ser desfeita.`}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        cancelLabel="Cancelar"
        confirmLabel="Excluir"
      />
    </div>
  );
};

export default Planning;
