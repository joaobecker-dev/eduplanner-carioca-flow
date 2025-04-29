
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, ListFilter } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import SectionHeader from '@/components/ui-components/SectionHeader';
import { CalendarEvent, Subject } from '@/types';
import { services } from '@/lib/services';

const CalendarPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get the date range for the current month view
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        
        // Extend the range to include the full weeks at the start and end
        const rangeStart = startOfWeek(monthStart, { weekStartsOn: 0 });
        const rangeEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
        
        const [eventsData, subjectsData] = await Promise.all([
          services.calendarEvent.getByDateRange(
            rangeStart.toISOString(),
            rangeEnd.toISOString()
          ),
          services.subject.getAll()
        ]);
        
        setEvents(eventsData);
        setFilteredEvents(eventsData);
        setSubjects(subjectsData);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentDate]);

  // Apply filters
  useEffect(() => {
    let filtered = [...events];
    
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(event => event.subjectId === selectedSubject);
    }
    
    if (selectedEventType !== 'all') {
      filtered = filtered.filter(event => event.type === selectedEventType);
    }
    
    setFilteredEvents(filtered);
  }, [events, selectedSubject, selectedEventType]);

  const getSubjectName = (id?: string): string => {
    if (!id) return '';
    const subject = subjects.find(s => s.id === id);
    return subject ? subject.name : '';
  };

  const getEventTypeLabel = (type: string): string => {
    switch (type) {
      case 'class':
        return 'Aula';
      case 'exam':
        return 'Avaliação';
      case 'meeting':
        return 'Reunião';
      case 'deadline':
        return 'Prazo';
      default:
        return 'Outro';
    }
  };
  
  const getEventColor = (event: CalendarEvent): string => {
    if (event.color) return event.color;
    
    switch (event.type) {
      case 'class':
        return 'bg-edu-blue-100 text-edu-blue-800';
      case 'exam':
        return 'bg-edu-orange-100 text-edu-orange-800';
      case 'meeting':
        return 'bg-purple-100 text-purple-800';
      case 'deadline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());
  
  // Function to handle event creation
  const handleCreateEvent = () => {
    console.log('Creating new event');
    // navigate('/calendario/novo');
  };
  
  // Generate the days for the month view
  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
    
    const rows = [];
    let days = [];
    let day = startDate;
    
    // Header row with days of the week
    const daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
      daysOfWeek.push(
        <div key={`header-${i}`} className="font-semibold text-center py-2">
          {format(addDays(startDate, i), 'EEEEEE', { locale: ptBR }).toUpperCase()}
        </div>
      );
    }
    rows.push(<div key="header" className="grid grid-cols-7">{daysOfWeek}</div>);
    
    // Calendar days
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());
        
        // Get events for this day
        const dayEvents = filteredEvents.filter(event => {
          const eventDate = parseISO(event.startDate);
          return isSameDay(eventDate, currentDay);
        });
        
        days.push(
          <div 
            key={day.toString()} 
            className={`min-h-28 p-1 border border-gray-100 ${
              isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
            } ${isToday ? 'border-edu-blue-300 border-2' : ''}`}
          >
            <div className={`text-right p-1 ${isToday ? 'font-bold text-edu-blue-700' : ''}`}>
              {format(day, 'd')}
            </div>
            <div className="mt-1 space-y-1">
              {dayEvents.slice(0, 3).map(event => (
                <div 
                  key={event.id}
                  className={`px-2 py-1 rounded text-xs cursor-pointer truncate ${getEventColor(event)}`}
                >
                  {event.allDay ? '• ' : `${format(parseISO(event.startDate), 'HH:mm')} `}
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 3 && (
                <div className="text-xs text-center text-edu-gray-500">
                  + {dayEvents.length - 3} mais
                </div>
              )}
            </div>
          </div>
        );
        
        day = addDays(day, 1);
      }
      
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    
    return rows;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <SectionHeader
        title="Calendário"
        description="Visualize e organize seus eventos acadêmicos"
        icon={CalendarIcon}
        actionLabel="Novo Evento"
        onAction={handleCreateEvent}
      />
      
      {/* Calendar header with navigation and filters */}
      <div className="flex flex-col md:flex-row gap-3 justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h2 className="text-xl font-semibold px-2">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" onClick={goToToday} className="ml-2">
            Hoje
          </Button>
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <ListFilter size={16} />
                {selectedEventType === 'all' ? 'Todos os Tipos' : getEventTypeLabel(selectedEventType)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filtrar por Tipo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={selectedEventType} onValueChange={setSelectedEventType}>
                <DropdownMenuRadioItem value="all">Todos os Tipos</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="class">Aulas</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="exam">Avaliações</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="meeting">Reuniões</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="deadline">Prazos</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="other">Outros</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <ListFilter size={16} />
                {selectedSubject === 'all' ? 'Todas as Disciplinas' : getSubjectName(selectedSubject)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filtrar por Disciplina</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={selectedSubject} onValueChange={setSelectedSubject}>
                <DropdownMenuRadioItem value="all">Todas as Disciplinas</DropdownMenuRadioItem>
                {subjects.map((subject) => (
                  <DropdownMenuRadioItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Calendar component */}
      <Card>
        <CardContent className="p-1">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="grid grid-cols-7 gap-1">
                {Array(7).fill(0).map((_, i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-7 gap-1">
                {Array(35).fill(0).map((_, i) => (
                  <div key={i} className="h-24 bg-gray-100 rounded"></div>
                ))}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">{renderCalendarDays()}</div>
          )}
        </CardContent>
      </Card>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Badge className="bg-edu-blue-100 text-edu-blue-800">Aulas</Badge>
        <Badge className="bg-edu-orange-100 text-edu-orange-800">Avaliações</Badge>
        <Badge className="bg-purple-100 text-purple-800">Reuniões</Badge>
        <Badge className="bg-red-100 text-red-800">Prazos</Badge>
        <Badge className="bg-gray-100 text-gray-800">Outros</Badge>
      </div>
      
      {/* Upcoming events sidebar - for larger screens */}
      <div className="mt-4 hidden lg:block">
        <h3 className="text-lg font-semibold mb-3">Próximos Eventos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.slice(0, 6).map(event => {
            const eventDate = parseISO(event.startDate);
            const isToday = isSameDay(eventDate, new Date());
            
            return (
              <Card key={event.id} className="card-hover">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="bg-edu-blue-50 text-edu-blue-700 p-2 rounded-md text-center min-w-14">
                      <div className="text-xs font-medium">
                        {isToday ? 'HOJE' : format(eventDate, 'EEE', { locale: ptBR }).toUpperCase()}
                      </div>
                      <div className="text-lg font-bold">{format(eventDate, 'd')}</div>
                    </div>
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-edu-gray-500 mt-1">
                        <span>{event.allDay ? 'Dia todo' : format(eventDate, 'HH:mm')}</span>
                        <Badge className={`${getEventColor(event)} text-xs`}>
                          {getEventTypeLabel(event.type)}
                        </Badge>
                      </div>
                      {event.subjectId && (
                        <div className="text-xs text-edu-gray-600 mt-1">
                          {getSubjectName(event.subjectId)}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
