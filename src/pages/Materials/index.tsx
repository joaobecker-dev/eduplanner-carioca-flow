
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { materialService } from '@/lib/services';
import { Material } from '@/types';
import SectionHeader from '@/components/ui-components/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import VideoThumbnail from '@/components/ui-components/VideoThumbnail';
import { Skeleton } from '@/components/ui/skeleton';

const MaterialsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: materials, isLoading } = useQuery({
    queryKey: ['materials'],
    queryFn: materialService.getAll,
  });

  const handleViewDetail = (material: Material) => {
    navigate(`/materiais/${material.id}`);
  };

  return (
    <div className="container py-8">
      <SectionHeader 
        title="Materiais" 
        description="Gerencie recursos e materiais de apoio para suas aulas"
        rightContent={
          <Button onClick={() => window.materialDialogs?.openCreateDialog?.()}>
            <Plus className="mr-2 h-4 w-4" /> Novo Material
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {isLoading ? (
          // Loading skeleton
          Array(8)
            .fill(0)
            .map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <CardContent className="pt-6">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))
        ) : materials?.length ? (
          // Materials grid
          materials.map((material) => (
            <Card key={material.id} className="overflow-hidden">
              {material.type === 'video' && material.thumbnailUrl ? (
                <VideoThumbnail 
                  src={material.thumbnailUrl} 
                  alt={material.title} 
                  className="h-40 w-full object-cover" 
                />
              ) : (
                <div className={`h-40 w-full flex items-center justify-center bg-muted`}>
                  <span className="text-muted-foreground capitalize">{material.type}</span>
                </div>
              )}
              
              <CardContent className="pt-6">
                <h3 className="font-semibold truncate">{material.title}</h3>
                {material.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {material.description}
                  </p>
                )}
              </CardContent>
              
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleViewDetail(material)}
                >
                  Ver Detalhes
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          // Empty state
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground mb-4">Nenhum material encontrado.</p>
            <Button onClick={() => window.materialDialogs?.openCreateDialog?.()}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Material
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialsPage;
