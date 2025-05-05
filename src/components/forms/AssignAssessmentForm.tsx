
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

// UI Components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

// Services
import { subjectService, assessmentService, studentService, studentAssessmentService } from '@/lib/services';

// Types
import { Subject, Assessment, Student, StudentAssessment } from '@/types';

// Schema for form validation
const assignmentSchema = z.object({
  subjectId: z.string().uuid({ message: 'Selecione uma disciplina' }),
  assessmentId: z.string().uuid({ message: 'Selecione uma avaliação' }),
  assignmentType: z.enum(['all', 'specific'], { required_error: 'Selecione um tipo de atribuição' }),
  studentIds: z.array(z.string().uuid()).refine(value => value.length > 0, {
    message: 'Selecione pelo menos um aluno',
    path: ['studentIds']
  })
});

// Define types based on the schema
type AssignmentFormValues = z.infer<typeof assignmentSchema>;

export function AssignAssessmentForm() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showStudentSelection, setShowStudentSelection] = useState(false);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      subjectId: '',
      assessmentId: '',
      assignmentType: 'all',
      studentIds: []
    }
  });

  // Get watch function from form
  const { watch, setValue } = form;
  const watchSubjectId = watch('subjectId');
  const watchAssignmentType = watch('assignmentType');

  // Fetch subjects
  const { data: subjects, isLoading: loadingSubjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => await subjectService.getAll(),
  });

  // Fetch assessments for selected subject
  const { data: assessments, isLoading: loadingAssessments } = useQuery({
    queryKey: ['assessments', watchSubjectId],
    queryFn: async () => await assessmentService.getBySubject(watchSubjectId),
    enabled: !!watchSubjectId,
  });

  // Fetch students for selected subject
  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: ['students', watchSubjectId],
    queryFn: async () => await studentService.getBySubject(watchSubjectId),
    enabled: !!watchSubjectId,
  });

  // Handle subject change
  useEffect(() => {
    if (watchSubjectId) {
      setSelectedSubject(watchSubjectId);
      // Reset assessment and student selection when subject changes
      setValue('assessmentId', '');
      setValue('studentIds', []);
    }
  }, [watchSubjectId, setValue]);

  // Handle assignment type change
  useEffect(() => {
    setShowStudentSelection(watchAssignmentType === 'specific');
    if (watchAssignmentType === 'all' && students) {
      // If "all students" is selected, automatically select all students
      setValue('studentIds', students.map(student => student.id));
    } else if (watchAssignmentType === 'specific') {
      // If "specific students" is selected, clear the selection
      setValue('studentIds', []);
    }
  }, [watchAssignmentType, students, setValue]);

  // Mutation for creating student assessments
  const createAssignmentsMutation = useMutation({
    mutationFn: async (data: { assessmentId: string, studentIds: string[] }) => {
      // Create empty array to store results
      const results: Array<StudentAssessment | null> = [];
      
      // Create a student assessment for each selected student
      for (const studentId of data.studentIds) {
        const result = await studentAssessmentService.create({
          assessmentId: data.assessmentId,
          studentId,
          score: 0, // Initial score of 0
          submittedDate: null,
          gradedDate: null,
          feedback: null,
          status: 'pending', // Required status field
          created_at: new Date().toISOString() // Required created_at field
        });
        results.push(result);
      }
      
      return results;
    },
    onSuccess: () => {
      toast.success('Avaliação atribuída com sucesso!');
      navigate('/avaliacoes');
    },
    onError: (error) => {
      console.error('Error assigning assessment:', error);
      toast.error('Erro ao atribuir avaliação');
    }
  });

  // Form submission handler
  const onSubmit = (data: AssignmentFormValues) => {
    createAssignmentsMutation.mutate({
      assessmentId: data.assessmentId,
      studentIds: data.studentIds
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Subject Field */}
              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disciplina</FormLabel>
                    <Select
                      disabled={loadingSubjects}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma disciplina" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects?.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name} ({subject.grade})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Assessment Field */}
              {selectedSubject && (
                <FormField
                  control={form.control}
                  name="assessmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avaliação</FormLabel>
                      <Select
                        disabled={loadingAssessments || !assessments?.length}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma avaliação" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {assessments?.map((assessment) => (
                            <SelectItem key={assessment.id} value={assessment.id}>
                              {assessment.title} ({assessment.totalPoints} pts)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                      {assessments?.length === 0 && !loadingAssessments && (
                        <div className="text-sm text-muted-foreground mt-2">
                          Nenhuma avaliação disponível para esta disciplina.
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              )}

              {/* Assignment Type */}
              {selectedSubject && (
                <FormField
                  control={form.control}
                  name="assignmentType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Tipo de Atribuição</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="all" />
                            <FormLabel htmlFor="all" className="font-normal">
                              Todos os alunos
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="specific" id="specific" />
                            <FormLabel htmlFor="specific" className="font-normal">
                              Alunos específicos
                            </FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Student Selection */}
              {selectedSubject && showStudentSelection && (
                <FormField
                  control={form.control}
                  name="studentIds"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Selecione os Alunos</FormLabel>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {loadingStudents ? (
                          <div>Carregando alunos...</div>
                        ) : students?.length === 0 ? (
                          <div>Nenhum aluno encontrado para esta disciplina.</div>
                        ) : (
                          students?.map((student) => (
                            <FormField
                              key={student.id}
                              control={form.control}
                              name="studentIds"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={student.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(student.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, student.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== student.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {student.name} - {student.registration}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={createAssignmentsMutation.isPending}
              >
                {createAssignmentsMutation.isPending ? 'Atribuindo...' : 'Atribuir Avaliação'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
