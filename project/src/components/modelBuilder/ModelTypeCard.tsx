import React from 'react';
import { Check } from 'lucide-react';

interface ModelTypeCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  examples: string;
  modelType: string;
  isSelected: boolean;
  onSelect: (type: string) => void;
}

const ModelTypeCard: React.FC<ModelTypeCardProps> = ({
  title,
  icon,
  description,
  examples,
  modelType,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/30'
      }`}
      onClick={() => onSelect(modelType)}
    >
      <div className="flex">
        <div className="mr-4 pt-1">{icon}</div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">{title}</h3>
            {isSelected && <Check className="h-4 w-4 text-blue-600" />}
          </div>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          <p className="text-xs text-gray-500 mt-2">
            <span className="font-medium">Examples:</span> {examples}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModelTypeCard;