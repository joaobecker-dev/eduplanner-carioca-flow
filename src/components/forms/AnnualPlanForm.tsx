import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
} from '@/components/ui/form';
import { AnnualPlan, Subject, AcademicPeriod } from '@/types';
import { annualPlanService } from '@/lib/services/annualPlanService';
import { toast } from '@/hooks/use-toast';
import ArrayInputField from './fields/ArrayInputField';
import TextAreaField from './fields/TextAreaField';
import InputField from './fields/InputField';
import SelectField from './fields/SelectField';
import FormSection from './layout/FormSection';

// Import zod schema from a central location
import { z } from 'zod';

const annualPlanSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  academicPeriodId: z.string().nonempty("Selecione um período acadêmico"),
  subjectId: z.string().nonempty("Selecione uma disciplina"),
  objectives: z.array(z.string()).optional().default([]),
  generalContent: z.string().min(10, "O conteúdo geral deve ter pelo menos 10 caracteres"),
  methodology: z.string().min(10, "A metodologia deve ter pelo menos 10 caracteres"),
  evaluation: z.string().min(10, "O método de avaliação deve ter pelo menos 10 caracteres"),
  referenceMaterials: z.array(z.string()).optional().default([]),
});

export type AnnualPlanFormValues = z.infer<typeof annualPlanSchema>;

interface AnnualPlanFormProps {
  onSubmit?: (data: AnnualPlanFormValues) => void;
  subjects: Subject[];
  academicPeriods: AcademicPeriod[];
  initialData?: Partial<AnnualPlan>;
  isSubmitting?: boolean;
}

const AnnualPlanForm: React.FC<AnnualPlanFormProps> = ({
  onSubmit: externalSubmitHandler,
  subjects,
  academicPeriods,
  initialData,
  isSubmitting = false
}) => {
  // Filter subjects based on selected academic period
  const [filteredSubjects, setFilteredSubjects] = React.useState<Subject[]>(subjects);
  
  const form = useForm<AnnualPlanFormValues>({
    resolver: zodResolver(annualPlanSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      academicPeriodId: initialData?.academicPeriodId || "",
      subjectId: initialData?.subjectId || "",
      objectives: Array.isArray(initialData?.objectives) ? initialData?.objectives : [],
      generalContent: initialData?.generalContent || "",
      methodology: initialData?.methodology || "",
      evaluation: initialData?.evaluation || "",
      referenceMaterials: Array.isArray(initialData?.referenceMaterials) ? initialData?.referenceMaterials : [],
    }
  });

  // Update form values when initialData changes
  React.useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title || "",
        description: initialData.description || "",
        academicPeriodId: initialData.academicPeriodId || "",
        subjectId: initialData.subjectId || "",
        objectives: Array.isArray(initialData.objectives) ? initialData.objectives : [],
        generalContent: initialData.generalContent || "",
        methodology: initialData.methodology || "",
        evaluation: initialData.evaluation || "",
        referenceMaterials: Array.isArray(initialData.referenceMaterials) ? initialData.referenceMaterials : [],
      });
    }
  }, [initialData, form]);

  // Update filtered subjects when academic period changes
  React.useEffect(() => {
    const academicPeriodId = form.watch("academicPeriodId");
    if (academicPeriodId) {
      const filtered = subjects.filter(subject => subject.academicPeriodId === academicPeriodId);
      setFilteredSubjects(filtered);
      
      // If current selected subject doesn't belong to this academic period, reset it
      const currentSubject = form.watch("subjectId");
      if (currentSubject && !filtered.some(s => s.id === currentSubject)) {
        form.setValue("subjectId", "");
      }
    } else {
      setFilteredSubjects([]);
    }
  }, [form.watch("academicPeriodId"), subjects, form]);

  const handleFormSubmit = async (data: AnnualPlanFormValues) => {
    try {
      // Use external submit handler if provided
      if (externalSubmitHandler) {
        externalSubmitHandler(data);
        return;
      }

      // Otherwise use the service directly
      // Convert form value (referenceMaterials) to DB value (reference_materials)
      const formattedData = {
        ...data,
        reference_materials: data.referenceMaterials
      };
      
      // @ts-ignore - We need to delete the referenceMaterials field that's not in the API
      delete formattedData.referenceMaterials;
      
      if (initialData?.id) {
        await annualPlanService.update(initialData.id, formattedData as any);
        toast({
          title: "Plano Anual atualizado",
          description: "O plano anual foi atualizado com sucesso!",
        });
      } else {
        await annualPlanService.create(formattedData as any);
        toast({
          title: "Plano Anual criado",
          description: "O novo plano anual foi criado com sucesso!",
        });
        form.reset(); // Reset form after successful creation
      }
    } catch (error) {
      console.error("Error saving annual plan:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o plano anual. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Convert data structure for SelectField
  const academicPeriodOptions = academicPeriods.map((period) => ({
    label: period.name,
    value: period.id
  }));

  const subjectOptions = filteredSubjects.map((subject) => ({
    label: subject.name,
    value: subject.id
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information Section */}
          <FormSection title="Informações Básicas">
            <InputField
              name="title"
              label="Título do Plano Anual"
              placeholder="Ex: Plano Anual de Matemática - 5º Ano"
              control={form.control}
            />
            
            <TextAreaField
              name="description"
              label="Descrição (opcional)"
              placeholder="Breve descrição sobre este plano anual"
              control={form.control}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                name="academicPeriodId"
                label="Período Acadêmico"
                placeholder="Selecione o período"
                options={academicPeriodOptions}
                control={form.control}
              />
              
              <SelectField
                name="subjectId"
                label="Disciplina"
                placeholder="Selecione a disciplina"
                options={subjectOptions}
                disabled={!form.watch("academicPeriodId") || filteredSubjects.length === 0}
                control={form.control}
              />
            </div>
          </FormSection>
          
          {/* Objectives Section */}
          <FormSection title="Objetivos">
            <ArrayInputField
              name="objectives"
              label="Objetivos"
              placeholder="Digite um objetivo"
              control={form.control}
            />
          </FormSection>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormSection title="Conteúdo e Metodologia">
            <TextAreaField
              name="generalContent"
              label="Conteúdo Geral"
              placeholder="Descreva o conteúdo geral que será abordado durante o ano"
              rows={4}
              control={form.control}
            />
            
            <TextAreaField
              name="methodology"
              label="Metodologia"
              placeholder="Descreva a metodologia que será utilizada"
              rows={4}
              control={form.control}
            />
          </FormSection>
          
          <FormSection title="Avaliação e Referências">
            <TextAreaField
              name="evaluation"
              label="Avaliação"
              placeholder="Descreva os métodos de avaliação que serão utilizados"
              rows={4}
              control={form.control}
            />
            
            {/* Reference Materials Section */}
            <ArrayInputField
              name="referenceMaterials"
              label="Materiais de Referência (opcional)"
              placeholder="Ex: Livro X, Apostila Y"
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

export default AnnualPlanForm;
