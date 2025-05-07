import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import LessonPlanForm, { LessonPlanFormValues } from '@/components/forms/LessonPlanForm';
import { toast } from "@/hooks/use-toast";
import { LessonPlan, TeachingPlan } from '@/types';
import { lessonPlanService } from '@/lib/services';

interface LessonPlanModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  lessonPlan?: LessonPlan;
  teachingPlans: TeachingPlan[];
  onSuccess: () => void;
}

const LessonPlanModals: React.FC<LessonPlanModalProps> = ({
  isOpen,
  setIsOpen,
  lessonPlan,
  teachingPlans,
  onSuccess
}) => {
  const [isSubmitting, setSubmitting] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleSubmit = async (values: LessonPlanFormValues) => {
    setSubmitting(true);
    try {
      // Process arrays from newline-separated strings
      const processedValues: Omit<LessonPlan, "id" | "created_at" | "updated_at"> = {
        title: values.title,
        teachingPlanId: values.teachingPlanId,
        date: values.date.toISOString(), // Convert Date to string
        duration: values.duration,
        objectives: values.objectives ? values.objectives.split('\n').filter(Boolean) : [],
        contents: values.contents ? values.contents.split('\n').filter(Boolean) : [],
        activities: values.activities ? values.activities.split('\n').filter(Boolean) : [],
        resources: values.resources ? values.resources.split('\n').filter(Boolean) : [],
        homework: values.homework || undefined,
        evaluation: values.evaluation || undefined,
        notes: values.notes || undefined
      };

      if (lessonPlan) {
        // Update existing lesson plan
        await lessonPlanService.update(lessonPlan.id, processedValues);
        toast({
          title: "Plano de aula atualizado",
          description: `O plano ${values.title} foi atualizado com sucesso.`,
        });
      } else {
        // Create new lesson plan
        const created = await lessonPlanService.create({
          ...processedValues,
          status: 'draft',
        });
        
        if (created && created.id) {
          // Sync with calendar
          await lessonPlanService.syncWithCalendar(created.id);
        }
        
        toast({
          title: "Plano de aula criado",
          description: `O plano ${values.title} foi criado com sucesso.`,
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error saving lesson plan:", error);
      toast({
        title: "Erro ao salvar plano de aula",
        description: "Ocorreu um erro ao salvar o plano de aula. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{lessonPlan ? "Editar Plano de Aula" : "Novo Plano de Aula"}</DialogTitle>
        </DialogHeader>
        <LessonPlanForm
          onSubmit={handleSubmit}
          initialData={lessonPlan}
          teachingPlans={teachingPlans}
          isSubmitting={isSubmitting}
        />
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Export the component as default
export default LessonPlanModals;

// Also export it as a named export for backward compatibility
export { LessonPlanModals };
