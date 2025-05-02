
import React from 'react';
import { Subject, CalendarEvent } from '@/types';
import { formatDisplayDate } from '@/integrations/supabase/supabaseAdapter';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';

interface EventDetailsModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedEvent: CalendarEvent | null;
  handleEditEvent: () => void;
  handleDeleteEvent: () => void;
  getEventTypeLabel: (type: string) => string;
  getRelatedSubject: (subjectId?: string) => Subject | undefined;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  isOpen,
  setIsOpen,
  selectedEvent,
  handleEditEvent,
  handleDeleteEvent,
  getEventTypeLabel,
  getRelatedSubject
}) => {
  if (!selectedEvent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{selectedEvent.title}</DialogTitle>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline">{getEventTypeLabel(selectedEvent.type)}</Badge>
            {selectedEvent.subjectId && getRelatedSubject(selectedEvent.subjectId) && (
              <Badge>{getRelatedSubject(selectedEvent.subjectId)?.name}</Badge>
            )}
          </div>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {/* Event date with better error handling */}
          <div>
            <span className="font-medium">Data:</span>
            <p>
              {formatDisplayDate(selectedEvent.startDate)}
              {selectedEvent.endDate && selectedEvent.startDate !== selectedEvent.endDate && 
                ` até ${formatDisplayDate(selectedEvent.endDate)}`
              }
            </p>
          </div>

          {/* Description */}
          {selectedEvent.description && (
            <div>
              <span className="font-medium">Descrição:</span>
              <p>{selectedEvent.description}</p>
            </div>
          )}

          {/* Source information */}
          {selectedEvent.sourceType && selectedEvent.sourceType !== 'manual' && (
            <div>
              <span className="font-medium">Origem:</span>
              <p>{selectedEvent.sourceType === 'assessment' ? 'Avaliação' : 
                  selectedEvent.sourceType === 'lesson_plan' ? 'Plano de Aula' : 
                  selectedEvent.sourceType === 'teaching_plan' ? 'Plano de Ensino' : 
                  'Manual'}</p>
            </div>
          )}

          {/* References */}
          <div className="space-y-2">
            {selectedEvent.assessmentId && (
              <p>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <a href={`/avaliacoes?id=${selectedEvent.assessmentId}`}>Ver detalhes da avaliação</a>
                </Button>
              </p>
            )}
            {selectedEvent.lessonPlanId && (
              <p>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <a href={`/planejamento?lesson=${selectedEvent.lessonPlanId}`}>Ver plano de aula</a>
                </Button>
              </p>
            )}
            {selectedEvent.teachingPlanId && (
              <p>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <a href={`/planejamento?teaching=${selectedEvent.teachingPlanId}`}>Ver plano de ensino</a>
                </Button>
              </p>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Fechar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteEvent}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
            <Button 
              onClick={handleEditEvent}
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal;
