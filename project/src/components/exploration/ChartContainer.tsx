import React from 'react';
import { X } from 'lucide-react';
import Card from '../ui/Card';

interface ChartContainerProps {
  chartId: string;
  chartType: 'bar' | 'line' | 'pie';
  columns: string[];
  data: any[];
  onRemove: () => void;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ 
  chartId, 
  chartType, 
  columns, 
  data, 
  onRemove 
}) => {
  const getRandomColor = (index: number) => {
    const colors = [
      '#3B82F6', // blue
      '#10B981', // green
      '#F59E0B', // yellow
      '#EF4444', // red
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#06B6D4', // cyan
      '#F97316', // orange
    ];
    return colors[index % colors.length];
  };

  const renderChart = () => {
    // This is a simplified chart rendering for demonstration
    // In a real application, you'd use a charting library like Chart.js or Recharts
    
    const chartHeight = 200;
    const chartWidth = 400;
    
    if (chartType === 'bar') {
      const barWidth = chartWidth / (data.length * columns.length);
      
      return (
        <svg width="100%" height={chartHeight} className="overflow-visible">
          {data.map((item, dataIndex) => (
            <g key={dataIndex} transform={`translate(${dataIndex * (barWidth * columns.length) + 40}, 0)`}>
              {columns.map((column, colIndex) => {
                const value = parseFloat(item[column]);
                const height = isNaN(value) ? 0 : (value / 100) * chartHeight;
                
                return (
                  <rect
                    key={column}
                    x={colIndex * barWidth}
                    y={chartHeight - height}
                    width={barWidth - 4}
                    height={height}
                    fill={getRandomColor(colIndex)}
                  />
                );
              })}
            </g>
          ))}
          
          {/* X-axis */}
          <line 
            x1="40" 
            y1={chartHeight} 
            x2={chartWidth} 
            y2={chartHeight} 
            stroke="#9CA3AF" 
            strokeWidth="1" 
          />
          
          {/* Y-axis */}
          <line 
            x1="40" 
            y1="0" 
            x2="40" 
            y2={chartHeight} 
            stroke="#9CA3AF" 
            strokeWidth="1" 
          />
        </svg>
      );
    }
    
    if (chartType === 'line') {
      return (
        <svg width="100%" height={chartHeight} className="overflow-visible">
          {columns.map((column, colIndex) => {
            const points = data.map((item, i) => {
              const x = (i / (data.length - 1)) * chartWidth + 40;
              const value = parseFloat(item[column]);
              const y = isNaN(value) ? 0 : chartHeight - (value / 100) * chartHeight;
              return `${x},${y}`;
            }).join(' ');
            
            return (
              <polyline
                key={column}
                points={points}
                fill="none"
                stroke={getRandomColor(colIndex)}
                strokeWidth="2"
              />
            );
          })}
          
          {/* X-axis */}
          <line 
            x1="40" 
            y1={chartHeight} 
            x2={chartWidth + 40} 
            y2={chartHeight} 
            stroke="#9CA3AF" 
            strokeWidth="1" 
          />
          
          {/* Y-axis */}
          <line 
            x1="40" 
            y1="0" 
            x2="40" 
            y2={chartHeight} 
            stroke="#9CA3AF" 
            strokeWidth="1" 
          />
        </svg>
      );
    }
    
    if (chartType === 'pie') {
      // Simplified pie chart
      const centerX = chartWidth / 2;
      const centerY = chartHeight / 2;
      const radius = Math.min(centerX, centerY) - 10;
      
      let total = 0;
      const values = columns.map(column => {
        const sum = data.reduce((acc, item) => {
          const value = parseFloat(item[column]);
          return acc + (isNaN(value) ? 0 : value);
        }, 0);
        total += sum;
        return sum;
      });
      
      let startAngle = 0;
      
      return (
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          <g transform={`translate(${centerX}, ${centerY})`}>
            {values.map((value, index) => {
              const angle = (value / total) * 2 * Math.PI;
              const endAngle = startAngle + angle;
              
              // Calculate the SVG arc path
              const x1 = radius * Math.cos(startAngle);
              const y1 = radius * Math.sin(startAngle);
              const x2 = radius * Math.cos(endAngle);
              const y2 = radius * Math.sin(endAngle);
              
              const largeArcFlag = angle > Math.PI ? 1 : 0;
              
              const pathData = [
                `M 0 0`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `Z`
              ].join(' ');
              
              const slice = (
                <path
                  key={index}
                  d={pathData}
                  fill={getRandomColor(index)}
                />
              );
              
              startAngle = endAngle;
              return slice;
            })}
          </g>
        </svg>
      );
    }
    
    return null;
  };

  return (
    <Card className="overflow-visible">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-900">
            {chartType === 'bar' ? 'Bar Chart' : chartType === 'line' ? 'Line Chart' : 'Pie Chart'}
          </h3>
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="mt-2">
          {renderChart()}
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {columns.map((column, index) => (
            <div 
              key={column} 
              className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs"
            >
              <div 
                className="w-3 h-3 rounded-sm mr-1" 
                style={{ backgroundColor: getRandomColor(index) }}
              />
              {column}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ChartContainer;