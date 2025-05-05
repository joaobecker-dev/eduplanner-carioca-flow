
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Material, Subject } from '@/types';
import { services } from '@/lib/services';
import VideoEmbed from '@/components/ui-components/VideoEmbed';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';

interface MaterialDetailProps {
  material: Material;
}

interface NotesFormValues {
  notes: string;
}

const MaterialDetail: React.FC<MaterialDetailProps> = ({ material }) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  
  // Get subject data if available
  const { data: subject } = useQuery<Subject>({
    queryKey: ['subject', material.subjectId],
    queryFn: () => material.subjectId ? services.subject.getById(material.subjectId) : null,
    enabled: !!material.subjectId,
  });

  // Set up form for notes
  const form = useForm<NotesFormValues>({
    defaultValues: {
      notes: material.notes || '',
    },
  });

  // Mutation for saving notes
  const updateMutation = useMutation({
    mutationFn: (data: NotesFormValues) => {
      return services.material.update(material.id, { notes: data.notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['material', material.id] });
      toast.success('Anotações salvas com sucesso');
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Error updating notes:', error);
      toast.error('Erro ao salvar anotações');
    },
  });

  const handleSaveNotes = (data: NotesFormValues) => {
    updateMutation.mutate(data);
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Video Player or Link Display */}
      <Card>
        <CardContent className="pt-6">
          {material.type === 'video' ? (
            material.url ? (
              <VideoEmbed 
                url={material.url} 
                title={material.title} 
                className="w-full aspect-video mb-4"
              />
            ) : (
              <div className="text-center p-12 bg-gray-100 rounded-md">
                <p>Este material de vídeo não possui URL disponível.</p>
              </div>
            )
          ) : material.url ? (
            <div className="text-center p-6">
              <p>
                Este material não é um vídeo. 
                <a 
                  href={material.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:underline"
                >
                  Abrir link externo
                </a>
              </p>
            </div>
          ) : (
            <div className="text-center p-6">
              <p>Este material não possui URL disponível.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Material Details */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {material.tags && material.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">{tag}</Badge>
            ))}
          </div>

          {material.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Descrição</h3>
              <p className="text-gray-700">{material.description}</p>
            </div>
          )}

          {subject && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Disciplina</h3>
              <p className="text-gray-700">{subject.name} - {subject.grade}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Minhas Anotações</h3>
            {!isEditing && (
              <Button 
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
              >
                Editar
              </Button>
            )}
          </div>

          {isEditing ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSaveNotes)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Anotações</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Adicione suas anotações sobre este material aqui..."
                          className="min-h-[150px]" 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      form.reset({ notes: material.notes || '' });
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? 'Salvando...' : 'Salvar Anotações'}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="bg-gray-50 rounded-md p-4 min-h-[100px]">
              {material.notes ? (
                <p className="whitespace-pre-wrap">{material.notes}</p>
              ) : (
                <p className="text-gray-500 italic">Nenhuma anotação adicionada.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialDetail;
