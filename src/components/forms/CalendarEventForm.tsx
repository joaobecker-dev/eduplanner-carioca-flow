
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
import { Switch } from '@/components/ui/switch';
import { CalendarEvent, Subject, Assessment, LessonPlan } from '@/types';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Título deve ter pelo menos 3 caracteres' }),
  description: z.string().optional(),
  type: z.enum(['class', 'exam', 'meeting', 'deadline', 'other'], {
    required_error: 'Tipo de evento é obrigatório'
  }),
  subjectId: z.string().optional(),
  startDate: z.date({ required_error: 'Data de início é obrigatória' }),
  endDate: z.date().optional(),
  allDay: z.boolean().default(false),
  location: z.string().optional(),
  color: z.string().optional(),
  assessmentId: z.string().optional(),
  lessonPlanId: z.string().optional(),
});

interface CalendarEventFormProps {
  onSubmit: (data: any) => void;
  initialData?: Partial<CalendarEvent>;
  subjects: Subject[];
  assessments: Assessment[];
  lessonPlans: LessonPlan[];
  isSubmitting?: boolean;
}

const CalendarEventForm: React.FC<CalendarEventFormProps> = ({
  onSubmit,
  initialData,
  subjects,
  assessments,
  lessonPlans,
  isSubmitting = false,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      type: initialData?.type as any || 'class',
      subjectId: initialData?.subjectId || '',
      startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date(),
      endDate: initialData?.endDate ? new Date(initialData.endDate) : undefined,
      allDay: initialData?.allDay || false,
      location: initialData?.location || '',
      color: initialData?.color || '',
      assessmentId: initialData?.assessmentId || '',
      lessonPlanId: initialData?.lessonPlanId || '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title || '',
        description: initialData.description || '',
        type: initialData.type as any || 'class',
        subjectId: initialData.subjectId || '',
        startDate: initialData.startDate ? new Date(initialData.startDate) : new Date(),
        endDate: initialData.endDate ? new Date(initialData.endDate) : undefined,
        allDay: initialData.allDay || false,
        location: initialData.location || '',
        color: initialData.color || '',
        assessmentId: initialData.assessmentId || '',
        lessonPlanId: initialData.lessonPlanId || '',
      });
    }
  }, [initialData, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const formattedData = {
      ...values,
      subjectId: values.subjectId || null,
      assessmentId: values.assessmentId || null,
      lessonPlanId: values.lessonPlanId || null,
    };
    onSubmit(formattedData);
  };

  const eventTypeLabels: Record<string, string> = {
    'class': 'Aula',
    'exam': 'Avaliação',
    'meeting': 'Reunião',
    'deadline': 'Prazo',
    'other': 'Outro'
  };

  // Filter assessments and lesson plans based on selected subject
  const selectedSubjectId = form.watch('subjectId');
  const selectedType = form.watch('type');
  
  const filteredAssessments = assessments.filter(assessment => 
    !selectedSubjectId || assessment.subjectId === selectedSubjectId
  );
  
  const filteredLessonPlans = lessonPlans.filter(plan => {
    const teachingPlan = plan.teachingPlanId; // This is assuming we can get the teaching plan from the lesson plan
    return !selectedSubjectId || teachingPlan === selectedSubjectId; // Simplified for this example
  });

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
                <Input {...field} disabled={isSubmitting} placeholder="Aula sobre frações" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Evento*</FormLabel>
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
                    {Object.entries(eventTypeLabels).map(([value, label]) => (
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

          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disciplina (opcional)</FormLabel>
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma disciplina (opcional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Nenhuma disciplina</SelectItem>
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
                  placeholder="Descrição detalhada do evento"
                  className="min-h-[80px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Local (opcional)</FormLabel>
              <FormControl>
                <Input {...field} disabled={isSubmitting} placeholder="Sala 101" />
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
                <FormLabel>Data e Hora de Início*</FormLabel>
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
                          format(field.value, "PPP HH:mm", { locale: ptBR })
                        ) : (
                          <span>Selecione a data e hora</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (date) {
                          const currentDate = field.value || new Date();
                          const hours = currentDate.getHours();
                          const minutes = currentDate.getMinutes();
                          date.setHours(hours);
                          date.setMinutes(minutes);
                          field.onChange(date);
                        }
                      }}
                      initialFocus
                      locale={ptBR}
                    />
                    <div className="p-3 border-t border-border">
                      <Input 
                        type="time"
                        value={field.value ? format(field.value, "HH:mm") : ""}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(':');
                          const date = field.value || new Date();
                          date.setHours(parseInt(hours, 10));
                          date.setMinutes(parseInt(minutes, 10));
                          field.onChange(date);
                        }}
                      />
                    </div>
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
                <FormLabel>Data e Hora de Término (opcional)</FormLabel>
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
                          format(field.value, "PPP HH:mm", { locale: ptBR })
                        ) : (
                          <span>Selecione a data e hora (opcional)</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (date) {
                          const currentDate = field.value || new Date();
                          const hours = currentDate.getHours();
                          const minutes = currentDate.getMinutes();
                          date.setHours(hours);
                          date.setMinutes(minutes);
                          field.onChange(date);
                        }
                      }}
                      initialFocus
                      locale={ptBR}
                    />
                    <div className="p-3 border-t border-border">
                      <Input 
                        type="time"
                        value={field.value ? format(field.value, "HH:mm") : ""}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(':');
                          const date = field.value || new Date();
                          date.setHours(parseInt(hours, 10));
                          date.setMinutes(parseInt(minutes, 10));
                          field.onChange(date);
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="allDay"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Dia inteiro</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedType === 'class' && (
          <FormField
            control={form.control}
            name="lessonPlanId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plano de Aula (opcional)</FormLabel>
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um plano de aula (opcional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Nenhum plano selecionado</SelectItem>
                    {filteredLessonPlans.map(plan => (
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
        )}

        {selectedType === 'exam' && (
          <FormField
            control={form.control}
            name="assessmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avaliação (opcional)</FormLabel>
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma avaliação (opcional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Nenhuma avaliação selecionada</SelectItem>
                    {filteredAssessments.map(assessment => (
                      <SelectItem key={assessment.id} value={assessment.id}>
                        {assessment.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  );
};

export default CalendarEventForm;
