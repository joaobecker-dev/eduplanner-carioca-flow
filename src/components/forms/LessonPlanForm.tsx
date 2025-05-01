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
import { LessonPlan, TeachingPlan } from '@/types';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Título deve ter pelo menos 3 caracteres' }),
  teachingPlanId: z.string().min(1, { message: 'Selecione um plano de ensino' }),
  date: z.date({ required_error: 'Data da aula é obrigatória' }),
  duration: z.number({ required_error: 'Duração é obrigatória' })
    .min(1, { message: 'Duração deve ser pelo menos 1 minuto' }),
  objectives: z.string().optional().default(''),
  contents: z.string().optional().default(''),
  activities: z.string().optional().default(''),
  resources: z.string().optional().default(''),
  homework: z.string().optional(),
  evaluation: z.string().optional(),
  notes: z.string().optional(),
});

export type LessonPlanFormValues = z.infer<typeof formSchema>;

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
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      teachingPlanId: initialData?.teachingPlanId || '',
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      duration: initialData?.duration || 50,
      objectives: initialData?.objectives ? initialData.objectives.join('\n') : '',
      contents: initialData?.contents ? initialData.contents.join('\n') : '',
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
        contents: initialData.contents ? initialData.contents.join('\n') : '',
        activities: initialData.activities ? initialData.activities.join('\n') : '',
        resources: initialData.resources ? initialData.resources.join('\n') : '',
        homework: initialData.homework || '',
        evaluation: initialData.evaluation || '',
        notes: initialData.notes || '',
      });
    }
  }, [initialData, form]);

  const handleSubmit = (values: LessonPlanFormValues) => {
    // Convert string fields with newlines back to arrays
    const formattedData = {
      ...values,
      objectives: values.objectives ? values.objectives.split('\n').filter(item => item.trim() !== '') : [],
      contents: values.contents ? values.contents.split('\n').filter(item => item.trim() !== '') : [],
      activities: values.activities ? values.activities.split('\n').filter(item => item.trim() !== '') : [],
      resources: values.resources ? values.resources.split('\n').filter(item => item.trim() !== '') : [],
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
                <Input {...field} disabled={isSubmitting} placeholder="Aula: Operações com frações" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="teachingPlanId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plano de Ensino*</FormLabel>
              <Select
                disabled={isSubmitting}
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um plano de ensino" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teachingPlans.map(plan => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data da Aula*</FormLabel>
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
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duração (minutos)*</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    disabled={isSubmitting}
                    min={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                  placeholder="Compreender adição de frações com denominadores iguais
Resolver problemas envolvendo adição e subtração de frações
Aplicar os conceitos em situações do cotidiano"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdos (um por linha)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isSubmitting}
                  placeholder="Frações: adição e subtração
Denominadores iguais
Resolução de problemas"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="activities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Atividades (uma por linha)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isSubmitting}
                  placeholder="Apresentação do conteúdo (15min)
Exercícios em grupo (20min)
Correção coletiva (15min)"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resources"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recursos (um por linha)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isSubmitting}
                  placeholder="Livro didático
Material manipulável de frações
Lousa e canetão
Folhas de atividades"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="homework"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tarefa de Casa</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isSubmitting}
                  placeholder="Livro didático, páginas 45 e 46, exercícios 1 a 5."
                  className="min-h-[80px]"
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
              <FormLabel>Avaliação</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isSubmitting}
                  placeholder="Participação nas atividades em grupo
Resolução dos exercícios
Participação nas discussões"
                  className="min-h-[80px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isSubmitting}
                  placeholder="Notas adicionais sobre a aula ou adaptações necessárias"
                  className="min-h-[80px]"
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

export default LessonPlanForm;
