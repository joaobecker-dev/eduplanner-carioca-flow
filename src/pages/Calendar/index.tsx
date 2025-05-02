import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Calendar from '@/components/calendar/Calendar';
import NewEventModal from '@/components/modals/NewEventModal';
import { calendarEventService } from '@/lib/services/calendarEventService';
import { toast } from '@/hooks/use-toast';

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  
  // Get current month and year
  const month = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  const year = currentDate.getFullYear();
  
  // Fetch events for the current month
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['calendarEvents', year, month],
    queryFn: () => calendarEventService.getByMonth(year, month),
  });
  
  // Handle errors
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Erro ao carregar eventos",
        description: (error as Error).message || "Não foi possível carregar os eventos do calendário.",
        variant: "destructive",
      });
    }
  }, [error]);
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendário</h1>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Evento
        </Button>
      </div>
      
      <Calendar 
        events={events} 
        isLoading={isLoading} 
      />
      
      <NewEventModal 
        open={showModal} 
        onOpenChange={setShowModal} 
      />
    </div>
  );
};

export default CalendarPage;
