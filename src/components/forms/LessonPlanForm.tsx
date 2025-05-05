
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { LessonPlan, TeachingPlan } from '@/types';
import { lessonPlanSchema, LessonPlanSchemaValues } from '@/schemas/lessonPlanSchema';
import InputField from './fields/InputField';
import TextAreaField from './fields/TextAreaField';
import SelectField from './fields/SelectField';
import DatePickerField from './fields/DatePickerField';
import FormSection from './layout/FormSection';

export type LessonPlanFormValues = LessonPlanSchemaValues;

interface LessonPlanFormProps {
  onSubmit: (data: LessonPlanFormValues) => void;
  initialData?: Partial<LessonPlan>;
  teachingPlans: TeachingPlan[];
  isSubmitting?: boolean;
}

const LessonPlanForm: React.FC<LessonPlanFormProps> = ({
  onSubmit,
  initialData,
  teachingPlans,
  isSubmitting = false,
}) => {
  const form = useForm<LessonPlanFormValues>({
    resolver: zodResolver(lessonPlanSchema),
    defaultValues: {
      title: initialData?.title || '',
      teachingPlanId: initialData?.teachingPlanId || '',
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      duration: initialData?.duration || 50,
      objectives: initialData?.objectives ? initialData.objectives.join('\n') : '',
      content: initialData?.content || '',
      activities: initialData?.activities ? initialData.activities.join('\n') : '',
      resources: initialData?.resources ? initialData.resources.join('\n') : '',
      homework: initialData?.homework || '',
      evaluation: initialData?.evaluation || '',
      notes: initialData?.notes || '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title || '',
        teachingPlanId: initialData.teachingPlanId || '',
        date: initialData.date ? new Date(initialData.date) : new Date(),
        duration: initialData.duration || 50,
        objectives: initialData.objectives ? initialData.objectives.join('\n') : '',
        content: initialData.content || '',
        activities: initialData.activities ? initialData.activities.join('\n') : '',
        resources: initialData.resources ? initialData.resources.join('\n') : '',
        homework: initialData.homework || '',
        evaluation: initialData.evaluation || '',
        notes: initialData.notes || '',
      });
    }
  }, [initialData, form]);

  const handleSubmit = (values: LessonPlanFormValues) => {
    // Keep the form values as they are defined in the schema
    // Let the consumer of the component handle the conversion to arrays as needed
    onSubmit(values);
  };

  const teachingPlanOptions = teachingPlans.map(plan => ({
    label: plan.title,
    value: plan.id
  }));

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormSection>
          <InputField
            name="title"
            label="Título*"
            placeholder="Aula: Operações com frações"
            disabled={isSubmitting}
          />

          <SelectField
            name="teachingPlanId"
            label="Plano de Ensino*"
            placeholder="Selecione um plano de ensino"
            options={teachingPlanOptions}
            disabled={isSubmitting}
          />
        </FormSection>

        <FormSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePickerField
              name="date"
              label="Data da Aula*"
              placeholder="Selecione uma data"
              disabled={isSubmitting}
              disabledBefore={new Date("2000-01-01")}
            />

            <InputField
              name="duration"
              label="Duração (minutos)*"
              type="number"
              disabled={isSubmitting}
            />
          </div>
        </FormSection>

        <FormSection>
          <TextAreaField
            name="objectives"
            label="Objetivos (um por linha)"
            placeholder="Compreender adição de frações com denominadores iguais
Resolver problemas envolvendo adição e subtração de frações
Aplicar os conceitos em situações do cotidiano"
            disabled={isSubmitting}
            rows={3}
            className="min-h-[100px]"
          />

          <TextAreaField
            name="content"
            label="Conteúdos (um por linha)"
            placeholder="Frações: adição e subtração
Denominadores iguais
Resolução de problemas"
            disabled={isSubmitting}
            rows={3}
            className="min-h-[100px]"
          />
        </FormSection>

        <FormSection>
          <TextAreaField
            name="activities"
            label="Atividades (uma por linha)"
            placeholder="Apresentação do conteúdo (15min)
Exercícios em grupo (20min)
Correção coletiva (15min)"
            disabled={isSubmitting}
            rows={3}
            className="min-h-[100px]"
          />

          <TextAreaField
            name="resources"
            label="Recursos (um por linha)"
            placeholder="Livro didático
Material manipulável de frações
Lousa e canetão
Folhas de atividades"
            disabled={isSubmitting}
            rows={3}
            className="min-h-[100px]"
          />
        </FormSection>

        <FormSection>
          <TextAreaField
            name="homework"
            label="Tarefa de Casa"
            placeholder="Livro didático, páginas 45 e 46, exercícios 1 a 5."
            disabled={isSubmitting}
            rows={2}
            className="min-h-[80px]"
          />

          <TextAreaField
            name="evaluation"
            label="Avaliação"
            placeholder="Participação nas atividades em grupo
Resolução dos exercícios
Participação nas discussões"
            disabled={isSubmitting}
            rows={2}
            className="min-h-[80px]"
          />

          <TextAreaField
            name="notes"
            label="Observações"
            placeholder="Notas adicionais sobre a aula ou adaptações necessárias"
            disabled={isSubmitting}
            rows={2}
            className="min-h-[80px]"
          />
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

export default LessonPlanForm;
