
import React, { createContext, useContext, useState, ReactNode } from 'react';

type EventColors = {
  class: string;
  exam: string;
  meeting: string;
  other: string;
};

type CalendarTheme = {
  eventColors: EventColors;
  getEventColor: (type: keyof EventColors) => string;
  getBgTextClasses: (type: keyof EventColors | string, customColor?: string) => string;
};

const defaultEventColors: EventColors = {
  class: '#3B82F6',    // blue
  exam: '#F97316',     // orange 
  meeting: '#8B5CF6',  // purple
  other: '#6B7280'     // gray
};

const CalendarThemeContext = createContext<CalendarTheme>({
  eventColors: defaultEventColors,
  getEventColor: () => defaultEventColors.other,
  getBgTextClasses: () => 'bg-gray-100 text-gray-800'
});

export const useCalendarTheme = () => useContext(CalendarThemeContext);

interface CalendarThemeProviderProps {
  children: ReactNode;
}

export const CalendarThemeProvider: React.FC<CalendarThemeProviderProps> = ({ children }) => {
  const [eventColors] = useState<EventColors>(defaultEventColors);
  
  const getEventColor = (type: keyof EventColors): string => {
    return eventColors[type] || eventColors.other;
  };
  
  // Returns appropriate background/text color classes based on event type
  const getBgTextClasses = (type: keyof EventColors | string, customColor?: string): string => {
    if (customColor) {
      return `bg-opacity-15 text-opacity-90 border-l-4` +
        ` style="background-color: ${customColor}20; color: ${customColor}; border-color: ${customColor}"`;
    }
    
    switch(type) {
      case 'class':
        return 'bg-edu-blue-100 text-edu-blue-800';
      case 'exam':
        return 'bg-edu-orange-100 text-edu-orange-800';
      case 'meeting':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <CalendarThemeContext.Provider
      value={{
        eventColors,
        getEventColor,
        getBgTextClasses
      }}
    >
      {children}
    </CalendarThemeContext.Provider>
  );
};
