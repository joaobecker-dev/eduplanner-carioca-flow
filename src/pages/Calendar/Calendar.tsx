
import React from 'react';
import CalendarView from './CalendarView';
import { CalendarThemeProvider } from './components/CalendarThemeProvider';

const Calendar: React.FC = () => {
  return (
    <CalendarThemeProvider>
      <CalendarView />
    </CalendarThemeProvider>
  );
};

export default Calendar;
