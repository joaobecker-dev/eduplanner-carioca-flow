
import React, { createContext, useContext } from 'react';

interface CalendarThemeContextProps {
  eventColors: {
    class: string;
    exam: string;
    meeting: string;
    other: string;
    deadline: string;
  };
  getEventColor: (type: string) => string;
}

const CalendarThemeContext = createContext<CalendarThemeContextProps>({
  eventColors: {
    class: '#9b87f5',    // Purple
    exam: '#e67c73',     // Red
    meeting: '#33b679',  // Green
    other: '#8e9196',    // Gray
    deadline: '#f6bf26'  // Yellow
  },
  getEventColor: () => '#8e9196' // Default to gray
});

export const CalendarThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const eventColors = {
    class: '#9b87f5',    // Purple
    exam: '#e67c73',     // Red
    meeting: '#33b679',  // Green
    other: '#8e9196',    // Gray
    deadline: '#f6bf26'  // Yellow
  };

  const getEventColor = (type: string): string => {
    return eventColors[type as keyof typeof eventColors] || eventColors.other;
  };

  const themeValue = {
    eventColors,
    getEventColor
  };

  return (
    <CalendarThemeContext.Provider value={themeValue}>
      {children}
    </CalendarThemeContext.Provider>
  );
};

export const useCalendarTheme = () => useContext(CalendarThemeContext);

export default CalendarThemeProvider;
