
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarEvent } from '@/types';
import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import { eventCategoryLabels } from '@/schemas/eventSchema';

interface EventDetailProps {
  event: CalendarEvent;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const EventDetail: React.FC<EventDetailProps> = ({ 
  event, 
  onClose,
  onEdit,
  onDelete 
}) => {
  const eventTypeLabel = eventCategoryLabels[event.type] || event.type;
  
  const formatEventDate = (date: string) => {
    try {
      return format(new Date(date), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return 'Data inválida';
    }
  };

  return (
    <Dialog open={!!event} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline">{eventTypeLabel}</Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {/* Event date */}
          <div>
            <span className="font-medium">Data:</span>
            <p>
              {formatEventDate(event.startDate)}
              {event.endDate && event.startDate !== event.endDate && 
                ` até ${formatEventDate(event.endDate)}`
              }
            </p>
          </div>

          {/* Description */}
          {event.description && (
            <div>
              <span className="font-medium">Descrição:</span>
              <p>{event.description}</p>
            </div>
          )}

          {/* Location if present */}
          {event.location && (
            <div>
              <span className="font-medium">Local:</span>
              <p>{event.location}</p>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Fechar
            </Button>
            {onDelete && (
              <Button 
                variant="destructive" 
                onClick={onDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            )}
            {onEdit && (
              <Button onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetail;
