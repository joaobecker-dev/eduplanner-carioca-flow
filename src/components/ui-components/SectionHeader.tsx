
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div className="flex items-center">
        {Icon && <Icon className="mr-3 text-edu-blue-600" size={24} />}
        <div>
          <h2 className="text-2xl font-bold text-edu-gray-800">{title}</h2>
          {description && <p className="text-edu-gray-500 mt-1">{description}</p>}
        </div>
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-edu-blue-600 hover:bg-edu-blue-700">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default SectionHeader;
