
import React, { createContext, useContext } from 'react';

interface CalendarThemeContextProps {
  eventColors: {
    class: string;
    exam: string;
    meeting: string;
    other: string;
    deadline: string;
  };
}

const CalendarThemeContext = createContext<CalendarThemeContextProps>({
  eventColors: {
    class: '#9b87f5',    // Purple
    exam: '#e67c73',     // Red
    meeting: '#33b679',  // Green
    other: '#8e9196',    // Gray
    deadline: '#f6bf26'  // Yellow
  }
});

export const CalendarThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const themeValue = {
    eventColors: {
      class: '#9b87f5',    // Purple
      exam: '#e67c73',     // Red
      meeting: '#33b679',  // Green
      other: '#8e9196',    // Gray
      deadline: '#f6bf26'  // Yellow
    }
  };

  return (
    <CalendarThemeContext.Provider value={themeValue}>
      {children}
    </CalendarThemeContext.Provider>
  );
};

export const useCalendarTheme = () => useContext(CalendarThemeContext);

export default CalendarThemeProvider;
