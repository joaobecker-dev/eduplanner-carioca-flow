
import React from 'react';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBRLocale from '@fullcalendar/core/locales/pt-br';
import { Card, CardContent } from '@/components/ui/card';

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
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarDisplay;
