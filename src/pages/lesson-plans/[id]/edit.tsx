import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LessonPlan } from '@/types';
import { lessonPlanService } from '@/lib/services';
import { lessonPlanSchema } from '@/schemas/lessonPlanSchema';
import { toast } from '@/hooks/use-toast';

const EditLessonPlan = ({ id }) => {
  const { register, handleSubmit, setValue } = useForm({
    resolver: zodResolver(lessonPlanSchema),
  });

  const fetchLessonPlan = async () => {
    const lessonPlan = await lessonPlanService.getById(id);
    if (lessonPlan) {
      setValue('title', lessonPlan.title);
      setValue('date', lessonPlan.date);
      setValue('duration', lessonPlan.duration);
      setValue('teachingPlanId', lessonPlan.teachingPlanId);
      setValue('objectives', lessonPlan.objectives.join('\n'));
      setValue('contents', lessonPlan.contents.join('\n'));
      setValue('activities', lessonPlan.activities.join('\n'));
      setValue('resources', lessonPlan.resources.join('\n'));
      setValue('notes', lessonPlan.notes);
      setValue('evaluation', lessonPlan.evaluation);
      setValue('homework', lessonPlan.homework);
    }
  };

  React.useEffect(() => {
    fetchLessonPlan();
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      const lessonPlanData: Partial<LessonPlan> = {
        title: values.title,
        date: values.date,
        duration: values.duration,
        teachingPlanId: values.teachingPlanId,
        objectives: Array.isArray(values.objectives) ? values.objectives : 
          values.objectives ? values.objectives.split('\n').filter(Boolean) : [],
        contents: Array.isArray(values.contents) ? values.contents : 
          values.contents ? values.contents.split('\n').filter(Boolean) : [],
        activities: Array.isArray(values.activities) ? values.activities : 
          values.activities ? values.activities.split('\n').filter(Boolean) : [],
        resources: Array.isArray(values.resources) ? values.resources : 
          values.resources ? values.resources.split('\n').filter(Boolean) : [],
        notes: values.notes,
        evaluation: values.evaluation,
        homework: values.homework
      };

      await lessonPlanService.update(id, lessonPlanData);
      toast({
        title: "Sucesso",
        description: "O plano de aula foi atualizado com sucesso!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar plano de aula",
        description: error.message || "Ocorreu um erro ao atualizar o plano de aula.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input {...register('title')} placeholder="Título" />
      <input type="date" {...register('date')} />
      <input type="number" {...register('duration')} placeholder="Duração (minutos)" />
      <input {...register('teachingPlanId')} placeholder="ID do Plano de Ensino" />
      <textarea {...register('objectives')} placeholder="Objetivos" />
      <textarea {...register('contents')} placeholder="Conteúdos" />
      <textarea {...register('activities')} placeholder="Atividades" />
      <textarea {...register('resources')} placeholder="Recursos" />
      <textarea {...register('notes')} placeholder="Notas" />
      <textarea {...register('evaluation')} placeholder="Avaliação" />
      <textarea {...register('homework')} placeholder="Dever de Casa" />
      <button type="submit">Salvar</button>
    </form>
  );
};

export default EditLessonPlan;
