import React, { ReactNode } from 'react';
import Card from '../ui/Card';

interface InsightCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, description, icon }) => {
  return (
    <Card className="overflow-visible">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InsightCard;