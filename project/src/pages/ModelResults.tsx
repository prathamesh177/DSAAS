import React, { useState } from 'react';
import { 
  Download, Share2, BarChart2, PieChart, LineChart, TrendingUp, 
  Check, Award, Users
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import FeatureImportanceChart from '../components/results/FeatureImportanceChart';
import MetricCard from '../components/results/MetricCard';
import PredictionTable from '../components/results/PredictionTable';
import InsightCard from '../components/results/InsightCard';

const ModelResults: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'predictions' | 'insights'>('overview');

  // Read model results from localStorage
  let modelResults: any = null;
  try {
    modelResults = JSON.parse(localStorage.getItem('modelResults') || 'null');
  } catch {}

  const modelType = modelResults?.modelType;
  const stats = modelResults?.stats || {};
  const predictions = modelResults?.predictions || [];
  const processedData = modelResults?.processedData || [];
  const targetColumn = modelResults?.targetColumn;
  const selectedFeatures = modelResults?.selectedFeatures || [];
  const targetMap: string[] = modelResults?.targetMap || [];

  // Helper: Render class mapping and distribution
  const renderClassMapping = () => {
    if (modelType !== 'classification' || !targetMap || targetMap.length === 0) return null;
    // Class distribution
    const classCounts: Record<string, number> = {};
    processedData.forEach((row: any) => {
      for (let i = 0; i < targetMap.length; i++) {
        if (row[`__target__${targetMap[i]}`] === 1) {
          classCounts[targetMap[i]] = (classCounts[targetMap[i]] || 0) + 1;
        }
      }
    });
    return (
      <div className="mb-4">
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-3 mb-2">
          <b>Class Mapping:</b> The following classes were detected and one-hot encoded:<br />
          {targetMap.map((label, idx) => (
            <span key={label} className="inline-block mr-4">{label} <span className="text-xs text-gray-500">→ __target__{label}</span></span>
          ))}
        </div>
        <div className="bg-gray-50 border border-gray-200 text-gray-700 rounded-lg p-3">
          <b>Class Distribution:</b>
          <ul className="list-disc pl-5 mt-1">
            {targetMap.map((label) => (
              <li key={label}>{label}: {classCounts[label] || 0} rows</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  // Helper: Render metrics based on model type
  const renderMetrics = () => {
    if (modelType === 'regression') {
      return (
        <>
          <MetricCard
            title="R² Score"
            value={
              typeof stats.r2 === 'number' && !isNaN(stats.r2)
                ? (stats.r2 * 100).toFixed(2) + '%'
                : 'N/A'
            }
            icon={<Check className="h-6 w-6 text-green-500" />}
            description="Explained variance (higher is better)"
            color="green"
          />
          <MetricCard
            title="Mean Absolute Error"
            value={
              typeof stats.mae === 'number' && !isNaN(stats.mae)
                ? stats.mae.toFixed(2)
                : 'N/A'
            }
            icon={<TrendingUp className="h-6 w-6 text-blue-500" />}
            description="Average absolute difference between predicted and actual values"
            color="blue"
          />
        </>
      );
    }
    if (modelType === 'classification') {
      return (
        <>
          <MetricCard
            title="Accuracy"
            value={
              typeof stats.accuracy === 'number' && !isNaN(stats.accuracy)
                ? (stats.accuracy * 100).toFixed(2) + '%'
                : 'N/A'
            }
            icon={<Check className="h-6 w-6 text-green-500" />}
            description="How often the model makes correct predictions"
            color="green"
          />
          <MetricCard
            title="Majority Class"
            value={stats.majorityClass || 'N/A'}
            icon={<Award className="h-6 w-6 text-purple-500" />}
            description="Most frequent class in the data"
            color="purple"
          />
        </>
      );
    }
    return null;
  };

  // Helper: Render predictions table
  const renderPredictionsTable = () => {
    if (!processedData.length || !predictions.length || !targetColumn) return <div>No predictions available.</div>;
    return (
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              {selectedFeatures.map((col: string) => (
                <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col}</th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Predicted</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {processedData.slice(0, 20).map((row: any, i: number) => {
              // For classification with one-hot target, get actual label
              let actual = row[targetColumn];
              if (modelType === 'classification' && targetMap && targetMap.length > 0) {
                for (let j = 0; j < targetMap.length; j++) {
                  if (row[`__target__${targetMap[j]}`] === 1) actual = targetMap[j];
                }
              }
              return (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{i + 1}</td>
                  {selectedFeatures.map((col: string) => (
                    <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row[col]}</td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{actual}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 font-medium">{predictions[i]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {processedData.length > 20 && (
          <div className="text-center py-3 bg-gray-50 text-sm text-gray-500 border-t border-gray-200">
            Showing 20 of {processedData.length} rows
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Model Results</h1>
          <p className="text-gray-600 mt-1">
            {modelType ? `Model Type: ${modelType}` : 'No model type'}
            {targetColumn ? ` • Target: ${targetColumn}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" /> Download
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button>
          <Button variant="primary" size="sm" as="a" href="/dashboard">
            Save to Dashboard
          </Button>
        </div>
      </div>

      {/* Model Performance Summary */}
      {modelType === 'classification' && renderClassMapping()}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderMetrics()}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-4 font-medium ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-6 py-4 font-medium ${
              activeTab === 'predictions'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('predictions')}
          >
            Predictions
          </button>
          <button
            className={`px-6 py-4 font-medium ${
              activeTab === 'insights'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('insights')}
          >
            Insights
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Model Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderMetrics()}
                </div>
                {modelType === 'classification' && renderClassMapping()}
              </div>
            </div>
          )}

          {activeTab === 'predictions' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                <h3 className="text-lg font-medium text-gray-900">Model Predictions</h3>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" /> Export CSV
                </Button>
              </div>
              {renderPredictionsTable()}
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Automatic Insights</h3>
                <p className="text-gray-600 mb-6">
                  Our AI has analyzed your model and data to find these key insights.
                </p>
                {/* You can add more dynamic insights here based on stats */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelResults;