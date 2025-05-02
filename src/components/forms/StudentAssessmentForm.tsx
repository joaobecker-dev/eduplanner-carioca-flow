
import React, { useEffect, useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Assessment, Student, StudentAssessment } from '@/types';

// Define the form schema with Zod
const studentAssessmentFormSchema = z.object({
  studentId: z.string().uuid({ message: 'Selecione um aluno' }),
  assessmentId: z.string().uuid({ message: 'Selecione uma avaliação' }),
  score: z.coerce
    .number()
    .min(0, { message: 'A nota não pode ser negativa' })
    .max(100, { message: 'A nota não pode ser maior que 100' }),
  feedback: z.string().optional().default(''),
  submittedDate: z.date().optional().nullable(),
  gradedDate: z.date().optional().nullable(),
});

// Create a type for the form values
export type StudentAssessmentFormValues = z.infer<typeof studentAssessmentFormSchema>;

interface StudentAssessmentFormProps {
  initialData?: Partial<StudentAssessment>;
  onSubmit: (data: StudentAssessmentFormValues) => void;
  isSubmitting?: boolean;
  students: Student[];
  assessments: Assessment[];
}

const StudentAssessmentForm: React.FC<StudentAssessmentFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  students,
  assessments,
}) => {
  // Initialize the form
  const form = useForm<StudentAssessmentFormValues>({
    resolver: zodResolver(studentAssessmentFormSchema),
    defaultValues: {
      studentId: initialData?.studentId || '',
      assessmentId: initialData?.assessmentId || '',
      score: initialData?.score || 0,
      feedback: initialData?.feedback || '',
      submittedDate: initialData?.submittedDate ? new Date(initialData.submittedDate) : undefined,
      gradedDate: initialData?.gradedDate ? new Date(initialData.gradedDate) : undefined,
    },
  });

  // Get current assessment details for display
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  
  // Update selected assessment when assessmentId changes
  useEffect(() => {
    const assessmentId = form.watch('assessmentId');
    if (assessmentId) {
      const found = assessments.find(assessment => assessment.id === assessmentId);
      setSelectedAssessment(found || null);
    } else {
      setSelectedAssessment(null);
    }
  }, [form.watch('assessmentId'), assessments]);

  // Handle form submission
  const handleSubmit = (values: StudentAssessmentFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Student Selection */}
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aluno</FormLabel>
              <Select
                disabled={isSubmitting}
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.registration})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Assessment Selection */}
        <FormField
          control={form.control}
          name="assessmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avaliação</FormLabel>
              <Select
                disabled={isSubmitting}
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma avaliação" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {assessments.map((assessment) => (
                    <SelectItem key={assessment.id} value={assessment.id}>
                      {assessment.title} ({assessment.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Score Field */}
        <FormField
          control={form.control}
          name="score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nota 
                {selectedAssessment && (
                  <span className="text-muted-foreground ml-1 text-sm">
                    (máx: {selectedAssessment.totalPoints})
                  </span>
                )}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  disabled={isSubmitting}
                  placeholder="Digite a nota do aluno"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Feedback Field */}
        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Feedback (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  disabled={isSubmitting}
                  placeholder="Digite o feedback para o aluno"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submitted Date Field */}
        <FormField
          control={form.control}
          name="submittedDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data de Entrega (opcional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isSubmitting}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value || undefined}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Graded Date Field */}
        <FormField
          control={form.control}
          name="gradedDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data de Correção (opcional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isSubmitting}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value || undefined}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Salvando..." : initialData?.id ? "Atualizar Nota" : "Salvar Nota"}
        </Button>
      </form>
    </Form>
  );
};

export default StudentAssessmentForm;
