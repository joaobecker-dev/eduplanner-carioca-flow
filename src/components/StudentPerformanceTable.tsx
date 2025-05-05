
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { studentAssessmentService, StudentPerformanceSummary } from "@/lib/services/studentAssessmentService";
import { subjectService } from "@/lib/services/subjectService";
import { formatDate } from "@/lib/utils/date-formatter";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ID, Subject } from "@/types";

interface StudentPerformanceTableProps {
  className?: string;
}

export const StudentPerformanceTable: React.FC<StudentPerformanceTableProps> = ({ className }) => {
  const { toast } = useToast();
  const [selectedSubjectId, setSelectedSubjectId] = React.useState<string | undefined>();

  // Fetch subjects for filter
  const { data: subjects, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => subjectService.getAll(),
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Erro ao carregar disciplinas",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  });

  // Fetch student performance data
  const {
    data: studentPerformance,
    isLoading: isLoadingPerformance,
    isError,
    error
  } = useQuery({
    queryKey: ["studentPerformance", selectedSubjectId],
    queryFn: () => studentAssessmentService.getSummaryByStudent(selectedSubjectId),
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Erro ao carregar dados de desempenho",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  });

  // Performance color coding
  const getScoreBadge = (score: number) => {
    if (score >= 8) {
      return <Badge className="bg-green-500">Excelente</Badge>;
    } else if (score >= 6) {
      return <Badge className="bg-blue-500">Bom</Badge>;
    } else if (score >= 4) {
      return <Badge className="bg-yellow-500">Regular</Badge>;
    } else {
      return <Badge className="bg-red-500">Precisa melhorar</Badge>;
    }
  };

  // Handle subject filter change
  const handleSubjectChange = (value: string) => {
    setSelectedSubjectId(value === "all" ? undefined : value);
  };

  // Memoized sorted data
  const sortedData = useMemo(() => {
    if (!studentPerformance) return [];
    return [...studentPerformance].sort((a, b) => b.averageScore - a.averageScore);
  }, [studentPerformance]);

  if (isError) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-md">
        Erro ao carregar dados: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Desempenho dos Alunos</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Filtrar por disciplina:</span>
          <Select 
            onValueChange={handleSubjectChange}
            defaultValue="all"
            disabled={isLoadingSubjects}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Todas as disciplinas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as disciplinas</SelectItem>
              {subjects?.map((subject: Subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableCaption>
          {selectedSubjectId && subjects?.find(s => s.id === selectedSubjectId) 
            ? `Desempenho em ${subjects.find(s => s.id === selectedSubjectId)?.name}`
            : 'Desempenho em todas as disciplinas'}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Matrícula</TableHead>
            <TableHead className="text-center">Total de Avaliações</TableHead>
            <TableHead className="text-center">Nota Média</TableHead>
            <TableHead className="text-center">Desempenho</TableHead>
            <TableHead>Última Avaliação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoadingPerformance ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-5 w-[180px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-5 w-[40px] mx-auto" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-5 w-[60px] mx-auto" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-6 w-[100px] mx-auto" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[120px]" /></TableCell>
              </TableRow>
            ))
          ) : sortedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                Nenhum dado de desempenho encontrado
                {selectedSubjectId && " para esta disciplina"}
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((student: StudentPerformanceSummary) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.registration}</TableCell>
                <TableCell className="text-center">{student.totalAssessments}</TableCell>
                <TableCell className="text-center font-medium">
                  {student.averageScore.toFixed(1)}
                </TableCell>
                <TableCell className="text-center">
                  {getScoreBadge(student.averageScore)}
                </TableCell>
                <TableCell>
                  {student.lastGradedDate 
                    ? formatDate(student.lastGradedDate) 
                    : "Não avaliado"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentPerformanceTable;
