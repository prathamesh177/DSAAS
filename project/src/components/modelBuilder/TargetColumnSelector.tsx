import React from 'react';
import { Check } from 'lucide-react';

interface TargetColumnSelectorProps {
  columns: string[];
  selectedColumn: string;
  onSelectColumn: (column: string) => void;
  modelType: string;
}

const TargetColumnSelector: React.FC<TargetColumnSelectorProps> = ({
  columns,
  selectedColumn,
  onSelectColumn,
  modelType,
}) => {
  return (
    <div className="space-y-4">
      {modelType === 'clustering' ? (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-800 mb-6">
          <p>
            <span className="font-medium">Note:</span> For clustering, you don't need to select a target column.
            We'll find patterns across all columns automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {columns.map((column) => (
            <div
              key={column}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedColumn === column
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/30'
              }`}
              onClick={() => onSelectColumn(column)}
            >
              <div className="flex items-start">
                <div className={`w-5 h-5 mr-3 rounded-full flex items-center justify-center ${
                  selectedColumn === column ? 'bg-blue-500' : 'border-2 border-gray-300'
                }`}>
                  {selectedColumn === column && <Check className="h-3 w-3 text-white" />}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{column}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {modelType === 'regression' 
                      ? 'Predict this numeric value' 
                      : 'Classify into these categories'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TargetColumnSelector;