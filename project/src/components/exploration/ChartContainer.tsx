import React from 'react';
import { X } from 'lucide-react';
import Card from '../ui/Card';

interface ChartContainerProps {
  chartId: string;
  chartType: 'bar' | 'line' | 'pie' | 'scatter';
  columns: string[];
  data: any[];
  onRemove: () => void;
  description: string;
}

// Helper: group by category and aggregate numeric
function groupByCategoryMean(data: any[], categoryCol: string, valueCol: string) {
  const groups: Record<string, { sum: number; count: number }> = {};
  data.forEach(row => {
    const cat = row[categoryCol];
    const val = parseFloat(row[valueCol]);
    if (!isNaN(val)) {
      if (!groups[cat]) groups[cat] = { sum: 0, count: 0 };
      groups[cat].sum += val;
      groups[cat].count += 1;
    }
  });
  return Object.entries(groups).map(([cat, { sum, count }]) => ({
    category: cat,
    value: sum / count
  }));
}

// Helper: count per category
function countPerCategory(data: any[], categoryCol: string) {
  const counts: Record<string, number> = {};
  data.forEach(row => {
    const cat = row[categoryCol];
    counts[cat] = (counts[cat] || 0) + 1;
  });
  return Object.entries(counts).map(([cat, count]) => ({ category: cat, value: count }));
}

// Helper: time series (date+numeric)
function timeSeries(data: any[], dateCol: string, valueCol: string) {
  // Sort by date
  const sorted = [...data].sort((a, b) => new Date(a[dateCol]).getTime() - new Date(b[dateCol]).getTime());
  return sorted.map(row => ({ x: row[dateCol], y: parseFloat(row[valueCol]) }));
}

// Helper: scatter/correlation (numeric+numeric)
function scatterData(data: any[], colX: string, colY: string) {
  return data.map(row => ({ x: parseFloat(row[colX]), y: parseFloat(row[colY]) }));
}

const ChartContainer: React.FC<ChartContainerProps> = ({ 
  chartId, 
  chartType, 
  columns, 
  data, 
  onRemove,
  description
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

  const chartHeight = 200;
  const chartWidth = 400;

  const renderChart = () => {
    if (chartType === 'bar' && columns.length === 2) {
      // Bar: group by first col (cat), aggregate second (num) by mean
      const grouped = groupByCategoryMean(data, columns[0], columns[1]);
      const barWidth = chartWidth / grouped.length;
      const maxValue = Math.max(...grouped.map(d => d.value), 1);
      return (
        <svg width="100%" height={chartHeight} className="overflow-visible">
          {grouped.map((item, i) => {
            const height = (item.value / maxValue) * (chartHeight - 30);
            return (
              <g key={item.category} transform={`translate(${i * barWidth + 40}, 0)`}>
                <rect
                  x={0}
                  y={chartHeight - height}
                  width={barWidth - 8}
                  height={height}
                  fill={getRandomColor(i)}
                />
                <text x={barWidth / 2 - 8} y={chartHeight - 5} textAnchor="middle" fontSize="10">{item.category}</text>
              </g>
            );
          })}
          {/* X-axis */}
          <line x1="40" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#9CA3AF" strokeWidth="1" />
          {/* Y-axis */}
          <line x1="40" y1="0" x2="40" y2={chartHeight} stroke="#9CA3AF" strokeWidth="1" />
        </svg>
      );
    }
    if (chartType === 'pie' && columns.length === 1) {
      // Pie: count per category
      const grouped = countPerCategory(data, columns[0]);
      const total = grouped.reduce((acc, d) => acc + d.value, 0);
      const centerX = chartWidth / 2;
      const centerY = chartHeight / 2;
      const radius = Math.min(centerX, centerY) - 10;
      let startAngle = 0;
      return (
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}> 
          <g transform={`translate(${centerX}, ${centerY})`}>
            {grouped.map((item, i) => {
              const angle = (item.value / total) * 2 * Math.PI;
              const endAngle = startAngle + angle;
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
                <path key={i} d={pathData} fill={getRandomColor(i)} />
              );
              startAngle = endAngle;
              return slice;
            })}
          </g>
        </svg>
      );
    }
    if (chartType === 'line' && columns.length === 2) {
      // If first col is date, plot time series; else, scatter/correlation
      const isDate = !isNaN(Date.parse(data[0]?.[columns[0]]));
      if (isDate) {
        const points = timeSeries(data, columns[0], columns[1]);
        const maxY = Math.max(...points.map(p => p.y), 1);
        return (
          <svg width="100%" height={chartHeight} className="overflow-visible">
            <polyline
              points={points.map((p, i) => {
                const x = (i / (points.length - 1)) * (chartWidth - 60) + 40;
                const y = chartHeight - (p.y / maxY) * (chartHeight - 30);
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke={getRandomColor(0)}
              strokeWidth="2"
            />
            {/* X-axis */}
            <line x1="40" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#9CA3AF" strokeWidth="1" />
            {/* Y-axis */}
            <line x1="40" y1="0" x2="40" y2={chartHeight} stroke="#9CA3AF" strokeWidth="1" />
          </svg>
        );
      } else {
        // Scatter/correlation
        const points = scatterData(data, columns[0], columns[1]);
        const maxX = Math.max(...points.map(p => p.x), 1);
        const maxY = Math.max(...points.map(p => p.y), 1);
        return (
          <svg width="100%" height={chartHeight} className="overflow-visible">
            {points.map((p, i) => {
              const x = 40 + (p.x / maxX) * (chartWidth - 60);
              const y = chartHeight - (p.y / maxY) * (chartHeight - 30);
              return <circle key={i} cx={x} cy={y} r={3} fill={getRandomColor(0)} />;
            })}
            {/* X-axis */}
            <line x1="40" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#9CA3AF" strokeWidth="1" />
            {/* Y-axis */}
            <line x1="40" y1="0" x2="40" y2={chartHeight} stroke="#9CA3AF" strokeWidth="1" />
          </svg>
        );
      }
    }
    if (chartType === 'scatter' && columns.length === 2) {
      // Scatter plot for two numeric columns
      const points = scatterData(data, columns[0], columns[1]);
      const maxX = Math.max(...points.map(p => p.x), 1);
      const maxY = Math.max(...points.map(p => p.y), 1);
      return (
        <svg width="100%" height={chartHeight} className="overflow-visible">
          {points.map((p, i) => {
            const x = 40 + (p.x / maxX) * (chartWidth - 60);
            const y = chartHeight - (p.y / maxY) * (chartHeight - 30);
            return <circle key={i} cx={x} cy={y} r={3} fill={getRandomColor(0)} />;
          })}
          {/* X-axis */}
          <line x1="40" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#9CA3AF" strokeWidth="1" />
          {/* Y-axis */}
          <line x1="40" y1="0" x2="40" y2={chartHeight} stroke="#9CA3AF" strokeWidth="1" />
        </svg>
      );
    }
    return null;
  };

  return (
    <Card className="overflow-visible">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-medium text-gray-900">
              {chartType === 'bar' ? 'Bar Chart' : chartType === 'line' ? 'Line Chart' : chartType === 'pie' ? 'Pie Chart' : 'Scatter Plot'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
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