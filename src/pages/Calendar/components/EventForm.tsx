
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EventFormValues, eventSchema, eventFormDefaults } from '@/schemas/eventSchema';
import { useQuery } from '@tanstack/react-query';
import { subjectService } from '@/lib/services';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useCalendarTheme } from './CalendarThemeProvider';
import { eventCategoryLabels, eventCategories } from '@/schemas/eventSchema';
import { CalendarEvent } from '@/types';

interface EventFormProps {
  onSubmit: (values: EventFormValues) => Promise<void>;
  eventToEdit?: CalendarEvent | null;
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit, eventToEdit }) => {
  const { data: subjects = [], isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectService.getAll,
  });
  
  const { eventColors } = useCalendarTheme();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: eventFormDefaults
  });

  // When editing an existing event, populate the form
  React.useEffect(() => {
    if (eventToEdit) {
      form.reset({
        title: eventToEdit.title,
        description: eventToEdit.description || '',
        type: eventToEdit.type as any,
        startDate: new Date(eventToEdit.startDate),
        endDate: eventToEdit.endDate ? new Date(eventToEdit.endDate) : null,
        allDay: eventToEdit.allDay,
        color: eventToEdit.color || eventColors[eventToEdit.type] || eventColors.other,
        subjectId: eventToEdit.subjectId || null,
      });
    } else {
      form.reset(eventFormDefaults);
    }
  }, [eventToEdit, form, eventColors]);

  const handleFormSubmit = async (values: EventFormValues) => {
    await onSubmit(values);
  };

  // Update color when type changes
  const watchType = form.watch('type');
  React.useEffect(() => {
    const newColor = eventColors[watchType as keyof typeof eventColors] || eventColors.other;
    form.setValue('color', newColor);
  }, [watchType, form, eventColors]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título do evento" {...field} />
              </FormControl>
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
                <Textarea placeholder="Descrição do evento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select
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
                  {eventCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {eventCategoryLabels[category]}
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
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de início</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="w-full pl-3 text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
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
                <FormLabel>Data de término</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="w-full pl-3 text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={(date) => {
                        const start = form.getValues("startDate");
                        return start ? date < start : false;
                      }}
                      className={cn("p-3 pointer-events-auto")}
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
          name="allDay"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Dia inteiro</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disciplina</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || "none"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma disciplina (opcional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name} - {subject.grade}
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
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <input 
                    type="color" 
                    className="w-10 h-10 rounded cursor-pointer" 
                    value={field.value || eventColors.class} 
                    onChange={field.onChange} 
                  />
                  <Input 
                    value={field.value || eventColors.class} 
                    onChange={field.onChange} 
                    className="flex-grow"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {eventToEdit ? "Atualizar Evento" : "Criar Evento"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;
