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

const teachingPlanSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  annualPlanId: z.string().nonempty("Selecione um plano anual"),
  subjectId: z.string().nonempty("Selecione uma disciplina"),
  startDate: z.date({
    required_error: "Data de início é obrigatória",
  }),
  endDate: z.date({
    required_error: "Data de término é obrigatória",
  }).refine(data => data, {
    message: "Data de término é obrigatória",
  }),
  objectives: z.array(z.string()).optional().default([]),
  contents: z.array(z.string()).optional().default([]),
  methodology: z.string().min(10, "Adicione a metodologia com pelo menos 10 caracteres"),
  resources: z.array(z.string()).optional().default([]),
  evaluation: z.string().min(10, "Adicione os métodos de avaliação"),
  bnccReferences: z.array(z.string()).optional().default([]),
});

export type TeachingPlanFormValues = z.infer<typeof teachingPlanSchema>;

interface TeachingPlanFormProps {
  onSubmit: (data: TeachingPlanFormValues) => void;
  subjects: Subject[];
  annualPlans: AnnualPlan[];
  initialData?: Partial<TeachingPlan> | Record<string, never>;
  isSubmitting?: boolean;
}

const TeachingPlanForm: React.FC<TeachingPlanFormProps> = ({
  onSubmit,
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

  // Dynamic array fields management
  const [newObjective, setNewObjective] = React.useState<string>("");
  const [newContent, setNewContent] = React.useState<string>("");
  const [newResource, setNewResource] = React.useState<string>("");
  const [newBnccReference, setNewBnccReference] = React.useState<string>("");

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
  }, [form.watch("subjectId"), annualPlans]);

  // Add objectives
  const addObjective = () => {
    if (newObjective.trim()) {
      const currentObjectives = form.getValues("objectives") || [];
      form.setValue("objectives", [...currentObjectives, newObjective.trim()]);
      setNewObjective("");
    }
  };
  
  const removeObjective = (index: number) => {
    const currentObjectives = form.getValues("objectives") || [];
    form.setValue("objectives", currentObjectives.filter((_, i) => i !== index));
  };
  
  // Add contents
  const addContent = () => {
    if (newContent.trim()) {
      const currentContents = form.getValues("contents") || [];
      form.setValue("contents", [...currentContents, newContent.trim()]);
      setNewContent("");
    }
  };
  
  const removeContent = (index: number) => {
    const currentContents = form.getValues("contents") || [];
    form.setValue("contents", currentContents.filter((_, i) => i !== index));
  };
  
  // Add resources
  const addResource = () => {
    if (newResource.trim()) {
      const currentResources = form.getValues("resources") || [];
      form.setValue("resources", [...currentResources, newResource.trim()]);
      setNewResource("");
    }
  };
  
  const removeResource = (index: number) => {
    const currentResources = form.getValues("resources") || [];
    form.setValue("resources", currentResources.filter((_, i) => i !== index));
  };
  
  // Add BNCC references
  const addBnccReference = () => {
    if (newBnccReference.trim()) {
      const currentReferences = form.getValues("bnccReferences") || [];
      form.setValue("bnccReferences", [...currentReferences, newBnccReference.trim()]);
      setNewBnccReference("");
    }
  };
  
  const removeBnccReference = (index: number) => {
    const currentReferences = form.getValues("bnccReferences") || [];
    form.setValue("bnccReferences", currentReferences.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <FormField
              control={form.control}
              name="objectives"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objetivos</FormLabel>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Digite um objetivo"
                      value={newObjective}
                      onChange={(e) => setNewObjective(e.target.value)}
                    />
                    <Button 
                      type="button" 
                      onClick={addObjective}
                      variant="secondary"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {field.value?.map((objective, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="px-2 py-1 text-sm flex items-center gap-1"
                      >
                        {objective}
                        <X 
                          size={14} 
                          className="cursor-pointer text-gray-500 hover:text-red-500"
                          onClick={() => removeObjective(index)} 
                        />
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdos</FormLabel>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Digite um conteúdo"
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                    />
                    <Button 
                      type="button" 
                      onClick={addContent}
                      variant="secondary"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {field.value?.map((content, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="px-2 py-1 text-sm flex items-center gap-1"
                      >
                        {content}
                        <X 
                          size={14} 
                          className="cursor-pointer text-gray-500 hover:text-red-500"
                          onClick={() => removeContent(index)} 
                        />
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
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
          <FormField
            control={form.control}
            name="resources"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recursos</FormLabel>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Digite um recurso"
                    value={newResource}
                    onChange={(e) => setNewResource(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    onClick={addResource}
                    variant="secondary"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {field.value?.map((resource, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="px-2 py-1 text-sm flex items-center gap-1"
                    >
                      {resource}
                      <X 
                        size={14} 
                        className="cursor-pointer text-gray-500 hover:text-red-500"
                        onClick={() => removeResource(index)} 
                      />
                    </Badge>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bnccReferences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Referências BNCC (opcional)</FormLabel>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ex: EF02MA01"
                    value={newBnccReference}
                    onChange={(e) => setNewBnccReference(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    onClick={addBnccReference}
                    variant="secondary"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {field.value?.map((reference, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="px-2 py-1 text-sm flex items-center gap-1"
                    >
                      {reference}
                      <X 
                        size={14} 
                        className="cursor-pointer text-gray-500 hover:text-red-500"
                        onClick={() => removeBnccReference(index)} 
                      />
                    </Badge>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      
        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : initialData.id ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TeachingPlanForm;
