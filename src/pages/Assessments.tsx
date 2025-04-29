
import React, { useState, useEffect } from 'react';
import {
  BarChartBig, Search, Filter, PlusSquare, ArrowUpDown, CalendarIcon, FileBarChart
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import SectionHeader from '@/components/ui-components/SectionHeader';

import { Assessment, Student, StudentAssessment, Subject } from '@/types';
import { services } from '@/lib/services';

const Assessments: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentAssessments, setStudentAssessments] = useState<StudentAssessment[]>([]);
  
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'average'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([]);
  const [averageScores, setAverageScores] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [subjectsData, assessmentsData, studentsData, studentAssessmentsData] = await Promise.all([
          services.subject.getAll(),
          services.assessment.getAll(),
          services.student.getAll(),
          services.studentAssessment.getAll()
        ]);
        
        setSubjects(subjectsData);
        setAssessments(assessmentsData);
        setStudents(studentsData);
        setStudentAssessments(studentAssessmentsData);
        
        // Calculate average scores
        const averages: Record<string, number> = {};
        assessmentsData.forEach(assessment => {
          const relevantAssessments = studentAssessmentsData.filter(
            sa => sa.assessmentId === assessment.id
          );
          
          if (relevantAssessments.length > 0) {
            const sum = relevantAssessments.reduce((acc, curr) => acc + curr.score, 0);
            averages[assessment.id] = sum / relevantAssessments.length;
          } else {
            averages[assessment.id] = 0;
          }
        });
        
        setAverageScores(averages);
        setFilteredAssessments(assessmentsData);
      } catch (error) {
        console.error('Error fetching assessments data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Apply filters, search and sort
  useEffect(() => {
    let filtered = [...assessments];
    
    // Apply subject filter
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(assessment => assessment.subjectId === selectedSubject);
    }
    
    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(assessment => assessment.type === selectedType);
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(assessment => 
        assessment.title.toLowerCase().includes(query) ||
        assessment.description?.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortBy === 'title') {
        return sortOrder === 'asc' 
          ? a.title.localeCompare(b.title) 
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'average') {
        const avgA = averageScores[a.id] || 0;
        const avgB = averageScores[b.id] || 0;
        return sortOrder === 'asc' ? avgA - avgB : avgB - avgA;
      }
      return 0;
    });
    
    setFilteredAssessments(filtered);
  }, [assessments, selectedSubject, selectedType, searchQuery, sortBy, sortOrder, averageScores]);

  const getSubjectName = (id: string): string => {
    const subject = subjects.find(s => s.id === id);
    return subject ? subject.name : 'Disciplina não encontrada';
  };

  const getAssessmentTypeName = (type: string): string => {
    switch (type) {
      case 'diagnostic':
        return 'Diagnóstica';
      case 'formative':
        return 'Formativa';
      case 'summative':
        return 'Somativa';
      default:
        return 'Desconhecido';
    }
  };
  
  const getAssessmentTypeColor = (type: string): string => {
    switch (type) {
      case 'diagnostic':
        return 'bg-purple-100 text-purple-800';
      case 'formative':
        return 'bg-edu-blue-100 text-edu-blue-800';
      case 'summative':
        return 'bg-edu-orange-100 text-edu-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString: string): string => {
    return format(new Date(dateString), "dd 'de' MMMM", { locale: ptBR });
  };
  
  const getProgressColor = (value: number): string => {
    if (value >= 8) return 'bg-green-500';
    if (value >= 6) return 'bg-edu-yellow-400';
    return 'bg-red-500';
  };
  
  const toggleSortOrder = (column: 'date' | 'title' | 'average') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };
  
  const handleCreateNew = () => {
    console.log('Creating new assessment');
    // navigate('/avaliacoes/novo');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <SectionHeader
        title="Avaliações"
        description="Gerenciamento de avaliações e desempenho dos estudantes"
        icon={BarChartBig}
        actionLabel="Nova Avaliação"
        onAction={handleCreateNew}
      />
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Pesquisar avaliações..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3">
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                Tipo: {selectedType === 'all' ? 'Todos' : getAssessmentTypeName(selectedType)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filtrar por Tipo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={selectedType} onValueChange={setSelectedType}>
                <DropdownMenuRadioItem value="all">Todos os Tipos</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="diagnostic">Diagnóstica</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="formative">Formativa</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="summative">Somativa</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Assessments Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          ) : filteredAssessments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">
                    <button 
                      onClick={() => toggleSortOrder('date')}
                      className="flex items-center"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Data
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button 
                      onClick={() => toggleSortOrder('title')}
                      className="flex items-center"
                    >
                      Avaliação
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">
                    <button 
                      onClick={() => toggleSortOrder('average')}
                      className="flex items-center justify-end w-full"
                    >
                      <FileBarChart className="mr-2 h-4 w-4" />
                      Média
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssessments.map((assessment) => {
                  const avgScore = averageScores[assessment.id] || 0;
                  const relevantAssessments = studentAssessments.filter(
                    sa => sa.assessmentId === assessment.id
                  );
                  const submittedCount = relevantAssessments.length;
                  
                  return (
                    <TableRow key={assessment.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {formatDate(assessment.date)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{assessment.title}</div>
                          {assessment.description && (
                            <div className="text-sm text-edu-gray-500 truncate max-w-xs">
                              {assessment.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getSubjectName(assessment.subjectId)}</TableCell>
                      <TableCell>
                        <Badge className={getAssessmentTypeColor(assessment.type)}>
                          {getAssessmentTypeName(assessment.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="space-y-1 min-w-[100px]">
                          <div className="flex justify-between text-sm">
                            <span>{avgScore.toFixed(1)}</span>
                            <span className="text-edu-gray-500">/ {assessment.totalPoints}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={(avgScore / assessment.totalPoints) * 100} 
                              className={`h-2 ${getProgressColor(avgScore)}`} 
                            />
                          </div>
                          <div className="text-xs text-edu-gray-500 text-right">
                            {submittedCount} alunos
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <BarChartBig className="mx-auto text-gray-400" size={48} />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhuma avaliação encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || selectedSubject !== 'all' || selectedType !== 'all'
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Crie sua primeira avaliação.'}
              </p>
              <Button
                className="mt-4 bg-edu-blue-600 hover:bg-edu-blue-700"
                onClick={handleCreateNew}
              >
                <PlusSquare className="mr-2" size={16} />
                Criar Avaliação
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Assessments;
