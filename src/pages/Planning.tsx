
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  BookOpen, 
  Calendar, 
  PlusSquare, 
  Search, 
  Layers,
  Filter
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import SectionHeader from '@/components/ui-components/SectionHeader';
import { AnnualPlan, TeachingPlan, LessonPlan, Subject } from '@/types';
import { services } from '@/lib/services';

const Planning: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('annual');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  
  const [annualPlans, setAnnualPlans] = useState<AnnualPlan[]>([]);
  const [teachingPlans, setTeachingPlans] = useState<TeachingPlan[]>([]);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  
  // Filtered data based on search and filters
  const [filteredAnnualPlans, setFilteredAnnualPlans] = useState<AnnualPlan[]>([]);
  const [filteredTeachingPlans, setFilteredTeachingPlans] = useState<TeachingPlan[]>([]);
  const [filteredLessonPlans, setFilteredLessonPlans] = useState<LessonPlan[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [subjectsData, annualPlansData, teachingPlansData, lessonPlansData] = await Promise.all([
          services.subject.getAll(),
          services.annualPlan.getAll(),
          services.teachingPlan.getAll(),
          services.lessonPlan.getAll()
        ]);
        
        setSubjects(subjectsData);
        setAnnualPlans(annualPlansData);
        setTeachingPlans(teachingPlansData);
        setLessonPlans(lessonPlansData);
        
        setFilteredAnnualPlans(annualPlansData);
        setFilteredTeachingPlans(teachingPlansData);
        setFilteredLessonPlans(lessonPlansData);
      } catch (error) {
        console.error('Error fetching planning data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Apply filters and search when dependencies change
  useEffect(() => {
    // Filter annual plans
    let filtered = [...annualPlans];
    
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(plan => plan.subjectId === selectedSubject);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(plan => 
        plan.title.toLowerCase().includes(query) ||
        plan.description?.toLowerCase().includes(query) ||
        plan.generalContent.toLowerCase().includes(query)
      );
    }
    
    setFilteredAnnualPlans(filtered);
  }, [annualPlans, searchQuery, selectedSubject]);

  // Filter teaching plans
  useEffect(() => {
    let filtered = [...teachingPlans];
    
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(plan => plan.subjectId === selectedSubject);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(plan => 
        plan.title.toLowerCase().includes(query) ||
        plan.description?.toLowerCase().includes(query) ||
        plan.contents.some(content => content.toLowerCase().includes(query)) ||
        plan.objectives.some(obj => obj.toLowerCase().includes(query))
      );
    }
    
    setFilteredTeachingPlans(filtered);
  }, [teachingPlans, searchQuery, selectedSubject]);

  // Filter lesson plans
  useEffect(() => {
    let filtered = [...lessonPlans];
    
    if (selectedSubject !== 'all') {
      // We need to find teaching plans with the selected subject and then filter lesson plans
      const relevantTeachingPlanIds = teachingPlans
        .filter(tp => tp.subjectId === selectedSubject)
        .map(tp => tp.id);
        
      filtered = filtered.filter(plan => 
        relevantTeachingPlanIds.includes(plan.teachingPlanId)
      );
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(plan => 
        plan.title.toLowerCase().includes(query) ||
        plan.contents.some(content => content.toLowerCase().includes(query)) ||
        plan.objectives.some(obj => obj.toLowerCase().includes(query))
      );
    }
    
    setFilteredLessonPlans(filtered);
  }, [lessonPlans, teachingPlans, searchQuery, selectedSubject]);

  const getSubjectName = (id: string): string => {
    const subject = subjects.find(s => s.id === id);
    return subject ? subject.name : 'Disciplina não encontrada';
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Function to handle detail view navigation
  const handleViewDetails = (type: string, id: string) => {
    // In a real app, this would navigate to a detail view
    console.log(`Viewing ${type} details for ID: ${id}`);
    // navigate(`/planejamento/${type}/${id}`);
  };
  
  // Function to handle creation of new plans
  const handleCreateNew = (type: string) => {
    // In a real app, this would navigate to a creation form
    console.log(`Creating new ${type}`);
    // navigate(`/planejamento/${type}/novo`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <SectionHeader
        title="Planejamento"
        description="Gerencie seus planos anuais, planos de ensino e planos de aula"
        icon={FileText}
      />
      
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Pesquisar planos..."
              className="pl-10 w-full md:w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                Disciplina: {selectedSubject === 'all' ? 'Todas' : getSubjectName(selectedSubject)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filtrar por Disciplina</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={selectedSubject} onValueChange={setSelectedSubject}>
                <DropdownMenuRadioItem value="all">Todas as Disciplinas</DropdownMenuRadioItem>
                {subjects.map((subject) => (
                  <DropdownMenuRadioItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Button 
          onClick={() => handleCreateNew(activeTab)} 
          className="bg-edu-blue-600 hover:bg-edu-blue-700"
        >
          <PlusSquare className="mr-2" size={18} />
          Novo Plano
        </Button>
      </div>
      
      <Tabs 
        defaultValue={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="bg-white border">
          <TabsTrigger 
            value="annual" 
            className="data-[state=active]:bg-edu-blue-600 data-[state=active]:text-white"
          >
            <Layers size={16} className="mr-2" />
            Planos Anuais
          </TabsTrigger>
          <TabsTrigger 
            value="teaching" 
            className="data-[state=active]:bg-edu-blue-600 data-[state=active]:text-white"
          >
            <BookOpen size={16} className="mr-2" />
            Planos de Ensino
          </TabsTrigger>
          <TabsTrigger 
            value="lesson" 
            className="data-[state=active]:bg-edu-blue-600 data-[state=active]:text-white"
          >
            <Calendar size={16} className="mr-2" />
            Planos de Aula
          </TabsTrigger>
        </TabsList>
        
        {/* Annual Plans Tab */}
        <TabsContent value="annual" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredAnnualPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnnualPlans.map((plan) => (
                <Card key={plan.id} className="card-hover cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{plan.title}</CardTitle>
                    <CardDescription>
                      {getSubjectName(plan.subjectId)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-edu-gray-600 line-clamp-3">
                      {plan.description || plan.generalContent}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3 flex justify-between">
                    <div className="text-xs text-edu-gray-500">
                      Criado em: {formatDate(plan.createdAt)}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails('annual', plan.id)}
                    >
                      Ver Detalhes
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <FileText className="mx-auto text-gray-400" size={48} />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum plano anual encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? 'Tente ajustar sua busca.' : 'Crie seu primeiro plano anual.'}
              </p>
              <Button 
                className="mt-4 bg-edu-blue-600 hover:bg-edu-blue-700"
                onClick={() => handleCreateNew('annual')}
              >
                <PlusSquare className="mr-2" size={16} />
                Criar Plano Anual
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Teaching Plans Tab */}
        <TabsContent value="teaching" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTeachingPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachingPlans.map((plan) => (
                <Card key={plan.id} className="card-hover cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{plan.title}</CardTitle>
                    <CardDescription>
                      {getSubjectName(plan.subjectId)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-edu-gray-600 mb-3 line-clamp-2">
                      {plan.description || plan.contents.join(', ')}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {plan.bnccReferences.slice(0, 3).map((ref, i) => (
                        <span key={i} className="px-2 py-0.5 bg-edu-blue-100 text-edu-blue-700 text-xs rounded-full">
                          {ref}
                        </span>
                      ))}
                      {plan.bnccReferences.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{plan.bnccReferences.length - 3}
                        </span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3 flex justify-between text-xs text-edu-gray-500">
                    <div>
                      {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails('teaching', plan.id)}
                    >
                      Ver Detalhes
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <BookOpen className="mx-auto text-gray-400" size={48} />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum plano de ensino encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? 'Tente ajustar sua busca.' : 'Crie seu primeiro plano de ensino.'}
              </p>
              <Button 
                className="mt-4 bg-edu-blue-600 hover:bg-edu-blue-700"
                onClick={() => handleCreateNew('teaching')}
              >
                <PlusSquare className="mr-2" size={16} />
                Criar Plano de Ensino
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Lesson Plans Tab */}
        <TabsContent value="lesson" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredLessonPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessonPlans.map((plan) => {
                const teachingPlan = teachingPlans.find(tp => tp.id === plan.teachingPlanId);
                const subjectId = teachingPlan?.subjectId;
                
                return (
                  <Card key={plan.id} className="card-hover cursor-pointer">
                    <div className="bg-edu-blue-700 text-white px-4 py-2 flex justify-between items-center">
                      <div className="font-medium">{formatDate(plan.date)}</div>
                      <div className="text-sm">{plan.duration} min</div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{plan.title}</CardTitle>
                      <CardDescription>
                        {subjectId ? getSubjectName(subjectId) : 'Disciplina não especificada'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <h4 className="text-sm font-medium mb-1">Objetivos:</h4>
                      <ul className="text-sm text-edu-gray-600 list-disc pl-5 mb-3 space-y-1">
                        {plan.objectives.slice(0, 2).map((obj, i) => (
                          <li key={i} className="line-clamp-1">{obj}</li>
                        ))}
                      </ul>
                      
                      <h4 className="text-sm font-medium mb-1">Recursos:</h4>
                      <div className="flex flex-wrap gap-1">
                        {plan.resources.slice(0, 3).map((resource, i) => (
                          <span key={i} className="px-2 py-0.5 bg-edu-blue-50 text-edu-blue-700 text-xs rounded-full">
                            {resource}
                          </span>
                        ))}
                        {plan.resources.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{plan.resources.length - 3}
                          </span>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-3 flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails('lesson', plan.id)}
                      >
                        Ver Detalhes
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <Calendar className="mx-auto text-gray-400" size={48} />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum plano de aula encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? 'Tente ajustar sua busca.' : 'Crie seu primeiro plano de aula.'}
              </p>
              <Button 
                className="mt-4 bg-edu-blue-600 hover:bg-edu-blue-700"
                onClick={() => handleCreateNew('lesson')}
              >
                <PlusSquare className="mr-2" size={16} />
                Criar Plano de Aula
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Planning;
