
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { toast } from '@/hooks/use-toast';
import { services } from '@/lib/services';
import { Material, Subject } from '@/types';
import CrudModal from '@/components/ui-components/CrudModal';
import DeleteConfirmationDialog from '@/components/ui-components/DeleteConfirmationDialog';
import MaterialForm from '@/components/forms/MaterialForm';

interface MaterialsModalsProps {
  subjects: Subject[];
  refreshData: () => void;
}

interface MaterialsModalsRef {
  handleCreateMaterial: () => void;
  handleEditMaterial: (material: Material) => void;
  handleDeleteMaterial: (material: Material) => void;
}

const MaterialsModals = forwardRef<MaterialsModalsRef, MaterialsModalsProps>(({
  subjects,
  refreshData
}, ref) => {
  // Modal states
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [isMaterialDeleteOpen, setIsMaterialDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Partial<Material> | null>(null);

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    handleCreateMaterial: () => {
      setSelectedMaterial(null);
      setIsMaterialModalOpen(true);
    },
    handleEditMaterial: (material: Material) => {
      setSelectedMaterial(material);
      setIsMaterialModalOpen(true);
    },
    handleDeleteMaterial: (material: Material) => {
      setSelectedMaterial(material);
      setIsMaterialDeleteOpen(true);
    }
  }));

  const handleMaterialSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (selectedMaterial?.id) {
        // Update existing material
        await services.material.update(selectedMaterial.id, data);
        toast({
          title: "Material atualizado",
          description: "O material foi atualizado com sucesso.",
        });
      } else {
        // Create new material
        await services.material.create(data);
        toast({
          title: "Material criado",
          description: "O material foi criado com sucesso.",
        });
      }
      setIsMaterialModalOpen(false);
      refreshData();
    } catch (error) {
      console.error('Error saving material:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o material.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMaterialDelete = async () => {
    setIsSubmitting(true);
    try {
      if (selectedMaterial?.id) {
        await services.material.delete(selectedMaterial.id);
        toast({
          title: "Material excluído",
          description: "O material foi excluído com sucesso.",
        });
        setIsMaterialDeleteOpen(false);
        refreshData();
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o material.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Material Modal */}
      <CrudModal
        title={selectedMaterial ? "Editar Material" : "Novo Material"}
        description="Preencha os campos para criar ou editar um material."
        isOpen={isMaterialModalOpen}
        isLoading={isSubmitting}
        onClose={() => setIsMaterialModalOpen(false)}
        onSubmit={handleMaterialSubmit}
        submitLabel={selectedMaterial ? "Atualizar" : "Criar"}
      >
        <MaterialForm
          onSubmit={handleMaterialSubmit}
          initialData={selectedMaterial || undefined}
          subjects={subjects}
          isSubmitting={isSubmitting}
        />
      </CrudModal>

      {/* Material Delete Confirmation */}
      <DeleteConfirmationDialog
        isOpen={isMaterialDeleteOpen}
        isLoading={isSubmitting}
        title="Excluir Material"
        description={`Tem certeza que deseja excluir o material "${selectedMaterial?.title}"? Esta ação não pode ser desfeita.`}
        onClose={() => setIsMaterialDeleteOpen(false)}
        onConfirm={handleMaterialDelete}
      />
    </>
  );
});

MaterialsModals.displayName = 'MaterialsModals';

export { 
  MaterialsModals,
  type MaterialsModalsProps 
};
