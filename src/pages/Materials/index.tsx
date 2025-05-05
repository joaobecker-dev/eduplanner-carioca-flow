
import React, { useState, useEffect, useRef } from 'react';
import { 
  FolderOpen, 
  Search, 
  Filter, 
  PlusSquare, 
  FileText, 
  Video, 
  Link as LinkIcon, 
  Image, 
  File,
  Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import SectionHeader from '@/components/ui-components/SectionHeader';
import { Material, Subject } from '@/types';
import { services } from '@/lib/services';
import { toast } from '@/hooks/use-toast';
import { MaterialsModals } from './MaterialsModals';
import AdvancedFilter, { FilterGroup } from '@/components/ui-components/AdvancedFilter';
import VideoThumbnail from '@/components/ui-components/VideoThumbnail';
import VideoEmbed from '@/components/ui-components/VideoEmbed';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Materials: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all');

  // Video preview modal state
  const [videoPreviewOpen, setVideoPreviewOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Material | null>(null);

  // Reference to the Materials modals component
  const materialsModalsRef = useRef<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [subjectsData, materialsData] = await Promise.all([
        services.subject.getAll(),
        services.material.getAll()
      ]);
      
      setSubjects(subjectsData);
      setMaterials(materialsData);
      setFilteredMaterials(materialsData);
    } catch (error) {
      console.error('Error fetching materials data:', error);
      toast({
        title: "Erro ao carregar materiais",
        description: "Não foi possível obter os materiais. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter materials based on search, subject and type filters
  useEffect(() => {
    let filtered = [...materials];
    
    // Apply subject filter
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(material => material.subjectId === selectedSubject);
    }
    
    // Apply type filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(material => material.type === activeTab);
    }
    
    // Apply date range filter
    if (selectedDateRange !== 'all') {
      const now = new Date();
      let startDate: Date;
      
      switch(selectedDateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          filtered = filtered.filter(material => new Date(material.updatedAt) >= startDate);
          break;
        case 'week':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 7);
          filtered = filtered.filter(material => new Date(material.updatedAt) >= startDate);
          break;
        case 'month':
          startDate = new Date(now);
          startDate.setMonth(startDate.getMonth() - 1);
          filtered = filtered.filter(material => new Date(material.updatedAt) >= startDate);
          break;
        case 'year':
          startDate = new Date(now);
          startDate.setFullYear(startDate.getFullYear() - 1);
          filtered = filtered.filter(material => new Date(material.updatedAt) >= startDate);
          break;
      }
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(material => 
        material.title.toLowerCase().includes(query) ||
        (material.description?.toLowerCase().includes(query)) ||
        material.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredMaterials(filtered);
  }, [materials, searchQuery, selectedSubject, activeTab, selectedDateRange]);

  const getSubjectName = (id?: string): string => {
    if (!id) return 'Geral';
    const subject = subjects.find(s => s.id === id);
    return subject ? subject.name : 'Disciplina não encontrada';
  };
  
  const getMaterialTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText size={36} className="text-blue-500" />;
      case 'video':
        return <Video size={36} className="text-red-500" />;
      case 'link':
        return <LinkIcon size={36} className="text-edu-blue-500" />;
      case 'image':
        return <Image size={36} className="text-purple-500" />;
      default:
        return <File size={36} className="text-gray-500" />;
    }
  };

  const getMaterialTypeLabel = (type: string): string => {
    switch (type) {
      case 'document': return 'Documento';
      case 'video': return 'Vídeo';
      case 'link': return 'Link';
      case 'image': return 'Imagem';
      default: return 'Outro';
    }
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const handleOpenMaterial = (material: Material) => {
    // For videos with thumbnails, open the video preview modal
    if (material.type === 'video' && material.url) {
      setSelectedVideo(material);
      setVideoPreviewOpen(true);
      return;
    }

    // For other materials, open the URL if available
    if (material.url) {
      window.open(material.url, '_blank');
    } else {
      toast({
        title: "Link não disponível",
        description: "Este material não possui uma URL disponível.",
        variant: "destructive",
      });
    }
  };
  
  // Navigate to material detail page
  const handleViewDetail = (material: Material) => {
    navigate(`/materiais/${material.id}`);
  };

  const materialFilterGroups: FilterGroup[] = [
    {
      id: 'subject',
      label: 'Disciplina',
      value: selectedSubject,
      onChange: setSelectedSubject,
      options: [
        { label: 'Todas as Disciplinas', value: 'all' },
        ...subjects.map(subject => ({
          label: subject.name,
          value: subject.id
        }))
      ]
    },
    {
      id: 'dateRange',
      label: 'Período',
      value: selectedDateRange,
      onChange: setSelectedDateRange,
      options: [
        { label: 'Qualquer período', value: 'all' },
        { label: 'Hoje', value: 'today' },
        { label: 'Últimos 7 dias', value: 'week' },
        { label: 'Último mês', value: 'month' },
        { label: 'Último ano', value: 'year' }
      ]
    }
  ];

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSubject('all');
    setSelectedDateRange('all');
    setActiveTab('all');
  };

  // Handler for creating a new material
  const handleCreateMaterial = () => {
    if (materialsModalsRef.current) {
      materialsModalsRef.current.handleCreateMaterial();
    }
  };

  // Render the material card content based on type
  const renderMaterialContent = (material: Material) => {
    if (material.type === 'video' && material.thumbnailUrl) {
      return (
        <VideoThumbnail 
          thumbnailUrl={material.thumbnailUrl}
          title={material.title}
          onClick={() => handleOpenMaterial(material)}
          className="mb-3"
        />
      );
    }

    // For non-video materials or videos without thumbnails, show description
    return material.description ? (
      <p className="text-sm text-edu-gray-600 mb-3 line-clamp-2">
        {material.description}
      </p>
    ) : null;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <SectionHeader
        title="Materiais"
        description="Biblioteca de recursos educacionais"
        icon={FolderOpen}
        actionLabel="Adicionar Material"
        onAction={handleCreateMaterial}
      />
      
      {/* Filters */}
      <AdvancedFilter
        filterGroups={materialFilterGroups}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Pesquisar materiais por título ou tags..."
        onClearFilters={clearFilters}
      />
      
      {/* Material Types Tabs */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-4"
      >
        <TabsList className="bg-white border">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-edu-blue-600 data-[state=active]:text-white"
          >
            <FolderOpen size={16} className="mr-2" />
            Todos
          </TabsTrigger>
          <TabsTrigger 
            value="document" 
            className="data-[state=active]:bg-edu-blue-600 data-[state=active]:text-white"
          >
            <FileText size={16} className="mr-2" />
            Documentos
          </TabsTrigger>
          <TabsTrigger 
            value="video" 
            className="data-[state=active]:bg-edu-blue-600 data-[state=active]:text-white"
          >
            <Video size={16} className="mr-2" />
            Vídeos
          </TabsTrigger>
          <TabsTrigger 
            value="link" 
            className="data-[state=active]:bg-edu-blue-600 data-[state=active]:text-white"
          >
            <LinkIcon size={16} className="mr-2" />
            Links
          </TabsTrigger>
          <TabsTrigger 
            value="image" 
            className="data-[state=active]:bg-edu-blue-600 data-[state=active]:text-white"
          >
            <Image size={16} className="mr-2" />
            Imagens
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded bg-gray-200"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredMaterials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material) => (
                <Card key={material.id} className="card-hover overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-3">
                      {getMaterialTypeIcon(material.type)}
                      <div>
                        <CardTitle className="text-lg">{material.title}</CardTitle>
                        <div className="text-sm text-edu-gray-500">
                          {getSubjectName(material.subjectId)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {renderMaterialContent(material)}
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {material.tags.slice(0, 4).map((tag, i) => (
                        <Badge key={i} variant="outline" className="bg-edu-blue-50">
                          {tag}
                        </Badge>
                      ))}
                      {material.tags.length > 4 && (
                        <Badge variant="outline" className="bg-gray-50">
                          +{material.tags.length - 4}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between pt-2 border-t">
                    <div className="text-xs text-edu-gray-500">
                      Atualizado em {formatDate(material.updatedAt)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewDetail(material)}
                        className="text-edu-blue-600 hover:text-edu-blue-700 hover:bg-edu-blue-50"
                      >
                        Detalhes
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-edu-blue-600 hover:text-edu-blue-700 hover:bg-edu-blue-50"
                        onClick={() => materialsModalsRef.current?.handleEditMaterial(material)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => materialsModalsRef.current?.handleDeleteMaterial(material)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <FolderOpen className="mx-auto text-gray-400" size={48} />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum material encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || selectedSubject !== 'all' || activeTab !== 'all'
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Adicione seu primeiro material à biblioteca.'}
              </p>
              <Button
                className="mt-4 bg-edu-blue-600 hover:bg-edu-blue-700"
                onClick={handleCreateMaterial}
              >
                <PlusSquare className="mr-2" size={16} />
                Adicionar Material
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Video Preview Modal */}
      <Dialog open={videoPreviewOpen} onOpenChange={setVideoPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
          </DialogHeader>
          {selectedVideo && selectedVideo.url && (
            <div className="space-y-4">
              <VideoEmbed url={selectedVideo.url} title={selectedVideo.title} />
              
              {selectedVideo.description && (
                <div className="text-sm text-gray-700">
                  {selectedVideo.description}
                </div>
              )}
              
              {selectedVideo.tags && selectedVideo.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedVideo.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="bg-edu-blue-50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modals */}
      <MaterialsModals
        ref={materialsModalsRef}
        subjects={subjects} 
        refreshData={fetchData} 
      />
    </div>
  );
};

export default Materials;
