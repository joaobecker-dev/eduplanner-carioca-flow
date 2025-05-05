
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ID } from '@/types';
import { useStudentAssessments } from '@/hooks/useStudentAssessments';
import AssessmentTableHeader from './student-assessment/AssessmentTableHeader';
import AssessmentTableRow from './student-assessment/AssessmentTableRow';
import AssessmentTableStatus from './student-assessment/AssessmentTableStatus';

interface StudentAssessmentTableProps {
  assessmentId: ID;
}

export function StudentAssessmentTable({ assessmentId }: StudentAssessmentTableProps) {
  const {
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
    refreshData
  } = useStudentAssessments(assessmentId);

  const isTableEmpty = !rows.length;
  
  if (isLoading || isAssessmentLoading) {
    return <AssessmentTableStatus isLoading={true} error={null} onRefresh={refreshData} />;
  }

  if (error) {
    return <AssessmentTableStatus isLoading={false} error={error} onRefresh={refreshData} />;
  }

  if (isTableEmpty) {
    return <AssessmentTableStatus isLoading={false} error={null} isEmpty={true} onRefresh={refreshData} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {assessment ? `Pontuação Máxima: ${assessment.totalPoints}` : 'Carregando...'}
        </h2>
        <Button 
          onClick={saveAllChanges} 
          disabled={!rows.some(r => r.isModified && r.isValid)} 
          className="ml-auto"
        >
          Salvar Todas as Alterações
        </Button>
      </div>

      <Table>
        <AssessmentTableHeader />
        <TableBody>
          {rows.map(row => (
            <AssessmentTableRow
              key={row.id}
              row={row}
              maxPoints={assessment?.totalPoints || 100}
              onScoreChange={handleScoreChange}
              onFeedbackChange={handleFeedbackChange}
              onSubmittedDateChange={handleSubmittedDateChange}
              onGradedDateChange={handleGradedDateChange}
              onSaveRow={handleSaveRow}
            />
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
