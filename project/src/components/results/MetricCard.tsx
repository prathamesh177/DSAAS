import React, { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  description: string;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, description, color }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 border-blue-200';
      case 'green':
        return 'bg-green-50 border-green-200';
      case 'purple':
        return 'bg-purple-50 border-purple-200';
      case 'yellow':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`rounded-xl border ${getColorClasses()} p-6`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">{icon}</div>
        <div>
          <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;