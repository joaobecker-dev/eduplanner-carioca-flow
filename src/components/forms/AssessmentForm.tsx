
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
import { Assessment, Subject, TeachingPlan } from '@/types';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Título deve ter pelo menos 3 caracteres' }),
  description: z.string().optional().default(''),
  subjectId: z.string().min(1, { message: 'Selecione uma disciplina' }),
  teachingPlanId: z.string().optional().default(''),
  type: z.enum(['diagnostic', 'formative', 'summative'], {
    required_error: 'Tipo de avaliação é obrigatório'
  }),
  totalPoints: z.coerce.number({ required_error: 'Total de pontos é obrigatório' })
    .min(1, { message: 'Total de pontos deve ser pelo menos 1' }),
  date: z.date({ required_error: 'Data da avaliação é obrigatória' }),
  dueDate: z.date().optional(),
});

// Export the inferred type for use in other components
export type AssessmentFormValues = z.infer<typeof formSchema>;

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
    resolver: zodResolver(formSchema),
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
                <Input {...field} disabled={isSubmitting} placeholder="Avaliação: Frações e Decimais" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disciplina*</FormLabel>
                <Select
                  disabled={isSubmitting}
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue('teachingPlanId', '');
                  }}
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

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Avaliação*</FormLabel>
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(assessmentTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
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
          name="teachingPlanId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plano de Ensino (opcional)</FormLabel>
              <Select
                disabled={isSubmitting || !selectedSubjectId}
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um plano de ensino (opcional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Nenhum plano selecionado</SelectItem>
                  {filteredTeachingPlans.map(plan => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.title}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isSubmitting}
                  placeholder="Descrição detalhada da avaliação"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="totalPoints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total de Pontos*</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  disabled={isSubmitting}
                  min={1}
                  step={0.5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data da Avaliação*</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isSubmitting}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ptBR })
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
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("2000-01-01")}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Entrega (opcional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isSubmitting}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data (opcional)</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < form.getValues("date")}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default AssessmentForm;
