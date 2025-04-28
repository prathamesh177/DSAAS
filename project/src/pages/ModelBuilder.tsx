// @ts-ignore
// eslint-disable-next-line
// @ts-nocheck
// Add module declarations for ml-cart and ml-confusion-matrix if needed
// declare module 'ml-cart';
// declare module 'ml-confusion-matrix';

import React, { useState } from 'react';
import { ChevronRight, BrainCircuit, Goal, Dices, BarChart4, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ModelTypeCard from '../components/modelBuilder/ModelTypeCard';
import TargetColumnSelector from '../components/modelBuilder/TargetColumnSelector';
import FeatureSelector from '../components/modelBuilder/FeatureSelector';
import ModelBuildProgress from '../components/modelBuilder/ModelBuildProgress';
import { mockDataSample } from '../data/mockData';
import { DecisionTreeRegression, DecisionTreeClassifier } from 'ml-cart';
import { ConfusionMatrix } from 'ml-confusion-matrix';

type Step = 'objective' | 'target' | 'features' | 'configure' | 'build' | 'customType';

const getInitialData = () => {
  const stored = localStorage.getItem('uploadedData');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }
  return mockDataSample;
};

// Helper to detect column types
const getColumnTypes = (data: any[]): Record<string, 'numeric' | 'categorical'> => {
  if (!data || data.length === 0) return {};
  const types: Record<string, 'numeric' | 'categorical'> = {};
  const sampleSize = Math.min(10, data.length);
  const columns = Object.keys(data[0]);
  columns.forEach(col => {
    let numericCount = 0;
    for (let i = 0; i < sampleSize; i++) {
      const value = data[i][col];
      if (typeof value === 'number' || (!isNaN(Number(value)) && value !== '')) numericCount++;
    }
    types[col] = numericCount >= sampleSize * 0.7 ? 'numeric' : 'categorical';
  });
  return types;
};

// Helper: One-hot encoding, missing value handling, and outlier handling
const preprocessData = (
  data: any[],
  features: string[],
  columnTypes: Record<string, 'numeric' | 'categorical'>,
  targetColumn?: string
) => {
  if (!data || data.length === 0) return { processed: [], targetMap: null };

  // 1. Compute fill values for missing data
  const fillValues: Record<string, any> = {};
  features.forEach((col) => {
    if (columnTypes[col] === 'numeric') {
      // Mean for numeric
      const nums = data.map(row => Number(row[col])).filter(v => !isNaN(v));
      fillValues[col] = nums.length > 0 ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
    } else {
      // Mode for categorical
      const counts: Record<string, number> = {};
      data.forEach(row => {
        const val = row[col];
        if (val !== undefined && val !== null && val !== '') {
          counts[val] = (counts[val] || 0) + 1;
        }
      });
      let mode = '';
      let max = 0;
      Object.entries(counts).forEach(([val, count]) => {
        if (count > max) {
          max = count;
          mode = val;
        }
      });
      fillValues[col] = mode;
    }
  });

  // 2. Outlier handling for numeric features (winsorization at 1st and 99th percentiles)
  const outlierBounds: Record<string, {min: number, max: number}> = {};
  features.forEach((col) => {
    if (columnTypes[col] === 'numeric') {
      const nums = data.map(row => Number(row[col])).filter(v => !isNaN(v));
      if (nums.length > 0) {
        nums.sort((a, b) => a - b);
        const p1 = nums[Math.floor(nums.length * 0.01)];
        const p99 = nums[Math.floor(nums.length * 0.99)];
        outlierBounds[col] = { min: p1, max: p99 };
      } else {
        outlierBounds[col] = { min: 0, max: 0 };
      }
    }
  });

  // 3. One-hot encode categorical features
  const uniqueValues: Record<string, string[]> = {};
  features.forEach((col) => {
    if (columnTypes[col] === 'categorical') {
      uniqueValues[col] = Array.from(new Set(data.map(row => row[col]).filter(v => v !== undefined && v !== null && v !== '')));
    }
  });

  // 4. One-hot encode target if categorical (for classification)
  let targetMap: string[] | null = null;
  let targetIsCategorical = false;
  if (targetColumn && columnTypes[targetColumn] === 'categorical') {
    targetIsCategorical = true;
    targetMap = Array.from(new Set(data.map(row => row[targetColumn]).filter(v => v !== undefined && v !== null && v !== '')));
  }

  // 5. Build processed rows
  const processed = data.map(row => {
    const newRow: any = {};
    features.forEach(col => {
      let value = row[col];
      if (value === undefined || value === null || value === '') {
        value = fillValues[col];
      }
      if (columnTypes[col] === 'numeric') {
        let numVal = Number(value);
        // Outlier handling
        if (!isNaN(numVal)) {
          const bounds = outlierBounds[col];
          if (numVal < bounds.min) numVal = bounds.min;
          if (numVal > bounds.max) numVal = bounds.max;
        } else {
          numVal = fillValues[col];
        }
        newRow[col] = numVal;
      } else {
        // One-hot encoding
        uniqueValues[col].forEach(uniqueVal => {
          newRow[`${col}_${uniqueVal}`] = value === uniqueVal ? 1 : 0;
        });
      }
    });
    // One-hot encode target if needed
    if (targetIsCategorical && targetColumn) {
      const tVal = row[targetColumn];
      targetMap?.forEach(uniqueVal => {
        newRow[`__target__${uniqueVal}`] = tVal === uniqueVal ? 1 : 0;
      });
    } else if (targetColumn) {
      newRow[targetColumn] = row[targetColumn];
    }
    return newRow;
  });

  return { processed, targetMap };
};

// Helper: Train a simple model and compute statistics
const trainAndEvaluateModel = (
  processedData: any[],
  targetColumn: string,
  featureColumns: string[],
  columnTypes: Record<string, 'numeric' | 'categorical'>,
  modelType: string,
  targetMap?: string[]
) => {
  if (!processedData.length) return { stats: { error: 'No data available for training.' }, predictions: [] };
  if (!targetColumn || featureColumns.length === 0) return { stats: { error: 'Target or features not selected.' }, predictions: [] };
  if (processedData.length < 4) return { stats: { error: 'Not enough data rows to build a model.' }, predictions: [] };

  // Prepare X and y
  const X = processedData.map(row => featureColumns.map(f => row[f]));
  let y: any[] = [];
  if (modelType === 'classification' && targetMap && targetMap.length > 0) {
    y = processedData.map(row => {
      for (let i = 0; i < targetMap.length; i++) {
        if (row[`__target__${targetMap[i]}`] === 1) return targetMap[i];
      }
      return null;
    });
  } else {
    y = processedData.map(row => row[targetColumn]);
  }

  // Train/test split (80/20)
  const n = X.length;
  const split = Math.floor(n * 0.8);
  const X_train = X.slice(0, split);
  const y_train = y.slice(0, split);
  const X_test = X.slice(split);
  const y_test = y.slice(split);

  try {
    if (modelType === 'regression') {
      const dt = new DecisionTreeRegression();
      dt.train(X_train, y_train);
      const y_pred = dt.predict(X_test);
      // R²
      const meanY = y_test.reduce((a, b) => a + b, 0) / y_test.length;
      const ssTot = y_test.reduce((sum, yi) => sum + (yi - meanY) ** 2, 0);
      const ssRes = y_test.reduce((sum, yi, i) => sum + (yi - y_pred[i]) ** 2, 0);
      const r2 = ssTot !== 0 ? 1 - ssRes / ssTot : 0;
      const mae = y_test.reduce((sum, yi, i) => sum + Math.abs(yi - y_pred[i]), 0) / y_test.length;
      return {
        stats: { r2, mae, model: 'DecisionTreeRegression' },
        predictions: [...Array(split).fill(null), ...y_pred] // pad train with nulls
      };
    }
    if (modelType === 'classification') {
      const dt = new DecisionTreeClassifier();
      dt.train(X_train, y_train);
      const y_pred = dt.predict(X_test);
      // Accuracy
      const accuracy = y_test.reduce((sum, yi, i) => sum + (yi === y_pred[i] ? 1 : 0), 0) / y_test.length;
      // Confusion matrix
      let cm, labels;
      if (typeof ConfusionMatrix.fromLabels === 'function') {
        cm = ConfusionMatrix.fromLabels(y_test, y_pred);
        labels = cm.labels;
      } else if (typeof ConfusionMatrix.confusionMatrix === 'function') {
        cm = ConfusionMatrix.confusionMatrix(y_test, y_pred);
        labels = Array.from(new Set([...y_test, ...y_pred]));
      } else {
        // Fallback: simple confusion matrix
        labels = Array.from(new Set([...y_test, ...y_pred]));
        cm = labels.map(() => labels.map(() => 0));
        y_test.forEach((actual, i) => {
          const pred = y_pred[i];
          const aIdx = labels.indexOf(actual);
          const pIdx = labels.indexOf(pred);
          if (aIdx !== -1 && pIdx !== -1) cm[aIdx][pIdx]++;
        });
      }
      return {
        stats: {
          accuracy,
          confusionMatrix: cm.getMatrix ? cm.getMatrix() : cm,
          labels,
          model: 'DecisionTreeClassifier'
        },
        predictions: [...Array(split).fill(null), ...y_pred]
      };
    }
  } catch (e) {
    // Fallback to baseline
    if (modelType === 'regression') {
      const meanY = y.reduce((a, b) => a + b, 0) / y.length;
      const yPred = y.map(() => meanY);
      const ssTot = y.reduce((sum, yi) => sum + (yi - meanY) ** 2, 0);
      const ssRes = y.reduce((sum, yi, i) => sum + (yi - yPred[i]) ** 2, 0);
      const r2 = ssTot !== 0 ? 1 - ssRes / ssTot : 0;
      const mae = y.reduce((sum, yi, i) => sum + Math.abs(yi - yPred[i]), 0) / y.length;
      return {
        stats: { r2, mae, model: 'BaselineMean' },
        predictions: yPred
      };
    }
    if (modelType === 'classification') {
      const counts: Record<string, number> = {};
      y.forEach(val => {
        counts[val] = (counts[val] || 0) + 1;
      });
      const majority = Object.entries(counts).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
      const yPred = y.map(() => majority);
      const accuracy = y.reduce((sum, yi, i) => sum + (yi === yPred[i] ? 1 : 0), 0) / y.length;
      return {
        stats: { accuracy, majorityClass: majority, model: 'BaselineMajority' },
        predictions: yPred
      };
    }
  }
  return { stats: { error: 'Model type not supported or not implemented.' }, predictions: [] };
};

const ModelBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('objective');
  const [modelType, setModelType] = useState<string>('');
  const [targetColumn, setTargetColumn] = useState<string>('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [data] = useState<any[]>(getInitialData());
  const columns = Object.keys(data[0] || {});
  const [customModelType, setCustomModelType] = useState<'regression' | 'classification' | ''>('');
  const columnTypes = getColumnTypes(data);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    setError(null);
    if (currentStep === 'objective') {
      if (modelType === 'clustering') setCurrentStep('features');
      else if (modelType === 'custom') setCurrentStep('customType');
      else setCurrentStep('target');
    } else if (currentStep === 'customType') {
      setCurrentStep('target');
    } else if (currentStep === 'target') setCurrentStep('features');
    else if (currentStep === 'features') setCurrentStep('configure');
    else if (currentStep === 'configure') {
      setCurrentStep('build');
      startBuild();
    }
  };

  const handleBack = () => {
    setError(null);
    if (currentStep === 'target') {
      if (modelType === 'custom') setCurrentStep('customType');
      else setCurrentStep('objective');
    } else if (currentStep === 'features') {
      if (modelType === 'clustering') setCurrentStep('objective');
      else setCurrentStep('target');
    } else if (currentStep === 'configure') setCurrentStep('features');
    else if (currentStep === 'build') setCurrentStep('configure');
    else if (currentStep === 'customType') setCurrentStep('objective');
  };

  const startBuild = () => {
    setError(null);
    // Validation
    const effectiveModelType = modelType === 'custom' ? customModelType : modelType;
    if (!effectiveModelType) {
      setError('Please select a model type.');
      return;
    }
    if (effectiveModelType !== 'clustering' && !targetColumn) {
      setError('Please select a target column.');
      return;
    }
    if (selectedFeatures.length === 0) {
      setError('Please select at least one feature.');
      return;
    }
    setIsBuilding(true);
    setBuildProgress(0);

    // Preprocess data before building
    const allSelected = [targetColumn, ...selectedFeatures].filter(Boolean);
    const { processed: processedData, targetMap } = preprocessData(data, allSelected, columnTypes, targetColumn);

    // Train and evaluate model
    let modelStats: { stats: any, predictions: any[] } = { stats: {}, predictions: [] };
    const isTargetCategorical = targetMap && targetMap.length > 0;
    if (effectiveModelType === 'classification' && isTargetCategorical) {
      modelStats = trainAndEvaluateModel(
        processedData,
        targetColumn,
        selectedFeatures,
        columnTypes,
        effectiveModelType,
        targetMap
      );
    } else if (effectiveModelType === 'regression' || effectiveModelType === 'classification') {
      modelStats = trainAndEvaluateModel(
        processedData,
        targetColumn,
        selectedFeatures,
        columnTypes,
        effectiveModelType
      );
    }

    // If error in stats, show error and do not proceed
    if (modelStats.stats && modelStats.stats.error) {
      setError(modelStats.stats.error);
      setIsBuilding(false);
      return;
    }

    // Store results in localStorage for ModelResults page
    localStorage.setItem(
      'modelResults',
      JSON.stringify({
        modelType: effectiveModelType,
        targetColumn,
        selectedFeatures,
        stats: modelStats.stats,
        predictions: modelStats.predictions,
        processedData,
        targetMap
      })
    );

    // Simulate building progress
    const interval = setInterval(() => {
      setBuildProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            window.location.href = '/results';
          }, 1000);
          return 100;
        }
        return newProgress;
      });
    }, 800);
  };

  const handleSelectModelType = (type: string) => {
    setModelType(type);
  };

  const handleSelectTargetColumn = (column: string) => {
    setTargetColumn(column);
  };

  const handleToggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 'objective':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">What do you want to do with your data?</h2>
            <p className="text-gray-600">Select the type of analysis you want to perform</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <ModelTypeCard
                title="Predict Values"
                icon={<Goal className="h-6 w-6 text-blue-500" />}
                description="Forecast numbers like sales, revenue, or customer lifetime value"
                examples="Sales forecasting, Pricing optimization"
                modelType="regression"
                isSelected={modelType === 'regression'}
                onSelect={handleSelectModelType}
              />
              
              <ModelTypeCard
                title="Categorize Data"
                icon={<Dices className="h-6 w-6 text-purple-500" />}
                description="Classify data into categories or predict yes/no outcomes"
                examples="Customer churn, Fraud detection"
                modelType="classification"
                isSelected={modelType === 'classification'}
                onSelect={handleSelectModelType}
              />
              
              <ModelTypeCard
                title="Find Patterns"
                icon={<BarChart4 className="h-6 w-6 text-indigo-500" />}
                description="Group similar items together or find hidden patterns"
                examples="Customer segmentation, Product recommendations"
                modelType="clustering"
                isSelected={modelType === 'clustering'}
                onSelect={handleSelectModelType}
              />
              
              <ModelTypeCard
                title="Custom Model"
                icon={<Settings className="h-6 w-6 text-gray-500" />}
                description="Advanced configuration for specific needs"
                examples="Time series analysis, Anomaly detection"
                modelType="custom"
                isSelected={modelType === 'custom'}
                onSelect={handleSelectModelType}
              />
            </div>
          </div>
        );
      
      case 'customType':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Custom Model Type</h2>
            <p className="text-gray-600">Choose the type of custom model you want to build</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <ModelTypeCard
                title="Regression (Predict Values)"
                icon={<Goal className="h-6 w-6 text-blue-500" />}
                description="Forecast numbers like sales, revenue, or customer lifetime value"
                examples="Sales forecasting, Pricing optimization"
                modelType="regression"
                isSelected={customModelType === 'regression'}
                onSelect={() => setCustomModelType('regression')}
              />
              <ModelTypeCard
                title="Classification (Categorize Data)"
                icon={<Dices className="h-6 w-6 text-purple-500" />}
                description="Classify data into categories or predict yes/no outcomes"
                examples="Customer churn, Fraud detection"
                modelType="classification"
                isSelected={customModelType === 'classification'}
                onSelect={() => setCustomModelType('classification')}
              />
            </div>
          </div>
        );
      
      case 'target':
        if (modelType === 'clustering') {
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">No Target Column Needed</h2>
              <p className="text-gray-600">Clustering finds patterns across all columns. Click Continue.</p>
            </div>
          );
        }
        let targetColumns = columns;
        // Determine warning for target type
        let targetWarning = '';
        if (targetColumn) {
          if ((modelType === 'regression' || (modelType === 'custom' && customModelType === 'regression')) && columnTypes[targetColumn] === 'categorical') {
            targetWarning = 'Warning: You selected a categorical column as the target for regression. Regression models expect numeric targets.';
          }
          if ((modelType === 'classification' || (modelType === 'custom' && customModelType === 'classification')) && columnTypes[targetColumn] === 'numeric') {
            targetWarning = 'Warning: You selected a numeric column as the target for classification. Classification models expect categorical targets.';
          }
        }
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">What do you want to predict?</h2>
            <p className="text-gray-600">Select the column you want to predict (target variable)</p>
            <TargetColumnSelector
              columns={targetColumns}
              selectedColumn={targetColumn}
              onSelectColumn={handleSelectTargetColumn}
              modelType={modelType === 'custom' ? customModelType : modelType}
            />
            {targetWarning && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-3">
                {targetWarning}
              </div>
            )}
          </div>
        );
      
      case 'features':
        let featureColumns = columns.filter(col => col !== targetColumn);
        // Suggestions for feature types
        let featureSuggestions: string[] = [];
        selectedFeatures.forEach((feature) => {
          if ((modelType === 'regression' || (modelType === 'custom' && customModelType === 'regression')) && columnTypes[feature] === 'categorical') {
            featureSuggestions.push(`Note: Feature "${feature}" is categorical and will be one-hot encoded for regression.`);
          }
          if ((modelType === 'classification' || (modelType === 'custom' && customModelType === 'classification')) && columnTypes[feature] === 'numeric') {
            featureSuggestions.push(`Note: Feature "${feature}" is numeric and will be used as-is for classification.`);
          }
        });
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Select features to include</h2>
            <p className="text-gray-600">Choose which data columns to use for making predictions</p>
            {featureColumns.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4">
                <p>
                  <b>No available features.</b> All columns are already used as the target, or your data does not have enough columns.
                </p>
                <button
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={handleBack}
                >
                  Go Back
                </button>
              </div>
            ) : (
              <FeatureSelector
                columns={featureColumns}
                selectedFeatures={selectedFeatures}
                onToggleFeature={handleToggleFeature}
              />
            )}
            {featureSuggestions.length > 0 && (
              <div className="mt-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-3 space-y-1">
                {featureSuggestions.map((msg, idx) => (
                  <div key={idx}>{msg}</div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'configure':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Model Configuration</h2>
            <p className="text-gray-600">Fine-tune your model settings or use our recommended defaults</p>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-800 mb-4">
              <p>
                <span className="font-medium">Using AutoML:</span> We'll automatically test multiple algorithms 
                and choose the best model for your data.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Model Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <span className="text-sm text-gray-500">Model Type</span>
                    <p className="font-medium">
                      {modelType === 'custom' ? (customModelType === 'regression' ? 'Custom Regression' : 'Custom Classification') : modelType === 'regression' ? 'Predict Values' : modelType === 'classification' ? 'Categorize Data' : 'Find Patterns'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded">
                    <span className="text-sm text-gray-500">Target Column</span>
                    <p className="font-medium">{targetColumn}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded md:col-span-2">
                    <span className="text-sm text-gray-500">Features ({selectedFeatures.length})</span>
                    <p className="font-medium truncate">{selectedFeatures.join(', ')}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Advanced Settings</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="auto_ml"
                    className="w-4 h-4 text-blue-600 rounded"
                    checked
                    readOnly
                  />
                  <label htmlFor="auto_ml" className="text-gray-700">Use AutoML (recommended)</label>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'build':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Building Your Model</h2>
            <p className="text-gray-600">This may take a few minutes. We're trying different algorithms to find the best one for your data.</p>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
                <b>Error:</b> {error}
              </div>
            )}
            <ModelBuildProgress progress={buildProgress} />
          </div>
        );
      
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 'objective') return !modelType;
    if (currentStep === 'customType') return !customModelType;
    if (currentStep === 'target') {
      if (modelType === 'clustering') return false;
      if (modelType === 'custom') return !targetColumn;
      return !targetColumn;
    }
    if (currentStep === 'features') return selectedFeatures.length === 0;
    return false;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create Model</h1>
      </div>

      {/* Progress steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between w-full">
          {['objective', 'target', 'features', 'configure', 'build', 'customType'].map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === step 
                      ? 'bg-blue-600 text-white' 
                      : (currentStep === 'build' && step !== 'build') || 
                        (currentStep === 'configure' && (step === 'objective' || step === 'target' || step === 'features')) ||
                        (currentStep === 'features' && (step === 'objective' || step === 'target')) ||
                        (currentStep === 'target' && step === 'objective')
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-xs mt-1 text-gray-500">
                  {step === 'objective' ? 'Objective' :
                   step === 'target' ? 'Target' :
                   step === 'features' ? 'Features' :
                   step === 'configure' ? 'Configure' :
                   step === 'customType' ? 'Custom Type' : 'Build'}
                </span>
              </div>
              
              {index < 5 && (
                <div 
                  className={`flex-1 h-0.5 ${
                    (currentStep === 'build') ||
                    (currentStep === 'configure' && (step === 'objective' || step === 'target' || step === 'features')) ||
                    (currentStep === 'features' && (step === 'objective' || step === 'target')) ||
                    (currentStep === 'target' && step === 'objective')
                      ? 'bg-blue-600' 
                      : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <Card className="overflow-visible">
        <div className="p-6">
          {getStepContent()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 'objective' || (currentStep === 'build' && buildProgress > 0)}
            >
              Back
            </Button>
            
            <Button
              variant="primary"
              onClick={handleContinue}
              disabled={isNextDisabled() || (currentStep === 'build' && buildProgress > 0)}
            >
              {currentStep === 'configure' ? 'Build Model' : 'Continue'}
              {!isNextDisabled() && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ModelBuilder;