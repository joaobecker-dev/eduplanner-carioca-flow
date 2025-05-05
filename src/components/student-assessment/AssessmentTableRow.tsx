
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ID } from '@/types';
import { GradeRowData } from '@/hooks/useStudentAssessments';

interface AssessmentTableRowProps {
  row: GradeRowData;
  maxPoints: number;
  onScoreChange: (id: ID, value: string) => void;
  onFeedbackChange: (id: ID, value: string) => void;
  onSubmittedDateChange: (id: ID, date: Date | null) => void;
  onGradedDateChange: (id: ID, date: Date | null) => void;
  onSaveRow: (id: ID) => Promise<void>;
}

const AssessmentTableRow: React.FC<AssessmentTableRowProps> = ({
  row,
  maxPoints,
  onScoreChange,
  onFeedbackChange,
  onSubmittedDateChange,
  onGradedDateChange,
  onSaveRow
}) => {
  return (
    <TableRow 
      key={row.id} 
      className={row.isModified && !row.isValid ? "bg-red-50" : ""}
    >
      <TableCell>{row.student.name}</TableCell>
      <TableCell>{row.student.registration}</TableCell>
      <TableCell>
        <Input 
          type="number"
          min={0}
          max={maxPoints}
          step={0.1}
          value={row.score === null ? '' : row.score}
          onChange={(e) => onScoreChange(row.id, e.target.value)}
          className={`w-24 ${!row.isValid ? 'border-red-500' : ''}`}
        />
        {!row.isValid && <p className="text-xs text-red-500 mt-1">Nota inválida</p>}
      </TableCell>
      <TableCell>
        <Textarea 
          value={row.feedback}
          onChange={(e) => onFeedbackChange(row.id, e.target.value)}
          placeholder="Feedback ao aluno..."
          className="min-h-[80px] w-full"
        />
      </TableCell>
      <TableCell>
        <DatePicker
          date={row.submittedDate}
          setDate={(date) => onSubmittedDateChange(row.id, date)}
          className="w-40"
        />
      </TableCell>
      <TableCell>
        <DatePicker
          date={row.gradedDate}
          setDate={(date) => onGradedDateChange(row.id, date)}
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
                onClick={() => onSaveRow(row.id)}
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
  );
};

export default AssessmentTableRow;
