
import React from 'react';
import { cn } from '@/lib/utils';

interface FormSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ 
  title, 
  children, 
  className 
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <h3 className="text-lg font-medium">{title}</h3>
      )}
      {children}
    </div>
  );
};

export default FormSection;
