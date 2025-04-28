import React from 'react';

const FeatureImportanceChart: React.FC = () => {
  const features = [
    { name: 'Marketing Spend', importance: 0.85 },
    { name: 'Seasonality', importance: 0.72 },
    { name: 'Product Price', importance: 0.65 },
    { name: 'Customer Age', importance: 0.48 },
    { name: 'Website Traffic', importance: 0.41 },
    { name: 'Region', importance: 0.35 },
  ];

  return (
    <div className="space-y-4">
      {features.map((feature) => (
        <div key={feature.name} className="space-y-1">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">{feature.name}</span>
            <span className="text-gray-500">{(feature.importance * 100).toFixed(0)}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${feature.importance * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureImportanceChart;