
import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  icon: LucideIcon;
  iconColor: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  iconColor,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={cn("p-2 rounded-lg", iconColor)}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
          </div>
        </div>
      </div>
      {change && (
      <div className="flex items-center mt-4">
        {trend === 'up' ? (
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
        )}
        <span
          className={cn(
            "text-sm font-medium",
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          )}
        >
          {change}
        </span>
          <span className="text-sm text-slate-500 ml-1">vs last week</span>
        </div>
      )}
    </div>
  );
};

export default KPICard;
