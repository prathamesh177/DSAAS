import React from 'react';
import { Check, HelpCircle } from 'lucide-react';

interface FeatureSelectorProps {
  columns: string[];
  selectedFeatures: string[];
  onToggleFeature: (feature: string) => void;
}

const FeatureSelector: React.FC<FeatureSelectorProps> = ({
  columns,
  selectedFeatures,
  onToggleFeature,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Select the columns you want to use as features for your model.
        </p>
        <button 
          className="text-blue-600 text-sm font-medium"
          onClick={() => columns.forEach(col => {
            if (!selectedFeatures.includes(col)) {
              onToggleFeature(col);
            }
          })}
        >
          Select All
        </button>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-800 mb-6 text-sm">
        <div className="flex">
          <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>
            Features are the input variables that will be used to make predictions. Choose columns
            that you think might influence the outcome you want to predict.
          </p>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-lg divide-y">
        {columns.map((column) => (
          <div
            key={column}
            className={`p-4 cursor-pointer transition-all ${
              selectedFeatures.includes(column) ? 'bg-blue-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => onToggleFeature(column)}
          >
            <div className="flex items-start">
              <div className={`w-5 h-5 mr-3 rounded flex items-center justify-center ${
                selectedFeatures.includes(column) 
                  ? 'bg-blue-500 text-white' 
                  : 'border border-gray-300'
              }`}>
                {selectedFeatures.includes(column) && <Check className="h-3 w-3" />}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{column}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Type: Number
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-sm text-gray-500">
        Selected {selectedFeatures.length} of {columns.length} columns
      </div>
    </div>
  );
};

export default FeatureSelector;