
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
} from '@/components/ui/form';
import { TeachingPlan, Subject, AnnualPlan } from '@/types';
import { teachingPlanService } from '@/lib/services/teachingPlanService';
import { toast } from '@/hooks/use-toast';
import { teachingPlanSchema, TeachingPlanSchemaValues } from '@/schemas/teachingPlanSchema';
import ArrayInputField from './fields/ArrayInputField';
import TextAreaField from './fields/TextAreaField';
import InputField from './fields/InputField';
import SelectField from './fields/SelectField';
import DatePickerField from './fields/DatePickerField';
import FormSection from './layout/FormSection';

export type TeachingPlanFormValues = TeachingPlanSchemaValues;

interface TeachingPlanFormProps {
  onSubmit?: (data: TeachingPlanFormValues) => void;
  subjects: Subject[];
  annualPlans: AnnualPlan[];
  initialData?: Partial<TeachingPlan> | Record<string, never>;
  isSubmitting?: boolean;
}

const TeachingPlanForm: React.FC<TeachingPlanFormProps> = ({
  onSubmit: externalSubmitHandler,
  subjects,
  annualPlans,
  initialData = {},
  isSubmitting = false
}) => {
  // Filter annual plans based on selected subject
  const [filteredAnnualPlans, setFilteredAnnualPlans] = React.useState<AnnualPlan[]>(annualPlans);
  
  const form = useForm<TeachingPlanFormValues>({
    resolver: zodResolver(teachingPlanSchema),
    defaultValues: {
      title: initialData.title || "",
      description: initialData.description || "",
      annualPlanId: initialData.annualPlanId || "",
      subjectId: initialData.subjectId || "",
      startDate: initialData.startDate ? new Date(initialData.startDate) : new Date(),
      endDate: initialData.endDate ? new Date(initialData.endDate) : new Date(),
      objectives: Array.isArray(initialData.objectives) ? initialData.objectives : [],
      contents: Array.isArray(initialData.contents) ? initialData.contents : [],
      methodology: initialData.methodology || "",
      resources: Array.isArray(initialData.resources) ? initialData.resources : [],
      evaluation: initialData.evaluation || "",
      bnccReferences: Array.isArray(initialData.bnccReferences) ? initialData.bnccReferences : [],
    }
  });

  // Update form values when initialData changes
  React.useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      form.reset({
        title: initialData.title || "",
        description: initialData.description || "",
        annualPlanId: initialData.annualPlanId || "",
        subjectId: initialData.subjectId || "",
        startDate: initialData.startDate ? new Date(initialData.startDate) : new Date(),
        endDate: initialData.endDate ? new Date(initialData.endDate) : new Date(),
        objectives: Array.isArray(initialData.objectives) ? initialData.objectives : [],
        contents: Array.isArray(initialData.contents) ? initialData.contents : [],
        methodology: initialData.methodology || "",
        resources: Array.isArray(initialData.resources) ? initialData.resources : [],
        evaluation: initialData.evaluation || "",
        bnccReferences: Array.isArray(initialData.bnccReferences) ? initialData.bnccReferences : [],
      });
    }
  }, [initialData, form]);

  // Update filtered annual plans when subject changes
  React.useEffect(() => {
    const subjectId = form.watch("subjectId");
    if (subjectId) {
      const filtered = annualPlans.filter(plan => plan.subjectId === subjectId);
      setFilteredAnnualPlans(filtered);
      
      // If current selected annual plan doesn't belong to this subject, reset it
      const currentAnnualPlan = form.watch("annualPlanId");
      if (currentAnnualPlan && !filtered.some(p => p.id === currentAnnualPlan)) {
        form.setValue("annualPlanId", "");
      }
    } else {
      setFilteredAnnualPlans([]);
    }
  }, [form.watch("subjectId"), annualPlans, form]);

  const handleFormSubmit = async (data: TeachingPlanFormValues) => {
    try {
      // Use external submit handler if provided
      if (externalSubmitHandler) {
        externalSubmitHandler(data);
        return;
      }
      
      // Otherwise use the service directly
      if (initialData?.id) {
        await teachingPlanService.update(initialData.id, data);
        toast({
          title: "Plano de Ensino atualizado",
          description: "O plano de ensino foi atualizado com sucesso!",
        });
      } else {
        await teachingPlanService.create(data);
        toast({
          title: "Plano de Ensino criado",
          description: "O novo plano de ensino foi criado com sucesso!",
        });
        form.reset(); // Reset form after successful creation
      }
    } catch (error) {
      console.error("Error saving teaching plan:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o plano de ensino. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Convert data structure for SelectField
  const subjectOptions = subjects.map((subject) => ({
    label: subject.name,
    value: subject.id
  }));

  const annualPlanOptions = filteredAnnualPlans.map((plan) => ({
    label: plan.title,
    value: plan.id
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <FormSection title="Informações Básicas">
              <InputField
                name="title"
                label="Título do Plano de Ensino"
                placeholder="Ex: Plano de Ensino de Matemática - 2º Bimestre"
                control={form.control}
              />
              
              <TextAreaField
                name="description"
                label="Descrição (opcional)"
                placeholder="Breve descrição sobre este plano de ensino"
                control={form.control}
              />
            </FormSection>
            
            <FormSection title="Disciplina e Plano Anual">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  name="subjectId"
                  label="Disciplina"
                  placeholder="Selecione a disciplina"
                  options={subjectOptions}
                  control={form.control}
                />
                
                <SelectField
                  name="annualPlanId"
                  label="Plano Anual"
                  placeholder="Selecione o plano anual"
                  options={annualPlanOptions}
                  disabled={!form.watch("subjectId") || filteredAnnualPlans.length === 0}
                  control={form.control}
                />
              </div>
            </FormSection>
            
            <FormSection title="Período">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DatePickerField
                  name="startDate"
                  label="Data de Início"
                  placeholder="Selecione uma data"
                  control={form.control}
                />
                
                <DatePickerField
                  name="endDate"
                  label="Data de Término"
                  placeholder="Selecione uma data"
                  disabledBefore={form.watch("startDate")}
                  control={form.control}
                />
              </div>
            </FormSection>
          </div>
          
          {/* Objectives and Contents Section */}
          <FormSection title="Objetivos e Conteúdos">
            {/* Using ArrayInputField component for objectives */}
            <ArrayInputField 
              name="objectives"
              label="Objetivos"
              placeholder="Digite um objetivo"
              control={form.control}
            />
            
            {/* Using ArrayInputField component for contents */}
            <ArrayInputField 
              name="contents"
              label="Conteúdos"
              placeholder="Digite um conteúdo"
              control={form.control}
            />
          </FormSection>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormSection title="Metodologia e Avaliação">
            <TextAreaField
              name="methodology"
              label="Metodologia"
              placeholder="Descreva a metodologia que será utilizada"
              rows={4}
              control={form.control}
            />
            
            <TextAreaField
              name="evaluation"
              label="Avaliação"
              placeholder="Descreva os métodos de avaliação que serão utilizados"
              rows={4}
              control={form.control}
            />
          </FormSection>
          
          <FormSection title="Recursos e Referências BNCC">
            {/* Using ArrayInputField component for resources */}
            <ArrayInputField 
              name="resources"
              label="Recursos"
              placeholder="Digite um recurso"
              control={form.control}
            />
            
            {/* Using ArrayInputField component for BNCC references */}
            <ArrayInputField 
              name="bnccReferences"
              label="Referências BNCC (opcional)"
              placeholder="Ex: EF02MA01"
              control={form.control}
            />
          </FormSection>
        </div>
      
        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : initialData?.id ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TeachingPlanForm;
