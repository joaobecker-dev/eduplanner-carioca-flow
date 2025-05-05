
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, Loader2 } from 'lucide-react';
import { 
  studentAssessmentService, 
  assessmentService 
} from '@/lib/services';
import { formatDate } from '@/lib/utils/date-formatter';
import { Assessment, Student, StudentAssessment, ID } from '@/types';
import { useQuery } from '@tanstack/react-query';

interface StudentAssessmentTableProps {
  assessmentId: ID;
}

interface GradeRowData {
  id: ID;
  student: Student;
  score: number | null;
  feedback: string;
  submittedDate: Date | null;
  gradedDate: Date | null;
  isModified: boolean;
  isValid: boolean;
  isSaving: boolean;
}

export function StudentAssessmentTable({ assessmentId }: StudentAssessmentTableProps) {
  const { toast } = useToast();
  const [rows, setRows] = useState<GradeRowData[]>([]);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch the assessment to get the totalPoints
  const { data: assessmentData, isLoading: isAssessmentLoading } = useQuery({
    queryKey: ['assessment', assessmentId],
    queryFn: () => assessmentService.getById(assessmentId),
    enabled: !!assessmentId,
  });

  // Fetch student assessments for the given assessment ID
  const { data: studentAssessments, isLoading, error } = useQuery({
    queryKey: ['studentAssessments', assessmentId, refreshKey],
    queryFn: () => studentAssessmentService.getByAssessment(assessmentId),
    enabled: !!assessmentId,
  });

  useEffect(() => {
    if (assessmentData) {
      setAssessment(assessmentData);
    }
  }, [assessmentData]);

  useEffect(() => {
    if (studentAssessments) {
      const mappedRows = studentAssessments.map(sa => ({
        id: sa.id,
        student: sa.student || { id: sa.studentId, name: 'Unknown', registration: '' },
        score: sa.score,
        feedback: sa.feedback || '',
        submittedDate: sa.submittedDate ? new Date(sa.submittedDate) : null,
        gradedDate: sa.gradedDate ? new Date(sa.gradedDate) : null,
        isModified: false,
        isValid: true,
        isSaving: false,
      }));
      setRows(mappedRows);
    }
  }, [studentAssessments]);

  const handleScoreChange = (id: ID, value: string) => {
    const score = value === '' ? null : Number(value);
    setRows(prevRows => prevRows.map(row => {
      if (row.id === id) {
        const isValid = score === null || 
          (assessment && score >= 0 && score <= assessment.totalPoints);
        return { 
          ...row, 
          score, 
          isModified: true, 
          isValid 
        };
      }
      return row;
    }));
  };

  const handleFeedbackChange = (id: ID, value: string) => {
    setRows(prevRows => prevRows.map(row => {
      if (row.id === id) {
        return { ...row, feedback: value, isModified: true };
      }
      return row;
    }));
  };

  const handleSubmittedDateChange = (id: ID, date: Date | null) => {
    setRows(prevRows => prevRows.map(row => {
      if (row.id === id) {
        return { ...row, submittedDate: date, isModified: true };
      }
      return row;
    }));
  };

  const handleGradedDateChange = (id: ID, date: Date | null) => {
    setRows(prevRows => prevRows.map(row => {
      if (row.id === id) {
        return { ...row, gradedDate: date, isModified: true };
      }
      return row;
    }));
  };

  const handleSaveRow = async (rowId: ID) => {
    const row = rows.find(r => r.id === rowId);
    if (!row || !row.isModified || !row.isValid) return;

    setRows(prevRows => prevRows.map(r => 
      r.id === rowId ? { ...r, isSaving: true } : r
    ));

    try {
      const updates: Partial<StudentAssessment> = {
        score: row.score || 0,
        feedback: row.feedback,
        submittedDate: row.submittedDate ? row.submittedDate.toISOString() : undefined,
        gradedDate: row.gradedDate ? row.gradedDate.toISOString() : undefined,
      };

      await studentAssessmentService.update(rowId, updates);
      
      setRows(prevRows => prevRows.map(r => 
        r.id === rowId ? { ...r, isSaving: false, isModified: false } : r
      ));

      toast({
        title: "Avaliação salva",
        description: `A nota do aluno ${row.student.name} foi atualizada com sucesso.`,
      });
    } catch (err) {
      console.error("Erro ao salvar avaliação:", err);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a avaliação. Tente novamente.",
        variant: "destructive",
      });
      setRows(prevRows => prevRows.map(r => 
        r.id === rowId ? { ...r, isSaving: false } : r
      ));
    }
  };

  const saveAllChanges = async () => {
    const modifiedRows = rows.filter(row => row.isModified && row.isValid);
    if (modifiedRows.length === 0) return;

    let successCount = 0;
    let errorCount = 0;

    for (const row of modifiedRows) {
      setRows(prevRows => prevRows.map(r => 
        r.id === row.id ? { ...r, isSaving: true } : r
      ));

      try {
        const updates: Partial<StudentAssessment> = {
          score: row.score || 0,
          feedback: row.feedback,
          submittedDate: row.submittedDate ? row.submittedDate.toISOString() : undefined,
          gradedDate: row.gradedDate ? row.gradedDate.toISOString() : undefined,
        };

        await studentAssessmentService.update(row.id, updates);
        successCount++;

        setRows(prevRows => prevRows.map(r => 
          r.id === row.id ? { ...r, isSaving: false, isModified: false } : r
        ));
      } catch (err) {
        console.error(`Erro ao salvar avaliação para ${row.student.name}:`, err);
        errorCount++;
        setRows(prevRows => prevRows.map(r => 
          r.id === row.id ? { ...r, isSaving: false } : r
        ));
      }
    }

    if (successCount > 0) {
      toast({
        title: `${successCount} avaliações salvas`,
        description: `Alterações salvas com sucesso.${errorCount > 0 ? ` ${errorCount} erro(s) ocorreram.` : ''}`,
        variant: errorCount > 0 ? "default" : "default",
      });
      
      // Refresh data
      setRefreshKey(prev => prev + 1);
    } else if (errorCount > 0) {
      toast({
        title: "Erro ao salvar avaliações",
        description: "Nenhuma avaliação foi salva devido a erros. Verifique e tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (isLoading || isAssessmentLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando avaliações...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Erro ao carregar as avaliações</p>
        <Button onClick={() => setRefreshKey(prev => prev + 1)} className="mt-4">
          Tentar Novamente
        </Button>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Nenhum aluno está atribuído a esta avaliação.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {assessment ? `Pontuação Máxima: ${assessment.totalPoints}` : 'Carregando...'}
        </h2>
        <Button onClick={saveAllChanges} disabled={!rows.some(r => r.isModified && r.isValid)} className="ml-auto">
          Salvar Todas as Alterações
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Aluno</TableHead>
            <TableHead>Matrícula</TableHead>
            <TableHead>Nota</TableHead>
            <TableHead>Feedback</TableHead>
            <TableHead>Data de Envio</TableHead>
            <TableHead>Data de Correção</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className={row.isModified && !row.isValid ? "bg-red-50" : ""}>
              <TableCell>{row.student.name}</TableCell>
              <TableCell>{row.student.registration}</TableCell>
              <TableCell>
                <Input 
                  type="number"
                  min={0}
                  max={assessment?.totalPoints || 100}
                  step={0.1}
                  value={row.score === null ? '' : row.score}
                  onChange={(e) => handleScoreChange(row.id, e.target.value)}
                  className={`w-24 ${!row.isValid ? 'border-red-500' : ''}`}
                />
                {!row.isValid && <p className="text-xs text-red-500 mt-1">Nota inválida</p>}
              </TableCell>
              <TableCell>
                <Textarea 
                  value={row.feedback}
                  onChange={(e) => handleFeedbackChange(row.id, e.target.value)}
                  placeholder="Feedback ao aluno..."
                  className="min-h-[80px] w-full"
                />
              </TableCell>
              <TableCell>
                <DatePicker
                  date={row.submittedDate}
                  setDate={(date) => handleSubmittedDateChange(row.id, date)}
                  className="w-40"
                />
              </TableCell>
              <TableCell>
                <DatePicker
                  date={row.gradedDate}
                  setDate={(date) => handleGradedDateChange(row.id, date)}
                  className="w-40"
                />
              </TableCell>
              <TableCell>
                <div className="flex space-x-2 justify-end">
                  {row.isSaving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : row.isModified ? (
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSaveRow(row.id)}
                        disabled={!row.isValid}
                      >
                        <Check className="h-5 w-5 text-green-500" />
                      </Button>
                    </div>
                  ) : (
                    <Check className="h-5 w-5 text-gray-300" />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-end">
        <Button 
          onClick={saveAllChanges}
          disabled={!rows.some(r => r.isModified && r.isValid)}
        >
          Salvar Todas as Alterações
        </Button>
      </div>
    </div>
  );
}
