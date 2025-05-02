
import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarEvent, Subject } from '@/types';
import { calendarEventService, subjectService } from '@/lib/services';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import ptBRLocale from '@fullcalendar/core/locales/pt-br';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import SectionHeader from '@/components/ui-components/SectionHeader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { formatDisplayDate } from '@/integrations/supabase/supabaseAdapter';
import NewEventModal from './NewEventModal';
import { toast } from 'sonner';

const CalendarView: React.FC = () => {
  // State for filtering
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedEventTypes, setSelectedEventTypes] = useState<Record<string, boolean>>({
    'exam': true,
    'class': true,
  });
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined,
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined
  });
  
  // State for event details modal
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  
  // State for new/edit event modal
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);
  
  // Query client for data fetching and cache updates
  const { data: events = [], isLoading: eventsLoading, refetch: refetchEvents } = useQuery({
    queryKey: ['calendarEvents'],
    queryFn: calendarEventService.getAll,
  });

  // Fetch subjects for the filter
  const { data: subjects = [], isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectService.getAll,
  });

  // Filter events based on selected filters - use useMemo to prevent unnecessary rerenders
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Filter by subject
      if (selectedSubjectId && event.subjectId !== selectedSubjectId) {
        return false;
      }

      // Filter by event type
      if (!selectedEventTypes[event.type]) {
        return false;
      }

      // Filter by date range
      if (dateRange.from && new Date(event.startDate) < dateRange.from) {
        return false;
      }
      if (dateRange.to && new Date(event.startDate) > dateRange.to) {
        return false;
      }

      return true;
    });
  }, [events, selectedSubjectId, selectedEventTypes, dateRange]);

  // Convert events to FullCalendar format - use useMemo to optimize
  const calendarEvents = useMemo(() => {
    return filteredEvents.map(event => ({
      id: event.id,
      title: event.title,
      start: event.startDate,
      end: event.endDate || event.startDate,
      allDay: event.allDay,
      extendedProps: { ...event },
      backgroundColor: event.color || getEventColor(event.type),
      borderColor: event.color || getEventColor(event.type),
    }));
  }, [filteredEvents]);

  // Get color based on event type
  function getEventColor(type: string): string {
    switch (type) {
      case 'exam':
        return 'rgba(220, 38, 38, 0.8)'; // Red for exams
      case 'class':
        return 'rgba(59, 130, 246, 0.8)'; // Blue for classes/teaching plans
      case 'meeting':
        return 'rgba(139, 92, 246, 0.8)'; // Purple for meetings
      default:
        return 'rgba(156, 163, 175, 0.8)'; // Gray for other events
    }
  }

  // Handle event click
  const handleEventClick = (info: EventClickArg) => {
    const event = events.find(e => e.id === info.event.id);
    if (event) {
      setSelectedEvent(event);
      setShowEventModal(true);
    }
  };

  // Handle date select for creating new events
  const handleDateSelect = (arg: DateSelectArg) => {
    // Create a new event with default values
    setEventToEdit(null);
    setShowNewEventModal(true);
    
    // Set form default values based on selected date range
    const form = document.querySelector('form');
    if (form) {
      const startDateInput = form.querySelector('[name="startDate"]');
      const endDateInput = form.querySelector('[name="endDate"]');
      
      if (startDateInput) {
        (startDateInput as HTMLInputElement).value = arg.start.toISOString();
      }
      if (endDateInput && arg.end) {
        (endDateInput as HTMLInputElement).value = arg.end.toISOString();
      }
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (type: string) => {
    setSelectedEventTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Generate event type label with better type safety
  const getEventTypeLabel = (type: string): string => {
    const typeLabels: Record<string, string> = {
      'exam': 'Avaliação',
      'class': 'Aula/Plano',
      'meeting': 'Reunião',
      'deadline': 'Prazo',
      'other': 'Outro'
    };
    
    return typeLabels[type] || type;
  };

  // Handle edit button click in event details modal
  const handleEditEvent = () => {
    setEventToEdit(selectedEvent);
    setShowEventModal(false);
    setShowNewEventModal(true);
  };

  // Handle saving a new or edited event
  const handleSaveEvent = async (eventData: Omit<CalendarEvent, 'id' | 'created_at'>) => {
    try {
      if (eventToEdit) {
        // Update existing event
        await calendarEventService.update(eventToEdit.id, eventData);
        toast.success('Evento atualizado com sucesso!');
      } else {
        // Create new event
        await calendarEventService.create(eventData);
        toast.success('Evento criado com sucesso!');
      }
      
      // Refresh calendar events
      refetchEvents();
      
      // Close the modal
      setShowNewEventModal(false);
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Erro ao salvar evento. Tente novamente.');
    }
  };

  // Handle deleting an event
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    try {
      await calendarEventService.delete(selectedEvent.id);
      toast.success('Evento excluído com sucesso!');
      refetchEvents();
      setShowEventModal(false);
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Erro ao excluir evento. Tente novamente.');
    }
  };

  // Find related subject with proper type checking
  const getRelatedSubject = (subjectId?: string): Subject | undefined => {
    if (!subjectId) return undefined;
    return subjects.find(s => s.id === subjectId);
  };

  return (
    <div className="container mx-auto px-4">
      <SectionHeader
        title="Calendário Acadêmico"
        description="Visualize e filtre eventos, aulas e avaliações"
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            {/* Subject filter */}
            <div className="w-full md:w-1/3">
              <Label htmlFor="subject-filter">Disciplina</Label>
              <Select
                value={selectedSubjectId || ''}
                onValueChange={(value) => setSelectedSubjectId(value || null)}
              >
                <SelectTrigger id="subject-filter" className="w-full">
                  <SelectValue placeholder="Todas as disciplinas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as disciplinas</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name} - {subject.grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Event type filters */}
            <div className="w-full md:w-1/3 space-y-2">
              <Label>Tipos de Evento</Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="exam-filter"
                    checked={selectedEventTypes['exam']}
                    onCheckedChange={() => handleCheckboxChange('exam')}
                  />
                  <label 
                    htmlFor="exam-filter"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Avaliações
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="class-filter"
                    checked={selectedEventTypes['class']}
                    onCheckedChange={() => handleCheckboxChange('class')}
                  />
                  <label 
                    htmlFor="class-filter"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Aulas/Planos
                  </label>
                </div>
              </div>
            </div>

            {/* Date range filter */}
            <div className="w-full md:w-1/3">
              <Label className="mb-2 block">Período</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                          {format(dateRange.to, "dd/MM/yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy")
                      )
                    ) : (
                      <span>Selecione o período</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={new Date()}
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => setDateRange({
                      from: range?.from,
                      to: range?.to
                    })}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardContent className="pt-6">
          {eventsLoading ? (
            <div className="flex justify-center items-center h-[600px]">
              <p>Carregando calendário...</p>
            </div>
          ) : (
            <div className="h-[600px]">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={calendarEvents}
                eventClick={handleEventClick}
                selectable={true}
                select={handleDateSelect}
                locale={ptBRLocale}
                height="100%"
                allDayText="Dia todo"
                buttonText={{
                  today: 'Hoje',
                  month: 'Mês',
                  week: 'Semana',
                  day: 'Dia'
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Details Modal */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{getEventTypeLabel(selectedEvent.type)}</Badge>
                  {selectedEvent.subjectId && getRelatedSubject(selectedEvent.subjectId) && (
                    <Badge>{getRelatedSubject(selectedEvent.subjectId)?.name}</Badge>
                  )}
                </div>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                {/* Event date with better error handling */}
                <div>
                  <span className="font-medium">Data:</span>
                  <p>
                    {formatDisplayDate(selectedEvent.startDate)}
                    {selectedEvent.endDate && selectedEvent.startDate !== selectedEvent.endDate && 
                      ` até ${formatDisplayDate(selectedEvent.endDate)}`
                    }
                  </p>
                </div>

                {/* Description */}
                {selectedEvent.description && (
                  <div>
                    <span className="font-medium">Descrição:</span>
                    <p>{selectedEvent.description}</p>
                  </div>
                )}

                {/* References */}
                <div className="space-y-2">
                  {selectedEvent.assessmentId && (
                    <p>
                      <Button variant="link" className="p-0 h-auto" asChild>
                        <a href={`/avaliacoes?id=${selectedEvent.assessmentId}`}>Ver detalhes da avaliação</a>
                      </Button>
                    </p>
                  )}
                  {selectedEvent.lessonPlanId && (
                    <p>
                      <Button variant="link" className="p-0 h-auto" asChild>
                        <a href={`/planejamento?lesson=${selectedEvent.lessonPlanId}`}>Ver plano de aula</a>
                      </Button>
                    </p>
                  )}
                  {selectedEvent.teachingPlanId && (
                    <p>
                      <Button variant="link" className="p-0 h-auto" asChild>
                        <a href={`/planejamento?teaching=${selectedEvent.teachingPlanId}`}>Ver plano de ensino</a>
                      </Button>
                    </p>
                  )}
                </div>
                
                {/* Action buttons */}
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowEventModal(false)}
                  >
                    Fechar
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteEvent}
                  >
                    Excluir
                  </Button>
                  <Button 
                    onClick={handleEditEvent}
                  >
                    Editar
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* New/Edit Event Modal */}
      <NewEventModal 
        isOpen={showNewEventModal}
        onClose={() => setShowNewEventModal(false)}
        onSave={handleSaveEvent}
        eventToEdit={eventToEdit}
      />
    </div>
  );
};

export default CalendarView;
