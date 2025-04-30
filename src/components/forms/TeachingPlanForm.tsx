
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
import { TeachingPlan, Subject, AnnualPlan } from '@/types';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Título deve ter pelo menos 3 caracteres' }),
  description: z.string().optional(),
  subjectId: z.string().min(1, { message: 'Selecione uma disciplina' }),
  annualPlanId: z.string().min(1, { message: 'Selecione um plano anual' }),
  objectives: z.string().optional(),
  contents: z.string().optional(),
  startDate: z.date({ required_error: 'Data de início é obrigatória' }),
  endDate: z.date({ required_error: 'Data de fim é obrigatória' }),
  methodology: z.string().min(3, { message: 'Metodologia é obrigatória' }),
  resources: z.string().optional(),
  evaluation: z.string().min(3, { message: 'Avaliação é obrigatória' }),
  bnccReferences: z.string().optional(),
});

interface TeachingPlanFormProps {
  onSubmit: (data: any) => void;
  initialData?: Partial<TeachingPlan>;
  subjects: Subject[];
  annualPlans: AnnualPlan[];
  isSubmitting?: boolean;
}

const TeachingPlanForm: React.FC<TeachingPlanFormProps> = ({
  onSubmit,
  initialData,
  subjects,
  annualPlans,
  isSubmitting = false,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      subjectId: initialData?.subjectId || '',
      annualPlanId: initialData?.annualPlanId || '',
      objectives: initialData?.objectives ? initialData.objectives.join('\n') : '',
      contents: initialData?.contents ? initialData.contents.join('\n') : '',
      startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date(),
      endDate: initialData?.endDate ? new Date(initialData.endDate) : new Date(),
      methodology: initialData?.methodology || '',
      resources: initialData?.resources ? initialData.resources.join('\n') : '',
      evaluation: initialData?.evaluation || '',
      bnccReferences: initialData?.bnccReferences ? initialData.bnccReferences.join('\n') : '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title || '',
        description: initialData.description || '',
        subjectId: initialData.subjectId || '',
        annualPlanId: initialData.annualPlanId || '',
        objectives: initialData.objectives ? initialData.objectives.join('\n') : '',
        contents: initialData.contents ? initialData.contents.join('\n') : '',
        startDate: initialData.startDate ? new Date(initialData.startDate) : new Date(),
        endDate: initialData.endDate ? new Date(initialData.endDate) : new Date(),
        methodology: initialData.methodology || '',
        resources: initialData.resources ? initialData.resources.join('\n') : '',
        evaluation: initialData.evaluation || '',
        bnccReferences: initialData.bnccReferences ? initialData.bnccReferences.join('\n') : '',
      });
    }
  }, [initialData, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const formattedData = {
      ...values,
      objectives: values.objectives ? values.objectives.split('\n').filter(item => item.trim() !== '') : [],
      contents: values.contents ? values.contents.split('\n').filter(item => item.trim() !== '') : [],
      resources: values.resources ? values.resources.split('\n').filter(item => item.trim() !== '') : [],
      bnccReferences: values.bnccReferences ? values.bnccReferences.split('\n').filter(item => item.trim() !== '') : [],
    };
    onSubmit(formattedData);
  };

  // Filter annual plans by selected subject
  const selectedSubjectId = form.watch('subjectId');
  const filteredAnnualPlans = annualPlans.filter(plan => 
    !selectedSubjectId || plan.subjectId === selectedSubjectId
  );

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
                <Input {...field} disabled={isSubmitting} placeholder="Plano de Ensino: Frações e Decimais" />
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
                    form.setValue('annualPlanId', '');
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
            name="annualPlanId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plano Anual*</FormLabel>
                <Select
                  disabled={isSubmitting || !selectedSubjectId}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um plano anual" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredAnnualPlans.map(plan => (
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
                  placeholder="Breve descrição do plano de ensino"
                  className="min-h-[80px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Início*</FormLabel>
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
                      disabled={(date) =>
                        date < new Date("2000-01-01")
                      }
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
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Término*</FormLabel>
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
                      disabled={(date) =>
                        date < form.getValues("startDate")
                      }
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
                  placeholder="Compreender o conceito de frações
Realizar operações básicas com números decimais
Resolver problemas envolvendo frações e decimais"
                  className="min-h-[120px]"
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
                  placeholder="Conceito de fração
Operações com frações
Números decimais
Conversão entre frações e decimais"
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
                  placeholder="Aulas expositivas dialogadas
Resolução de problemas em grupo
Uso de materiais manipuláveis"
                  className="min-h-[120px]"
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
Material manipulável (frações)
Apresentações de slides
Vídeos educativos"
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
                  placeholder="Participação em aula
Atividades individuais e em grupo
Avaliação formativa
Prova escrita"
                  className="min-h-[120px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bnccReferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referências BNCC (um por linha)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isSubmitting}
                  placeholder="EF05MA03
EF05MA04
EF05MA05"
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

export default TeachingPlanForm;
