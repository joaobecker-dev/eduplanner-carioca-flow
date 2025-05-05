import React, { useState } from 'react';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { useCalendarEvents } from './hooks/useCalendarEvents';
import { EventForm } from './CalendarForm';
import { EventDetail } from './CalendarDetail';

const eventTypeOptions = [
  { label: 'Aula', value: 'class' },
  { label: 'Prova', value: 'exam' },
  { label: 'Reunião', value: 'meeting' },
  { label: 'Outro', value: 'other' },
  { label: 'Entrega', value: 'deadline' }
];

const CalendarView: React.FC = () => {
  const { subjects, eventsLoading, calendarEvents, filters } = useCalendarEvents();
  const { selectedSubjectId, setSelectedSubjectId, selectedEventTypes, handleCheckboxChange, dateRange, setDateRange } = filters;
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);

  const handleEventClick = (info: any) => {
    setSelectedEvent(calendarEvents.find(event => event.id === info.event.id));
  };

  const handleCloseEventDetail = () => {
    setSelectedEvent(null);
  };

  const handleOpenEventForm = () => {
    setIsEventFormOpen(true);
  };

  const handleCloseEventForm = () => {
    setIsEventFormOpen(false);
  };

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    if (range.from && range.to) {
      setDateRange({ from: range.from, to: range.to });
    }
  };

  const resetDateRange = () => {
    setDateRange({ from: null, to: null });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold tracking-tight mb-4">Calendário</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filters */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subject Filter */}
              <div>
                <Label htmlFor="subject">Disciplina</Label>
                <select
                  id="subject"
                  className="w-full rounded-md border appearance-none px-3 py-2 focus:outline-none focus:ring-2 focus:ring-edu-blue-500"
                  value={selectedSubjectId || ''}
                  onChange={(e) => setSelectedSubjectId(e.target.value === '' ? null : e.target.value)}
                >
                  <option value="">Todas as Disciplinas</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.title}</option>
                  ))}
                </select>
              </div>

              {/* Event Type Filters */}
              <div>
                <Label>Tipo de Evento</Label>
                <div className="space-y-2">
                  {eventTypeOptions.map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.value}
                        checked={selectedEventTypes[option.value]}
                        onCheckedChange={() => handleCheckboxChange(option.value)}
                      />
                      <Label htmlFor={option.value} className="capitalize">{option.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <Label>Período</Label>
                <div className="flex items-center space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[200px] justify-start text-left font-normal",
                          !dateRange?.from || !dateRange?.to ? "text-muted-foreground" : undefined
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from && dateRange?.to ? (
                          format(dateRange.from, "dd/MM/yyyy") + " - " + format(dateRange.to, "dd/MM/yyyy")
                        ) : (
                          <span>Selecione um período</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                      <CalendarUI
                        mode="range"
                        defaultMonth={dateRange?.from ? dateRange.from : new Date()}
                        selected={dateRange}
                        onSelect={handleDateRangeChange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  {dateRange?.from && dateRange?.to && (
                    <Button variant="ghost" size="icon" onClick={resetDateRange}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <div className="md:col-span-3">
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
            loading={eventsLoading}
            height="700px"
            locale="pt-br"
            editable={true}
            selectable={true}
            eventColor="#3730a3"
          />
          <Button onClick={handleOpenEventForm}>Adicionar Evento</Button>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetail event={selectedEvent} onClose={handleCloseEventDetail} />
      )}

      {/* Event Form Modal */}
      <EventForm isOpen={isEventFormOpen} onClose={handleCloseEventForm} />
    </div>
  );
};

export default CalendarView;
