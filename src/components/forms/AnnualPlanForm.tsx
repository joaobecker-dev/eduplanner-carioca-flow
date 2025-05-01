
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
import { AnnualPlan, Subject, AcademicPeriod } from '@/types';

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
  onSubmit: (data: AnnualPlanFormValues) => void;
  subjects: Subject[];
  academicPeriods: AcademicPeriod[];
  initialData?: Partial<AnnualPlan>;
  isSubmitting?: boolean;
}

const AnnualPlanForm: React.FC<AnnualPlanFormProps> = ({
  onSubmit,
  subjects,
  academicPeriods,
  initialData,
  isSubmitting = false
}) => {
  // Filter subjects based on selected academic period
  const [filteredSubjects, setFilteredSubjects] = React.useState<Subject[]>(subjects);
  
  const form = useForm<AnnualPlanFormValues>({
    resolver: zodResolver(annualPlanSchema),
    defaultValues: initialData ? {
      ...initialData,
      // Convert DB value (reference_materials) to form value (referenceMaterials)
      referenceMaterials: initialData.reference_materials || []
    } : {
      title: "",
      description: "",
      objectives: [],
      generalContent: "",
      methodology: "",
      evaluation: "",
      referenceMaterials: [],
    }
  });

  // Dynamic array fields management
  const [newObjective, setNewObjective] = React.useState<string>("");
  const [newReferenceMaterial, setNewReferenceMaterial] = React.useState<string>("");

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
  }, [form.watch("academicPeriodId"), subjects]);

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
  
  const addReferenceMaterial = () => {
    if (newReferenceMaterial.trim()) {
      const currentReferences = form.getValues("referenceMaterials") || [];
      form.setValue("referenceMaterials", [...currentReferences, newReferenceMaterial.trim()]);
      setNewReferenceMaterial("");
    }
  };
  
  const removeReferenceMaterial = (index: number) => {
    const currentReferences = form.getValues("referenceMaterials") || [];
    form.setValue("referenceMaterials", currentReferences.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (data: AnnualPlanFormValues) => {
    // Convert form value (referenceMaterials) to DB value (reference_materials)
    const formattedData = {
      ...data,
      reference_materials: data.referenceMaterials
    };
    
    // @ts-ignore - We need to delete the referenceMaterials field that's not in the API
    delete formattedData.referenceMaterials;
    
    onSubmit(formattedData as any);
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
                  <FormLabel>Título do Plano Anual</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Plano Anual de Matemática - 5º Ano" {...field} />
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
                    <Textarea placeholder="Breve descrição sobre este plano anual" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="academicPeriodId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Período Acadêmico</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o período" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {academicPeriods.map((period) => (
                          <SelectItem key={period.id} value={period.id}>
                            {period.name}
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
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disciplina</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={!form.watch("academicPeriodId") || filteredSubjects.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a disciplina" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredSubjects.map((subject) => (
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
            </div>
          </div>
          
          {/* Objectives Section */}
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="generalContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conteúdo Geral</FormLabel>
                <FormControl>
                  <Textarea 
                    rows={4}
                    placeholder="Descreva o conteúdo geral que será abordado durante o ano" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          
          <FormField
            control={form.control}
            name="referenceMaterials"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Materiais de Referência (opcional)</FormLabel>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ex: Livro X, Apostila Y"
                    value={newReferenceMaterial}
                    onChange={(e) => setNewReferenceMaterial(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    onClick={addReferenceMaterial}
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
                        onClick={() => removeReferenceMaterial(index)} 
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
            {isSubmitting ? "Salvando..." : initialData ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AnnualPlanForm;
