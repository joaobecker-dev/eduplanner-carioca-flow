
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Assessment, Subject, TeachingPlan } from '@/types';
import { assessmentSchema, AssessmentSchemaValues } from '@/schemas/assessmentSchema';
import InputField from './fields/InputField';
import SelectField from './fields/SelectField';
import TextAreaField from './fields/TextAreaField';
import DatePickerField from './fields/DatePickerField';
import FormSection from './layout/FormSection';

export type AssessmentFormValues = AssessmentSchemaValues;

interface AssessmentFormProps {
  onSubmit: (data: AssessmentFormValues) => void;
  initialData?: Partial<Assessment>;
  subjects: Subject[];
  teachingPlans: TeachingPlan[];
  isSubmitting?: boolean;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({
  onSubmit,
  initialData,
  subjects,
  teachingPlans,
  isSubmitting = false,
}) => {
  const form = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      subjectId: initialData?.subjectId || '',
      teachingPlanId: initialData?.teachingPlanId || '',
      type: (initialData?.type as any) || 'diagnostic',
      totalPoints: initialData?.totalPoints !== undefined ? Number(initialData.totalPoints) : 10,
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title || '',
        description: initialData.description || '',
        subjectId: initialData.subjectId || '',
        teachingPlanId: initialData.teachingPlanId || '',
        type: (initialData.type as any) || 'diagnostic',
        totalPoints: initialData.totalPoints !== undefined ? Number(initialData.totalPoints) : 10,
        date: initialData.date ? new Date(initialData.date) : new Date(),
        dueDate: initialData.dueDate ? new Date(initialData.dueDate) : undefined,
      });
    }
  }, [initialData, form]);

  const handleSubmit = (values: AssessmentFormValues) => {
    onSubmit(values);
  };

  // Filter teaching plans by selected subject
  const selectedSubjectId = form.watch('subjectId');
  const filteredTeachingPlans = teachingPlans.filter(plan => 
    !selectedSubjectId || plan.subjectId === selectedSubjectId
  );

  const assessmentTypeLabels: Record<string, string> = {
    'diagnostic': 'Diagnóstica',
    'formative': 'Formativa',
    'summative': 'Somativa'
  };

  const assessmentTypeOptions = Object.entries(assessmentTypeLabels).map(([value, label]) => ({
    value,
    label
  }));

  const subjectOptions = subjects.map(subject => ({
    value: subject.id,
    label: subject.name
  }));

  const teachingPlanOptions = [
    { value: "", label: "Nenhum plano selecionado" },
    ...filteredTeachingPlans.map(plan => ({
      value: plan.id,
      label: plan.title
    }))
  ];

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormSection>
          <InputField
            name="title"
            label="Título*"
            placeholder="Avaliação: Frações e Decimais"
            disabled={isSubmitting}
          />
        </FormSection>

        <FormSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              name="subjectId"
              label="Disciplina*"
              placeholder="Selecione uma disciplina"
              options={subjectOptions}
              disabled={isSubmitting}
              onValueChange={() => form.setValue('teachingPlanId', '')}
            />

            <SelectField
              name="type"
              label="Tipo de Avaliação*"
              placeholder="Selecione o tipo"
              options={assessmentTypeOptions}
              disabled={isSubmitting}
            />
          </div>

          <SelectField
            name="teachingPlanId"
            label="Plano de Ensino (opcional)"
            placeholder="Selecione um plano de ensino (opcional)"
            options={teachingPlanOptions}
            disabled={isSubmitting || !selectedSubjectId}
          />

          <TextAreaField
            name="description"
            label="Descrição"
            placeholder="Descrição detalhada da avaliação"
            rows={4}
            disabled={isSubmitting}
          />
        </FormSection>

        <FormSection>
          <InputField
            name="totalPoints"
            label="Total de Pontos*"
            type="number"
            disabled={isSubmitting}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePickerField
              name="date"
              label="Data da Avaliação*"
              placeholder="Selecione uma data"
              disabled={isSubmitting}
              disabledBefore={new Date("2000-01-01")}
            />

            <DatePickerField
              name="dueDate"
              label="Data de Entrega (opcional)"
              placeholder="Selecione uma data (opcional)"
              disabled={isSubmitting}
              disabledBefore={form.getValues("date")}
            />
          </div>
        </FormSection>
        
        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : initialData?.id ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AssessmentForm;
