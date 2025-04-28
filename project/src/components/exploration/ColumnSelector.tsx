import React from 'react';
import { Check } from 'lucide-react';

interface ColumnSelectorProps {
  columns: string[];
  selectedColumns: string[];
  onColumnSelect: (column: string) => void;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({ 
  columns, 
  selectedColumns, 
  onColumnSelect 
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {columns.map((column) => (
        <button
          key={column}
          className={`px-3 py-2 rounded-md text-sm border ${
            selectedColumns.includes(column)
              ? 'bg-blue-50 border-blue-500 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => onColumnSelect(column)}
        >
          <div className="flex items-center">
            <div className={`w-4 h-4 mr-2 rounded-sm flex items-center justify-center ${
              selectedColumns.includes(column) ? 'bg-blue-500' : 'border border-gray-400'
            }`}>
              {selectedColumns.includes(column) && (
                <Check className="h-3 w-3 text-white" />
              )}
            </div>
            {column}
          </div>
        </button>
      ))}
    </div>
  );
};

export default ColumnSelector;