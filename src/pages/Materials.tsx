
import React, { useState, useEffect } from 'react';
import { 
  FolderOpen, 
  Search, 
  Filter, 
  PlusSquare, 
  FileText, 
  Video, 
  Link as LinkIcon, 
  Image, 
  File 
} from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import SectionHeader from '@/components/ui-components/SectionHeader';
import { Material, Subject } from '@/types';
import { services } from '@/lib/services';

const Materials: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  useEffect(() => {
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
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

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
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(material => 
        material.title.toLowerCase().includes(query) ||
        material.description?.toLowerCase().includes(query) ||
        material.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredMaterials(filtered);
  }, [materials, searchQuery, selectedSubject, activeTab]);

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
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const handleOpenMaterial = (material: Material) => {
    // In a real app, this would open the material or navigate to its detail page
    console.log('Opening material:', material);
    if (material.url) {
      window.open(material.url, '_blank');
    }
  };
  
  const handleCreateNew = () => {
    console.log('Creating new material');
    // navigate('/materiais/novo');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <SectionHeader
        title="Materiais"
        description="Biblioteca de recursos educacionais"
        icon={FolderOpen}
        actionLabel="Adicionar Material"
        onAction={handleCreateNew}
      />
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Pesquisar materiais por título ou tags..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              {selectedSubject === 'all' ? 'Todas as Disciplinas' : getSubjectName(selectedSubject)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filtrar por Disciplina</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={selectedSubject} onValueChange={setSelectedSubject}>
              <DropdownMenuRadioItem value="all">Todas as Disciplinas</DropdownMenuRadioItem>
              {subjects.map((subject) => (
                <DropdownMenuRadioItem key={subject.id} value={subject.id}>
                  {subject.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
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
                    {material.description && (
                      <p className="text-sm text-edu-gray-600 mb-3 line-clamp-2">
                        {material.description}
                      </p>
                    )}
                    
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
                      Adicionado em {formatDate(material.createdAt)}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-edu-blue-600 hover:text-edu-blue-700 hover:bg-edu-blue-50"
                      onClick={() => handleOpenMaterial(material)}
                    >
                      Abrir
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <FolderOpen className="mx-auto text-gray-400" size={48} />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum material encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || selectedSubject !== 'all'
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Adicione seu primeiro material à biblioteca.'}
              </p>
              <Button
                className="mt-4 bg-edu-blue-600 hover:bg-edu-blue-700"
                onClick={handleCreateNew}
              >
                <PlusSquare className="mr-2" size={16} />
                Adicionar Material
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Materials;
