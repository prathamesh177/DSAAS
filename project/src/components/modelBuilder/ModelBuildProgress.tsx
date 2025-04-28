import React from 'react';

interface ModelBuildProgressProps {
  progress: number;
}

const ModelBuildProgress: React.FC<ModelBuildProgressProps> = ({ progress }) => {
  const steps = [
    { name: 'Data preparation', percentage: 20 },
    { name: 'Algorithm selection', percentage: 40 },
    { name: 'Model training', percentage: 70 },
    { name: 'Evaluation', percentage: 90 },
    { name: 'Finalization', percentage: 100 },
  ];

  const currentStep = steps.find(step => progress <= step.percentage) || steps[steps.length - 1];
  const currentStepIndex = steps.indexOf(currentStep);

  return (
    <div className="space-y-6">
      <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-500 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="relative">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="flex-1 text-center" 
            >
              <div 
                className={`w-5 h-5 rounded-full mx-auto mb-1 flex items-center justify-center
                  ${index <= currentStepIndex ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                {index < currentStepIndex && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="text-xs font-medium text-gray-500">{step.name}</div>
            </div>
          ))}
        </div>
        
        <div className="absolute top-2.5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
          <div 
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <h3 className="font-medium text-gray-900 mb-2">Currently testing:</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Random Forest</span>
            <span className="text-sm font-medium text-blue-700">87% accuracy</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Gradient Boosting</span>
            <span className="text-sm font-medium text-blue-700">91% accuracy</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Neural Network</span>
            <span className="text-sm font-medium text-blue-700">Running...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelBuildProgress;