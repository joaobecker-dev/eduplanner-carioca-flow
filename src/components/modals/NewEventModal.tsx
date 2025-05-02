
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQueryClient } from '@tanstack/react-query';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/hooks/use-toast';
import { eventSchema, eventCategoryOptions, mapCategoryToType, type EventFormValues } from '@/schemas/eventSchema';
import { calendarEventService } from '@/lib/services/calendarEventService';
import { CalendarEvent } from '@/types';

interface NewEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultStartDate?: Date;
  defaultEndDate?: Date;
  defaultAllDay?: boolean;
  editEvent?: CalendarEvent | null;
  mode?: 'create' | 'edit';
}

const NewEventModal: React.FC<NewEventModalProps> = ({
  open,
  onOpenChange,
  defaultStartDate,
  defaultEndDate,
  defaultAllDay = false,
  editEvent = null,
  mode = 'create'
}) => {
  const queryClient = useQueryClient();
  const isEditMode = mode === 'edit' && editEvent;

  // Prepare default values
  const defaultValues: EventFormValues = isEditMode 
    ? {
        title: editEvent.title,
        description: editEvent.description || '',
        start_date: new Date(editEvent.startDate || editEvent.start_date),
        end_date: editEvent.endDate || editEvent.end_date ? new Date(editEvent.endDate || editEvent.end_date) : null,
        category: editEvent.type ? mapTypeToCategory(editEvent.type) : 'Aula',
        color: editEvent.color || '',
        all_day: editEvent.allDay || editEvent.all_day || false,
      }
    : {
        title: '',
        description: '',
        start_date: defaultStartDate || new Date(),
        end_date: defaultEndDate || null,
        category: 'Aula',
        color: '',
        all_day: defaultAllDay,
      };

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues,
  });

  const { status, handleSubmit } = form;
  const isSubmitting = status === 'submitting';

  const onSubmit = async (data: EventFormValues) => {
    try {
      // Map the category to type
      const eventType = mapCategoryToType(data.category);
      
      // Prepare the data for submission
      const eventData = {
        title: data.title,
        description: data.description || null,
        start_date: data.start_date.toISOString(),
        end_date: data.end_date ? data.end_date.toISOString() : data.start_date.toISOString(),
        all_day: data.all_day,
        color: data.color || null,
        type: eventType,
        subject_id: data.subject_id || null,
      };

      let result;
      if (isEditMode && editEvent) {
        // Update existing event
        result = await calendarEventService.updateEvent(editEvent.id, eventData);
        if (result) {
          toast({
            title: 'Evento atualizado',
            description: 'O evento foi atualizado com sucesso.',
          });
        }
      } else {
        // Create new event
        result = await calendarEventService.createEvent(eventData);
        if (result) {
          toast({
            title: 'Evento criado',
            description: 'O evento foi adicionado ao calendário com sucesso.',
          });
        }
      }
      
      if (result) {
        // Invalidate queries to refresh calendar
        queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
        
        // Close modal
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error with event:', error);
      toast({
        title: isEditMode ? 'Erro ao atualizar evento' : 'Erro ao criar evento',
        description: 'Ocorreu um erro ao processar o evento no calendário.',
        variant: 'destructive',
      });
    }
  };

  const modalTitle = isEditMode ? 'Editar Evento' : 'Novo Evento';
  const submitButtonText = isEditMode ? (isSubmitting ? "Salvando..." : "Salvar Alterações") : (isSubmitting ? "Criando..." : "Criar Evento");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    <Textarea placeholder="Descrição do evento (opcional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Início</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
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
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Término</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Igual à data de início</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
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
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {eventCategoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
                    <FormLabel>Cor (opcional)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          {...field}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          placeholder="#RRGGBB"
                          {...field}
                          className="flex-1"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="all_day"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Dia inteiro</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {submitButtonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewEventModal;
