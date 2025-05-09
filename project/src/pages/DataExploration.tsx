import React, { useState, useEffect } from 'react';
import { BarChart2, LineChart, PieChart, Sliders, Download, Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ChartContainer from '../components/exploration/ChartContainer';
import DataTable from '../components/exploration/DataTable';
import ChartTypeSelector from '../components/exploration/ChartTypeSelector';
import ColumnSelector from '../components/exploration/ColumnSelector';
import { mockDataSample } from '../data/mockData';

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

// Helper function to determine column type
const getColumnType = (data: any[], column: string): 'numeric' | 'categorical' | 'date' => {
  const sample = data.slice(0, 100); // Check first 100 rows
  const values = sample.map(row => row[column]);
  
  // Check if it's a date
  const dateRegex = /^\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}$/;
  if (values.every(val => dateRegex.test(val))) return 'date';
  
  // Check if it's numeric
  if (values.every(val => !isNaN(Number(val)))) return 'numeric';
  
  // Default to categorical
  return 'categorical';
};

// Helper function to analyze data distribution
const analyzeDataDistribution = (data: any[], column: string) => {
  const values = data.map(row => row[column]);
  const uniqueValues = new Set(values).size;
  const totalValues = values.length;
  
  // Calculate value counts for categorical data
  const valueCounts = values.reduce((acc: Record<string, number>, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
  
  // Calculate basic statistics for numeric data
  const numericValues = values.map(v => Number(v)).filter(v => !isNaN(v));
  const mean = numericValues.length ? numericValues.reduce((a, b) => a + b, 0) / numericValues.length : 0;
  const variance = numericValues.length ? 
    numericValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numericValues.length : 0;
  
  return {
    uniqueCount: uniqueValues,
    distribution: uniqueValues / totalValues,
    isTimeSeries: getColumnType(data, column) === 'date',
    valueCounts,
    mean,
    variance,
    isSkewed: Math.abs(mean - numericValues.sort((a, b) => a - b)[Math.floor(numericValues.length / 2)]) > Math.sqrt(variance)
  };
};

// Helper function to calculate correlation between numeric columns
const calculateCorrelation = (data: any[], col1: string, col2: string) => {
  const values1 = data.map(row => Number(row[col1]));
  const values2 = data.map(row => Number(row[col2]));
  
  const mean1 = values1.reduce((a, b) => a + b, 0) / values1.length;
  const mean2 = values2.reduce((a, b) => a + b, 0) / values2.length;
  
  const variance1 = values1.reduce((a, b) => a + Math.pow(b - mean1, 2), 0) / values1.length;
  const variance2 = values2.reduce((a, b) => a + Math.pow(b - mean2, 2), 0) / values2.length;
  
  const covariance = values1.reduce((a, b, i) => a + (b - mean1) * (values2[i] - mean2), 0) / values1.length;
  
  return covariance / Math.sqrt(variance1 * variance2);
};

// Helper function to suggest chart types based on data
const suggestChartTypes = (data: any[], columns: string[]) => {
  const suggestions: Array<{type: 'bar' | 'line' | 'pie' | 'scatter', columns: string[], score: number, description: string}> = [];
  
  // Get column types and analysis
  const columnTypes = columns.reduce((acc, col) => {
    acc[col] = getColumnType(data, col);
    return acc;
  }, {} as Record<string, 'numeric' | 'categorical' | 'date'>);
  
  const columnAnalysis = columns.reduce((acc, col) => {
    acc[col] = analyzeDataDistribution(data, col);
    return acc;
  }, {} as Record<string, any>);
  
  // Find columns by type
  const numericColumns = columns.filter(col => columnTypes[col] === 'numeric');
  const categoricalColumns = columns.filter(col => columnTypes[col] === 'categorical');
  const dateColumns = columns.filter(col => columnTypes[col] === 'date');
  
  // 1. Time Series Analysis
  if (dateColumns.length > 0 && numericColumns.length > 0) {
    dateColumns.forEach(dateCol => {
      numericColumns.forEach(numCol => {
        suggestions.push({
          type: 'line',
          columns: [dateCol, numCol],
          score: 0.9,
          description: `Time series of ${numCol} over ${dateCol}`
        });
      });
    });
  }
  
  // 2. Correlation Analysis (line)
  if (numericColumns.length >= 2) {
    for (let i = 0; i < numericColumns.length; i++) {
      for (let j = i + 1; j < numericColumns.length; j++) {
        const correlation = Math.abs(calculateCorrelation(data, numericColumns[i], numericColumns[j]));
        if (correlation > 0.3) {
          suggestions.push({
            type: 'line',
            columns: [numericColumns[i], numericColumns[j]],
            score: correlation,
            description: `Correlation between ${numericColumns[i]} and ${numericColumns[j]} (${correlation.toFixed(2)})`
          });
        }
      }
    }
  }

  // 3. Scatter Plot for all pairs of numeric columns
  if (numericColumns.length >= 2) {
    for (let i = 0; i < numericColumns.length; i++) {
      for (let j = i + 1; j < numericColumns.length; j++) {
        suggestions.push({
          type: 'scatter',
          columns: [numericColumns[i], numericColumns[j]],
          score: 0.5,
          description: `Scatter plot of ${numericColumns[i]} vs ${numericColumns[j]}`
        });
      }
    }
  }
  
  // 4. Distribution Analysis
  categoricalColumns.forEach(catCol => {
    const analysis = columnAnalysis[catCol];
    
    // Pie chart for categorical distribution
    if (analysis.uniqueCount <= 15) {
      suggestions.push({
        type: 'pie',
        columns: [catCol],
        score: 0.8,
        description: `Distribution of ${catCol}`
      });
    }
    
    // Bar chart for categorical vs numeric
    numericColumns.forEach(numCol => {
      suggestions.push({
        type: 'bar',
        columns: [catCol, numCol],
        score: 0.7,
        description: `${numCol} by ${catCol}`
      });
    });
  });
  
  // 5. Multiple Category Analysis
  if (categoricalColumns.length >= 2) {
    for (let i = 0; i < categoricalColumns.length; i++) {
      for (let j = i + 1; j < categoricalColumns.length; j++) {
        if (columnAnalysis[categoricalColumns[i]].uniqueCount <= 10 && 
            columnAnalysis[categoricalColumns[j]].uniqueCount <= 10) {
          suggestions.push({
            type: 'bar',
            columns: [categoricalColumns[i], categoricalColumns[j]],
            score: 0.6,
            description: `${categoricalColumns[i]} vs ${categoricalColumns[j]}`
          });
        }
      }
    }
  }
  
  // 6. Numeric Distribution Analysis
  numericColumns.forEach(numCol => {
    const analysis = columnAnalysis[numCol];
    if (analysis.isSkewed) {
      suggestions.push({
        type: 'bar',
        columns: [numCol],
        score: 0.65,
        description: `Distribution of ${numCol}`
      });
    }
  });
  
  // Sort suggestions by score
  return suggestions.sort((a, b) => b.score - a.score);
};

const DataExploration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'table' | 'visualize'>('table');
  const [selectedChartType, setSelectedChartType] = useState<'bar' | 'line' | 'pie' | 'scatter'>('bar');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [charts, setCharts] = useState<Array<{id: string, type: string, columns: string[], description: string}>>([]);
  const [data] = useState<any[]>(getInitialData());
  const columns = Object.keys(data[0] || {});

  // Generate automatic visualizations when data changes
  useEffect(() => {
    if (data.length > 0) {
      const suggestions = suggestChartTypes(data, columns);
      const newCharts = suggestions.map(suggestion => ({
        id: `chart-${Date.now()}-${Math.random()}`,
        type: suggestion.type,
        columns: suggestion.columns,
        description: suggestion.description
      }));
      setCharts(newCharts);
    }
  }, [data]);

  const handleAddChart = () => {
    if (selectedColumns.length === 0) return;
    
    const newChart = {
      id: `chart-${Date.now()}`,
      type: selectedChartType,
      columns: [...selectedColumns],
      description: `Custom ${selectedChartType} chart`
    };
    
    setCharts([...charts, newChart]);
    setSelectedColumns([]);
  };

  const handleColumnSelect = (column: string) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(col => col !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Explore Your Data</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            as="a"
            href="/model-builder"
          >
            Continue to Analysis
          </Button>
        </div>
      </div>

      <Card>
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-4 font-medium flex items-center ${
              activeTab === 'table'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('table')}
          >
            Data Table
          </button>
          <button
            className={`px-6 py-4 font-medium flex items-center ${
              activeTab === 'visualize'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('visualize')}
          >
            Visualize
          </button>
        </div>

        {activeTab === 'table' && (
          <div className="p-4">
            <DataTable data={data} />
          </div>
        )}

        {activeTab === 'visualize' && (
          <div className="p-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium mb-4">Create a Visualization</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chart Type
                  </label>
                  <ChartTypeSelector 
                    selectedType={selectedChartType as any}
                    onChange={setSelectedChartType as any}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Columns
                  </label>
                  <ColumnSelector 
                    columns={columns}
                    selectedColumns={selectedColumns}
                    onColumnSelect={handleColumnSelect}
                  />
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="primary" 
                  onClick={handleAddChart}
                  disabled={selectedColumns.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Chart
                </Button>
              </div>
            </div>
            
            {charts.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <BarChart2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No charts yet</h3>
                <p className="text-gray-500 mb-4">Select columns and chart type to create visualizations</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {charts.map((chart) => (
                  <ChartContainer 
                    key={chart.id} 
                    chartId={chart.id}
                    chartType={chart.type as any}
                    columns={chart.columns}
                    data={data}
                    onRemove={() => setCharts(charts.filter(c => c.id !== chart.id))}
                    description={chart.description}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default DataExploration;