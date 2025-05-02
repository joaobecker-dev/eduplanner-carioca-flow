
import React from 'react';
import { CalendarThemeProvider } from './components/CalendarThemeProvider';
import CalendarPage from './Calendar';

const CalendarPageWrapper: React.FC = () => {
  return (
    <CalendarThemeProvider>
      <CalendarPage />
    </CalendarThemeProvider>
  );
};

export default CalendarPageWrapper;
