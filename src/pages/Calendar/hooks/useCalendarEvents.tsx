
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { subjectService } from '@/lib/services';
import { calendarEventService } from '@/lib/services';

interface DateRange {
  from: Date | null;
  to: Date | null;
}

export const useCalendarEvents = () => {
  // State for filters
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedEventTypes, setSelectedEventTypes] = useState<Record<string, boolean>>({
    class: true,
    exam: true,
    meeting: true, 
    other: true,
    deadline: true
  });
  const [dateRange, setDateRange] = useState<DateRange>({ 
    from: null, 
    to: null 
  });
  
  // Fetch all subjects (for filtering)
  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectService.getAll,
  });
  
  // Fetch calendar events
  const { data: allCalendarEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['calendarEvents'],
    queryFn: calendarEventService.getAll,
  });

  // Handle checkbox change for event types
  const handleCheckboxChange = (type: string) => {
    setSelectedEventTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Filter events based on selected filters
  const calendarEvents = useMemo(() => {
    return (allCalendarEvents as any[]).filter(event => {
      // Filter by event type
      if (!selectedEventTypes[event.type as string]) {
        return false;
      }
      
      // Filter by subject
      if (selectedSubjectId && event.subjectId !== selectedSubjectId) {
        return false;
      }
      
      // Filter by date range
      if (dateRange.from && new Date(event.startDate) < dateRange.from) {
        return false;
      }
      
      if (dateRange.to) {
        const endDate = new Date(dateRange.to);
        endDate.setHours(23, 59, 59, 999);
        if (new Date(event.startDate) > endDate) {
          return false;
        }
      }
      
      return true;
    });
  }, [allCalendarEvents, selectedEventTypes, selectedSubjectId, dateRange]);

  return {
    subjects, 
    eventsLoading, 
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
