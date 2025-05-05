
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/ui-components/SectionHeader';
import { services } from '@/lib/services';
import MaterialDetail from '@/components/Material/MaterialDetail';
import { Skeleton } from '@/components/ui/skeleton';

const MaterialDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: material, isLoading, error } = useQuery({
    queryKey: ['material', id],
    queryFn: () => id ? services.material.getById(id) : null,
    enabled: !!id,
  });

  const handleBack = () => {
    navigate('/materiais');
  };

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <Button 
        variant="ghost" 
        onClick={handleBack} 
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para Materiais
      </Button>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <h2 className="text-lg font-medium">Erro ao carregar material</h2>
          <p className="text-muted-foreground">Não foi possível encontrar o material solicitado.</p>
          <Button onClick={handleBack} className="mt-4">Voltar para Materiais</Button>
        </div>
      ) : material ? (
        <>
          <SectionHeader
            title={material.title}
            description={`Material do tipo: ${material.type === 'video' ? 'Vídeo' : 
              material.type === 'document' ? 'Documento' : 
              material.type === 'link' ? 'Link' : 
              material.type === 'image' ? 'Imagem' : 'Outro'}`}
          />
          <MaterialDetail material={material} />
        </>
      ) : (
        <div className="p-8 text-center">
          <h2 className="text-lg font-medium">Material não encontrado</h2>
          <p className="text-muted-foreground">O material solicitado não existe.</p>
          <Button onClick={handleBack} className="mt-4">Voltar para Materiais</Button>
        </div>
      )}
    </div>
  );
};

export default MaterialDetailPage;
