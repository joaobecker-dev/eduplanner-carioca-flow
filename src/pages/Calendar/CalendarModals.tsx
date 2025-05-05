import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { CalendarEvent } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarEventService } from '@/lib/services';

interface CalendarEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent;
}

export const CalendarEventModal: React.FC<CalendarEventModalProps> = ({ isOpen, onClose, event }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setStartDate(new Date(event.startDate));
      setEndDate(new Date(event.endDate));
    } else {
      setTitle('');
      setDescription('');
      setStartDate(undefined);
      setEndDate(undefined);
    }
  }, [event]);

  const { mutate: createEvent, isLoading: isCreating } = useMutation(
    async (newEvent: Omit<CalendarEvent, 'id' | 'created_at'>) => {
      return calendarEventService.create(newEvent);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['calendarEvents']);
        toast({
          title: "Evento criado com sucesso!",
        });
        onClose();
      },
      onError: (error: any) => {
        toast({
          title: "Ocorreu um erro ao criar o evento.",
          description: error.message,
          variant: "destructive",
        });
      },
    }
  );

  const { mutate: updateEvent, isLoading: isUpdating } = useMutation(
    async (updatedEvent: CalendarEvent) => {
      if (!event?.id) {
        throw new Error("Event ID is missing for update.");
      }
      return calendarEventService.update(event.id, updatedEvent);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['calendarEvents']);
        toast({
          title: "Evento atualizado com sucesso!",
        });
        onClose();
      },
      onError: (error: any) => {
        toast({
          title: "Ocorreu um erro ao atualizar o evento.",
          description: error.message,
          variant: "destructive",
        });
      },
    }
  );

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Por favor, selecione as datas de início e fim.",
        variant: "destructive",
      });
      return;
    }

    const newEventData = {
      title,
      description,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      allDay: true,
      type: 'other',
      subjectId: 'a96913ff-2669-41ca-b178-190b8ca916fa',
      sourceType: 'manual',
      sourceId: '123'
    };

    if (event) {
      updateEvent({ ...event, ...newEventData });
    } else {
      createEvent(newEventData);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{event ? "Editar Evento" : "Novo Evento"}</AlertDialogTitle>
          <AlertDialogDescription>
            {event ? "Atualize os detalhes do seu evento." : "Adicione um novo evento ao calendário."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Título</Label>
            <Input
              type="text"
              id="name"
              placeholder="Nome do evento"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Detalhes do evento"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    {startDate ? format(startDate, "PPP") : <span>Escolher data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center" side="bottom">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) =>
                      date > (endDate ? endDate : new Date())
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label>Fim</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    {endDate ? format(endDate, "PPP") : <span>Escolher data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center" side="bottom">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) =>
                      date < (startDate ? startDate : new Date())
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={isCreating || isUpdating}>
            {isCreating || isUpdating ? 'Salvando...' : 'Salvar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
