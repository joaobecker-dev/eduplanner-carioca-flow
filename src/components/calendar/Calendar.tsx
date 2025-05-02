
import React, { useState, useCallback, useEffect } from 'react';
import { Calendar as FullCalendar, Views, dateFnsLocalizer } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarEvent } from '@/types';
import NewEventModal from '@/components/modals/NewEventModal';
import { mapTypeToCategory } from '@/schemas/eventSchema';

// Setup the localizer for fullcalendar
const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Custom labels for Portuguese
const messages = {
  today: 'Hoje',
  previous: 'Anterior',
  next: 'Próximo',
  month: 'Mês',
  week: 'Semana',
  day: 'Dia',
  agenda: 'Agenda',
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'Não há eventos neste período',
};

interface CalendarProps {
  events: CalendarEvent[];
  isLoading?: boolean;
}

interface CalendarViewEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any;
  color?: string;
}

interface SlotInfo {
  action: 'select' | 'click';
  slots: Date[];
  start: Date;
  end: Date;
  resourceId?: string;
}

const Calendar: React.FC<CalendarProps> = ({ events, isLoading }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<CalendarViewEvent[]>([]);

  // Map Supabase events to Calendar view format
  useEffect(() => {
    if (events && events.length > 0) {
      const mappedEvents = events.map(event => ({
        id: event.id,
        title: event.title,
        start: new Date(event.startDate || event.start_date),
        end: event.endDate || event.end_date ? new Date(event.endDate || event.end_date) : new Date(event.startDate || event.start_date),
        allDay: event.all_day,
        color: event.color,
        resource: {
          type: event.type,
          description: event.description,
          category: event.type ? mapTypeToCategory(event.type) : "Outro",
          originalEvent: event // Store the original event data
        }
      }));

      setCalendarEvents(mappedEvents);
    } else {
      setCalendarEvents([]);
    }
  }, [events]);

  // Handle slot selection
  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    setSelectedSlot(slotInfo);
    setSelectedEvent(null);
    setModalOpen(true);
  }, []);

  // Handle event selection
  const handleSelectEvent = useCallback((event: CalendarViewEvent) => {
    // Get the original event data
    const originalEvent = event.resource?.originalEvent;
    if (originalEvent) {
      setSelectedEvent(originalEvent);
      setSelectedSlot(null);
      setModalOpen(true);
    }
  }, []);

  // Event style customization
  const eventStyleGetter = (event: CalendarViewEvent) => {
    const style = {
      backgroundColor: event.color || getEventColor(event.resource?.type),
      borderRadius: '4px',
      opacity: 0.8,
      color: '#fff',
      border: '0px',
      display: 'block',
    };
    return { style };
  };

  // Get default colors based on event type
  const getEventColor = (type?: string): string => {
    switch (type) {
      case 'class':
        return '#3174ad'; // blue
      case 'exam':
        return '#e67c73'; // red
      case 'meeting':
        return '#33b679'; // green
      default:
        return '#9e69af'; // purple
    }
  };

  return (
    <div className="h-full flex flex-col">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <p>Carregando eventos...</p>
        </div>
      ) : (
        <div className="flex-1">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={calendarEvents}
            selectable={true}
            select={handleSelectSlot}
            eventClick={({ event }) => handleSelectEvent(event as any)}
            eventColor="#3788d8"
            locales={[ptBR]}
            locale="pt-BR"
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false,
              hour12: false
            }}
            buttonText={{
              today: 'Hoje',
              month: 'Mês',
              week: 'Semana',
              day: 'Dia'
            }}
          />
        </div>
      )}

      {modalOpen && (
        <NewEventModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          defaultStartDate={selectedSlot?.start}
          defaultEndDate={selectedSlot?.end}
          defaultAllDay={selectedSlot?.start?.getHours() === 0 && selectedSlot?.end?.getHours() === 0}
          editEvent={selectedEvent}
          mode={selectedEvent ? 'edit' : 'create'}
        />
      )}
    </div>
  );
};

export default Calendar;
