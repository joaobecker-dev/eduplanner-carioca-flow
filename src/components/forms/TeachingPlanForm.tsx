import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TeachingPlan, Subject, AnnualPlan } from '@/types';
import { teachingPlanService } from '@/lib/services/teachingPlanService';
import { toast } from '@/hooks/use-toast';
import { teachingPlanSchema, TeachingPlanSchemaValues } from '@/schemas/teachingPlanSchema';
import ArrayInputField from './fields/ArrayInputField';

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Plano de Ensino</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Plano de Ensino de Matemática - 2º Bimestre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Breve descrição sobre este plano de ensino" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disciplina</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a disciplina" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="annualPlanId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plano Anual</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={!form.watch("subjectId") || filteredAnnualPlans.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o plano anual" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredAnnualPlans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Início</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Término</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => 
                            form.watch("startDate") ? 
                            date < form.watch("startDate") :
                            false
                          }
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Objectives and Contents Section */}
          <div className="space-y-4">
            {/* Using the new ArrayInputField component for objectives */}
            <ArrayInputField 
              name="objectives"
              label="Objetivos"
              placeholder="Digite um objetivo"
            />
            
            {/* Using the new ArrayInputField component for contents */}
            <ArrayInputField 
              name="contents"
              label="Conteúdos"
              placeholder="Digite um conteúdo"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="methodology"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Metodologia</FormLabel>
                <FormControl>
                  <Textarea 
                    rows={4}
                    placeholder="Descreva a metodologia que será utilizada" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="evaluation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avaliação</FormLabel>
                <FormControl>
                  <Textarea 
                    rows={4}
                    placeholder="Descreva os métodos de avaliação que serão utilizados" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Using the new ArrayInputField component for resources */}
          <ArrayInputField 
            name="resources"
            label="Recursos"
            placeholder="Digite um recurso"
          />
          
          {/* Using the new ArrayInputField component for BNCC references */}
          <ArrayInputField 
            name="bnccReferences"
            label="Referências BNCC (opcional)"
            placeholder="Ex: EF02MA01"
          />
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
