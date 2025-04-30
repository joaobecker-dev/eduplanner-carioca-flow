
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { AnnualPlan, Subject, AcademicPeriod } from '@/types';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Título deve ter pelo menos 3 caracteres' }),
  description: z.string().optional(),
  subjectId: z.string().min(1, { message: 'Selecione uma disciplina' }),
  academicPeriodId: z.string().min(1, { message: 'Selecione um período acadêmico' }),
  objectives: z.string().optional(),
  generalContent: z.string().min(3, { message: 'Conteúdo geral é obrigatório' }),
  methodology: z.string().min(3, { message: 'Metodologia é obrigatória' }),
  evaluation: z.string().min(3, { message: 'Avaliação é obrigatória' }),
  referencesMaterials: z.string().optional(),
});

interface AnnualPlanFormProps {
  onSubmit: (data: any) => void;
  initialData?: Partial<AnnualPlan>;
  subjects: Subject[];
  academicPeriods: AcademicPeriod[];
  isSubmitting?: boolean;
}

const AnnualPlanForm: React.FC<AnnualPlanFormProps> = ({
  onSubmit,
  initialData,
  subjects,
  academicPeriods,
  isSubmitting = false,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      subjectId: initialData?.subjectId || '',
      academicPeriodId: initialData?.academicPeriodId || '',
      objectives: initialData?.objectives ? initialData.objectives.join('\n') : '',
      generalContent: initialData?.generalContent || '',
      methodology: initialData?.methodology || '',
      evaluation: initialData?.evaluation || '',
      referencesMaterials: initialData?.referencesMaterials ? initialData.referencesMaterials.join('\n') : '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title || '',
        description: initialData.description || '',
        subjectId: initialData.subjectId || '',
        academicPeriodId: initialData.academicPeriodId || '',
        objectives: initialData.objectives ? initialData.objectives.join('\n') : '',
        generalContent: initialData.generalContent || '',
        methodology: initialData.methodology || '',
        evaluation: initialData.evaluation || '',
        referencesMaterials: initialData.referencesMaterials ? initialData.referencesMaterials.join('\n') : '',
      });
    }
  }, [initialData, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const formattedData = {
      ...values,
      objectives: values.objectives ? values.objectives.split('\n').filter(item => item.trim() !== '') : [],
      referencesMaterials: values.referencesMaterials ? values.referencesMaterials.split('\n').filter(item => item.trim() !== '') : [],
    };
    onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título*</FormLabel>
              <FormControl>
                <Input {...field} disabled={isSubmitting} placeholder="Plano Anual de Matemática 2025" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="academicPeriodId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Período Acadêmico*</FormLabel>
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um período" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {academicPeriods.map(period => (
                      <SelectItem key={period.id} value={period.id}>
                        {period.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disciplina*</FormLabel>
                <Select
                  disabled={isSubmitting}
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
                    {subjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isSubmitting}
                  placeholder="Breve descrição do plano anual"
                  className="min-h-[80px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="objectives"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objetivos (um por linha)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isSubmitting}
                  placeholder="Desenvolver habilidades de resolução de problemas
Compreender conceitos fundamentais de álgebra
Aplicar conhecimentos em situações práticas"
                  className="min-h-[120px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="generalContent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo Geral*</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isSubmitting}
                  placeholder="Conteúdos a serem abordados durante o ano letivo"
                  className="min-h-[120px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="methodology"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Metodologia*</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isSubmitting}
                  placeholder="Metodologias de ensino a serem utilizadas"
                  className="min-h-[120px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="evaluation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avaliação*</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isSubmitting}
                  placeholder="Métodos de avaliação a serem aplicados"
                  className="min-h-[120px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="referencesMaterials"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referências e Materiais (um por linha)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isSubmitting}
                  placeholder="Livro Matemática Fundamental - Autor X
Site educacional www.exemplo.com.br
Material didático próprio"
                  className="min-h-[120px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default AnnualPlanForm;
