import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { services } from '@/lib/services';
import { Material } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable } from '@/components/ui/data-table';
import { toast } from "@/hooks/use-toast"

const MaterialsPage: React.FC = () => {
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const queryClient = useQueryClient();
  const { data: materials, isLoading, error } = useQuery({
    queryKey: ['materials'],
    queryFn: services.material.getAll,
  });

  // Fix the createdAt references to use created_at
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const deleteMaterialMutation = useMutation(
    async (id: string) => {
      setIsLoadingDelete(true);
      return services.material.delete(id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['materials']);
        toast({
          title: "Material excluído",
          description: "O material foi excluído com sucesso!",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao excluir o material.",
          variant: "destructive",
        });
      },
      onSettled: () => {
        setIsLoadingDelete(false);
      },
    }
  );

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este material?")) {
      await deleteMaterialMutation.mutateAsync(id);
    }
  };

  // Define columns for the DataTable
  const columns = [
    {
      accessorKey: "title",
      header: "Título",
    },
    {
      accessorKey: "type",
      header: "Tipo",
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => row.original.tags.join(', '),
    },
    {
      accessorKey: "subjectId",
      header: "Disciplina",
    },
    {
      accessorKey: "updated_at",
      header: "Última Atualização",
      cell: ({ row }) => formatDate(row.original.updated_at),
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Link to={`/materiais/${row.original.id}`}>
            <Button variant="ghost" size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
            disabled={isLoadingDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Materiais</h1>
        <Button asChild>
          <Link to="/materiais/novo">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Material
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : error ? (
        <p className="text-red-500">Erro ao carregar materiais.</p>
      ) : (
        <DataTable columns={columns} data={materials || []} />
      )}
    </div>
  );
};

export default MaterialsPage;
