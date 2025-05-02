
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarEvent } from '@/types';
import { eventSchema, EventFormValues, eventCategories, eventCategoryLabels } from '@/schemas/eventSchema';
import { useQuery } from '@tanstack/react-query';
import { subjectService } from '@/lib/services';
import CrudModal from '@/components/ui-components/CrudModal';
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
import { normalizeToISO } from '@/integrations/supabase/supabaseAdapter';

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id' | 'created_at'>) => Promise<void>;
  eventToEdit?: CalendarEvent | null;
}

const NewEventModal: React.FC<NewEventModalProps> = ({ isOpen, onClose, onSave, eventToEdit }) => {
  const { data: subjects = [], isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectService.getAll,
  });

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'class',
      startDate: new Date(),
      endDate: new Date(),
      allDay: true,
      color: '#3b82f6', // Default blue
      subjectId: null,
    }
  });

  // When editing an existing event, populate the form
  useEffect(() => {
    if (eventToEdit) {
      form.reset({
        title: eventToEdit.title,
        description: eventToEdit.description || '',
        type: eventToEdit.type,
        startDate: new Date(eventToEdit.startDate),
        endDate: eventToEdit.endDate ? new Date(eventToEdit.endDate) : null,
        allDay: eventToEdit.allDay,
        color: eventToEdit.color || '#3b82f6',
        subjectId: eventToEdit.subjectId || null,
      });
    } else {
      form.reset({
        title: '',
        description: '',
        type: 'class',
        startDate: new Date(),
        endDate: new Date(),
        allDay: true,
        color: '#3b82f6',
        subjectId: null,
      });
    }
  }, [eventToEdit, form]);

  const handleSubmit = async (values: EventFormValues) => {
    try {
      // Convert Date objects to ISO strings for database storage
      const eventData: Omit<CalendarEvent, 'id' | 'created_at'> = {
        title: values.title,
        description: values.description,
        type: values.type,
        startDate: normalizeToISO(values.startDate) || '',
        endDate: normalizeToISO(values.endDate) || normalizeToISO(values.startDate) || '',
        allDay: values.allDay,
        color: values.color,
        subjectId: values.subjectId || null,
      };

      await onSave(eventData);
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  return (
    <CrudModal
      title={eventToEdit ? "Editar Evento" : "Novo Evento"}
      description="Preencha os detalhes do evento"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={form.handleSubmit(handleSubmit)}
      isLoading={form.formState.isSubmitting}
    >
      <Form {...form}>
        <div className="space-y-4">
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
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma disciplina (opcional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Nenhuma</SelectItem>
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
                      value={field.value || '#3b82f6'} 
                      onChange={field.onChange} 
                    />
                    <Input 
                      value={field.value || '#3b82f6'} 
                      onChange={field.onChange} 
                      className="flex-grow"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </CrudModal>
  );
};

export default NewEventModal;
