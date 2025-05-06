import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { StudentAssessment, Student } from '@/types';
import { services } from '@/lib/services';
import { studentAssessmentSchema, StudentAssessmentFormValues } from '@/schemas/studentAssessmentSchema';
import InputField from '@/components/forms/fields/InputField';
import DatePickerField from '@/components/forms/fields/DatePickerField';
import TextAreaField from '@/components/forms/fields/TextAreaField';
import SelectField from '@/components/forms/fields/SelectField';

interface StudentAssessmentModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  studentAssessment?: StudentAssessment;
  assessmentId: string;
  students: Student[];
  onSuccess: () => void;
}

const StudentAssessmentModals: React.FC<StudentAssessmentModalProps> = ({
  isOpen,
  setIsOpen,
  studentAssessment,
  assessmentId,
  students,
  onSuccess
}) => {
  const [isSubmitting, setSubmitting] = useState(false);

  const form = useForm<StudentAssessmentFormValues>({
    resolver: zodResolver(studentAssessmentSchema),
    defaultValues: {
      studentId: studentAssessment?.studentId || '',
      assessmentId: assessmentId,
      score: studentAssessment?.score || 0,
      feedback: studentAssessment?.feedback || '',
      submittedDate: studentAssessment?.submittedDate ? new Date(studentAssessment.submittedDate) : undefined,
      gradedDate: studentAssessment?.gradedDate ? new Date(studentAssessment.gradedDate) : undefined,
    },
  });

  useEffect(() => {
    if (studentAssessment) {
      form.reset({
        studentId: studentAssessment.studentId,
        assessmentId: assessmentId,
        score: studentAssessment.score || 0,
        feedback: studentAssessment.feedback || '',
        submittedDate: studentAssessment.submittedDate ? new Date(studentAssessment.submittedDate) : undefined,
        gradedDate: studentAssessment.gradedDate ? new Date(studentAssessment.gradedDate) : undefined,
      });
    } else {
      form.setValue("assessmentId", assessmentId);
    }
  }, [studentAssessment, assessmentId, form]);

  const handleSubmit = async (data: StudentAssessmentFormValues) => {
    try {
      setSubmitting(true);

      const assessmentData = {
        studentId: data.studentId,
        assessmentId: data.assessmentId,
        score: data.score,
        feedback: data.feedback,
        submittedDate: data.submittedDate,
        gradedDate: data.gradedDate,
        status: data.gradedDate ? 'graded' as const : (data.submittedDate ? 'submitted' as const : 'pending' as const),
        created_at: new Date().toISOString()
      };

      if (studentAssessment?.id) {
        await services.studentAssessment.update(studentAssessment.id, assessmentData);
        toast({
          title: "Avaliação atualizada",
          description: "A avaliação do estudante foi atualizada com sucesso!",
        });
      } else {
        await services.studentAssessment.create(assessmentData as Omit<StudentAssessment, "id">);
        toast({
          title: "Avaliação criada",
          description: "A avaliação do estudante foi criada com sucesso!",
        });
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a avaliação.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const studentOptions = students.map(student => ({
    label: student.name,
    value: student.id
  }));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{studentAssessment ? "Editar Avaliação" : "Nova Avaliação"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <SelectField
            name="studentId"
            label="Estudante"
            placeholder="Selecione um estudante"
            options={studentOptions}
            control={form.control}
          />
          <InputField
            label="Nota"
            name="score"
            type="number"
            placeholder="0-10"
            control={form.control}
          />
          <TextAreaField
            label="Feedback"
            name="feedback"
            placeholder="Feedback para o estudante"
            control={form.control}
          />
          <DatePickerField
            label="Data de Entrega"
            name="submittedDate"
            placeholder="Data de entrega da avaliação"
            control={form.control}
          />
          <DatePickerField
            label="Data de Correção"
            name="gradedDate"
            placeholder="Data de correção da avaliação"
            control={form.control}
          />
        </form>
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudentAssessmentModals;
