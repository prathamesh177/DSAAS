import React from 'react';
import { BarChart2, LineChart, PieChart } from 'lucide-react';

interface ChartTypeSelectorProps {
  selectedType: 'bar' | 'line' | 'pie';
  onChange: (type: 'bar' | 'line' | 'pie') => void;
}

const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({ selectedType, onChange }) => {
  return (
    <div className="flex space-x-2">
      <button
        className={`flex-1 p-3 rounded-md flex flex-col items-center justify-center ${
          selectedType === 'bar'
            ? 'bg-blue-50 border-2 border-blue-500 text-blue-700'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
        onClick={() => onChange('bar')}
      >
        <BarChart2 className="h-6 w-6 mb-1" />
        <span className="text-xs">Bar</span>
      </button>
      <button
        className={`flex-1 p-3 rounded-md flex flex-col items-center justify-center ${
          selectedType === 'line'
            ? 'bg-blue-50 border-2 border-blue-500 text-blue-700'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
        onClick={() => onChange('line')}
      >
        <LineChart className="h-6 w-6 mb-1" />
        <span className="text-xs">Line</span>
      </button>
      <button
        className={`flex-1 p-3 rounded-md flex flex-col items-center justify-center ${
          selectedType === 'pie'
            ? 'bg-blue-50 border-2 border-blue-500 text-blue-700'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
        onClick={() => onChange('pie')}
      >
        <PieChart className="h-6 w-6 mb-1" />
        <span className="text-xs">Pie</span>
      </button>
    </div>
  );
};

export default ChartTypeSelector;