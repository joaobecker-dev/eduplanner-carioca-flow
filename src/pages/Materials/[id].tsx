
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { materialService } from '@/lib/services';
import { subjectService } from '@/lib/services';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ExternalLink, AlertCircle } from 'lucide-react';
import VideoPlayer from '@/components/Materials/VideoPlayer';
import NotesEditor from '@/components/Materials/NotesEditor';

const MaterialDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch the material data
  const {
    data: material,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['material', id],
    queryFn: () => (id ? materialService.getMaterialById(id) : null),
    enabled: !!id,
  });

  // Fetch the subject if available
  const { data: subject } = useQuery({
    queryKey: ['subject', material?.subjectId],
    queryFn: () => (material?.subjectId ? subjectService.getById(material.subjectId) : null),
    enabled: !!material?.subjectId,
  });

  // Mutation for saving notes
  const notesMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const result = await materialService.updateMaterialNotes(id, notes);
      return !!result; // Return true if successful
    },
  });

  // Handle saving notes
  const handleSaveNotes = async (materialId: string, notes: string): Promise<boolean> => {
    try {
      const result = await notesMutation.mutateAsync({ id: materialId, notes });
      return result;
    } catch (error) {
      console.error('Error saving notes:', error);
      return false;
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/materiais');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container py-8">
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  // Show error state
  if (isError || !material) {
    return (
      <div className="container py-8">
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error ? `Error: ${(error as Error).message}` : 'Material não encontrado.'}
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} className="mt-4">
          Tente novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Navigation */}
      <Button variant="ghost" onClick={handleBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      {/* Material header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{material.title}</h1>
        <div className="flex flex-wrap gap-2 mt-2">
          {material.type && (
            <Badge variant="outline" className="capitalize">
              {material.type}
            </Badge>
          )}
          {subject && (
            <Badge>{subject.name} - {subject.grade}</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video player for video materials */}
          {material.type === 'video' && material.url ? (
            <VideoPlayer embedUrl={material.url} title={material.title} />
          ) : material.url ? (
            <div className="mb-4">
              <Button variant="outline" asChild>
                <a href={material.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Abrir material
                </a>
              </Button>
            </div>
          ) : null}

          {/* Description */}
          {material.description && (
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-2">Descrição</h2>
                <p className="whitespace-pre-wrap">{material.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {material.tags && material.tags.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {material.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Notes editor */}
          <NotesEditor 
            materialId={material.id} 
            initialNotes={material.notes || ''} 
            onSave={handleSaveNotes}
          />
        </div>
      </div>
    </div>
  );
};

export default MaterialDetail;
