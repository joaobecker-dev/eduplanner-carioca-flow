
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { 
  studentAssessmentService, 
  assessmentService,
  studentService 
} from '@/lib/services';
import { Assessment, Student, StudentAssessment, ID } from '@/types';

export interface GradeRowData {
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

export function useStudentAssessments(assessmentId: ID) {
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
  
  // Fetch students to associate with student assessments
  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentService.getAll(),
    enabled: true,
  });

  useEffect(() => {
    if (assessmentData) {
      setAssessment(assessmentData);
    }
  }, [assessmentData]);

  useEffect(() => {
    if (studentAssessments && students) {
      const mappedRows: GradeRowData[] = studentAssessments.map(sa => {
        // Find the student information from the students array using studentId
        const student = students.find(s => s.id === sa.studentId);
        
        // Create a fallback minimal student if not found with created_at field
        const studentData: Student = student || {
          id: sa.studentId,
          name: 'Unknown Student',
          registration: 'N/A',
          created_at: new Date().toISOString()
        };
        
        return {
          id: sa.id,
          student: studentData,
          score: sa.score !== undefined ? sa.score : null,
          feedback: sa.feedback || '',
          submittedDate: sa.submittedDate ? new Date(sa.submittedDate) : null,
          gradedDate: sa.gradedDate ? new Date(sa.gradedDate) : null,
          isModified: false,
          isValid: true,
          isSaving: false,
        };
      });
      setRows(mappedRows);
    }
  }, [studentAssessments, students]);

  const handleScoreChange = (id: ID, value: string) => {
    const score = value === '' ? null : Number(value);
    setRows(prevRows => prevRows.map(row => {
      if (row.id === id) {
        const isValid = score === null || 
          (assessment && score >= 0 && score <= (assessment.totalPoints || 100));
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

  return {
    rows,
    assessment,
    isLoading,
    isAssessmentLoading,
    error,
    handleScoreChange,
    handleFeedbackChange,
    handleSubmittedDateChange,
    handleGradedDateChange,
    handleSaveRow,
    saveAllChanges,
    refreshData: () => setRefreshKey(prev => prev + 1)
  };
}
