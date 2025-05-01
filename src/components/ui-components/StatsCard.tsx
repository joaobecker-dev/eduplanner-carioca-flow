
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  description?: string;
  icon?: LucideIcon;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
  isLoading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  description,
  icon: Icon,
  color = 'blue',
  isLoading = false
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'bg-green-100 text-green-600';
      case 'orange':
        return 'bg-edu-orange-100 text-edu-orange-600';
      case 'purple':
        return 'bg-purple-100 text-purple-600';
      case 'red':
        return 'bg-red-100 text-red-600';
      case 'blue':
      default:
        return 'bg-edu-blue-100 text-edu-blue-600';
    }
  };

  return (
    <Card className="overflow-hidden card-hover">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-edu-gray-500">{title}</p>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-2"></div>
            ) : (
              <p className="text-2xl font-bold mt-2">{value}</p>
            )}
            {subtitle && (
              <p className="text-xs text-edu-gray-500 mt-1">{subtitle}</p>
            )}
            {description && !subtitle && (
              <p className="text-xs text-edu-gray-500 mt-1">{description}</p>
            )}
          </div>
          {Icon && (
            <div className={`p-3 rounded-full ${getColorClasses()}`}>
              <Icon size={24} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
