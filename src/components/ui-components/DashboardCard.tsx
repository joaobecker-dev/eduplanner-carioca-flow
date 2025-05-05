
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  icon?: LucideIcon;
  count?: number;
  actionLabel?: string;
  onAction?: () => void;
  color?: 'blue' | 'green' | 'orange' | 'purple';
  items?: string[];
  children?: React.ReactNode;
  description?: string;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  icon: Icon,
  count,
  actionLabel,
  onAction,
  color = 'blue',
  items = [],
  children,
  description,
  className = ''
}) => {
  const getHeaderColors = () => {
    switch (color) {
      case 'green':
        return 'bg-green-100 border-green-200';
      case 'orange':
        return 'bg-edu-orange-100 border-edu-orange-200';
      case 'purple':
        return 'bg-purple-100 border-purple-200';
      case 'blue':
      default:
        return 'bg-edu-blue-100 border-edu-blue-200';
    }
  };

  const getIconColor = () => {
    switch (color) {
      case 'green':
        return 'text-green-600';
      case 'orange':
        return 'text-edu-orange-600';
      case 'purple':
        return 'text-purple-600';
      case 'blue':
      default:
        return 'text-edu-blue-600';
    }
  };

  const getButtonColor = () => {
    switch (color) {
      case 'green':
        return 'bg-green-600 hover:bg-green-700';
      case 'orange':
        return 'bg-edu-orange-500 hover:bg-edu-orange-600';
      case 'purple':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'blue':
      default:
        return 'bg-edu-blue-600 hover:bg-edu-blue-700';
    }
  };

  return (
    <Card className={`overflow-hidden card-hover border-t-4 border-t-edu-blue-500 ${className}`}>
      <CardHeader className={`${getHeaderColors()} pb-2`}>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {description && <div className="text-sm text-edu-gray-500">{description}</div>}
          </div>
          {Icon && (
            <div className={getIconColor()}>
              <Icon size={20} />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        {count !== undefined && <div className="text-3xl font-bold mb-2">{count}</div>}
        {items && items.length > 0 && (
          <div className="space-y-1 mt-3">
            {items.slice(0, 3).map((item, index) => (
              <div key={index} className="text-sm truncate text-edu-gray-600">{item}</div>
            ))}
            {items.length > 3 && (
              <div className="text-xs text-edu-gray-500">+ {items.length - 3} mais</div>
            )}
          </div>
        )}
        {children}
      </CardContent>
      
      {actionLabel && onAction && (
        <CardFooter className="border-t pt-3 pb-3">
          <Button 
            onClick={onAction} 
            className={`w-full ${getButtonColor()}`}
            size="sm"
          >
            {actionLabel}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default DashboardCard;
