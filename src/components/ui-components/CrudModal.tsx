
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader } from 'lucide-react';

interface CrudModalProps {
  title: string;
  description?: string;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const CrudModal: React.FC<CrudModalProps> = ({
  title,
  description,
  isOpen,
  isLoading = false,
  onClose,
  onSubmit,
  children,
  submitLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  size = 'md',
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'max-w-sm';
      case 'md': return 'max-w-md';
      case 'lg': return 'max-w-lg';
      case 'xl': return 'max-w-xl';
      default: return 'max-w-md';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${getSizeClass()} max-h-[90vh] overflow-y-auto`}>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <div className="py-4">
            {children}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CrudModal;
