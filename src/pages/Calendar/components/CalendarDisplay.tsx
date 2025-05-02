
import React from 'react';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBRLocale from '@fullcalendar/core/locales/pt-br';
import { Card, CardContent } from '@/components/ui/card';
import { useCalendarTheme } from './CalendarThemeProvider';

interface CalendarDisplayProps {
  calendarEvents: any[];
  handleEventClick: (info: EventClickArg) => void;
  handleDateSelect: (arg: DateSelectArg) => void;
  isLoading: boolean;
}

const CalendarDisplay: React.FC<CalendarDisplayProps> = ({
  calendarEvents,
  handleEventClick,
  handleDateSelect,
  isLoading
}) => {
  const { getEventColor } = useCalendarTheme();

  // Function to customize event rendering
  const eventContent = (eventInfo: any) => {
    const eventType = eventInfo.event.extendedProps.type || 'other';
    const customColor = eventInfo.event.backgroundColor || getEventColor(eventType);
    
    return (
      <div className="w-full overflow-hidden" style={{ 
        backgroundColor: `${customColor}20`,
        color: customColor,
        borderLeft: `3px solid ${customColor}`
      }}>
        <div className="px-1 py-1 truncate">
          {eventInfo.timeText && <span className="font-medium mr-1">{eventInfo.timeText}</span>}
          <span className="font-medium">{eventInfo.event.title}</span>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {isLoading ? (
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
              eventContent={eventContent}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarDisplay;
