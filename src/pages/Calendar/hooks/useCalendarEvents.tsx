
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarEvent, Subject } from '@/types';
import { calendarEventService, subjectService } from '@/lib/services';
import { getEventColor } from '../utils/eventUtils';

export interface CalendarFiltersState {
  selectedSubjectId: string | null;
  selectedEventTypes: Record<string, boolean>;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

export const useCalendarEvents = () => {
  // State for filtering
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedEventTypes, setSelectedEventTypes] = useState<Record<string, boolean>>({
    'exam': true,
    'class': true,
  });
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined
  });

  // Query client for data fetching
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['calendarEvents'],
    queryFn: calendarEventService.getAll,
  });

  // Fetch subjects for the filter
  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectService.getAll,
  });

  // Filter events based on selected filters
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Filter by subject
      if (selectedSubjectId && event.subjectId !== selectedSubjectId) {
        return false;
      }

      // Filter by event type
      if (!selectedEventTypes[event.type]) {
        return false;
      }

      // Filter by date range
      if (dateRange.from && new Date(event.startDate) < dateRange.from) {
        return false;
      }
      if (dateRange.to && new Date(event.startDate) > dateRange.to) {
        return false;
      }

      return true;
    });
  }, [events, selectedSubjectId, selectedEventTypes, dateRange]);

  // Convert events to FullCalendar format
  const calendarEvents = useMemo(() => {
    return filteredEvents.map(event => ({
      id: event.id,
      title: event.title,
      start: event.startDate,
      end: event.endDate || event.startDate,
      allDay: event.allDay,
      extendedProps: { ...event },
      backgroundColor: event.color || getEventColor(event.type),
      borderColor: event.color || getEventColor(event.type),
    }));
  }, [filteredEvents]);

  // Handle checkbox change
  const handleCheckboxChange = (type: string) => {
    setSelectedEventTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return {
    events,
    subjects,
    eventsLoading,
    filteredEvents,
    calendarEvents,
    filters: {
      selectedSubjectId,
      setSelectedSubjectId,
      selectedEventTypes,
      handleCheckboxChange,
      dateRange,
      setDateRange
    }
  };
};
