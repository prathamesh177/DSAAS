import React, { useState } from 'react';
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

const DataExploration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'table' | 'visualize'>('table');
  const [selectedChartType, setSelectedChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [charts, setCharts] = useState<Array<{id: string, type: string, columns: string[]}>>([]);
  const [data] = useState<any[]>(getInitialData());
  const columns = Object.keys(data[0] || {});

  const handleAddChart = () => {
    if (selectedColumns.length === 0) return;
    
    const newChart = {
      id: `chart-${Date.now()}`,
      type: selectedChartType,
      columns: [...selectedColumns]
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
                    selectedType={selectedChartType}
                    onChange={setSelectedChartType}
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
                    chartType={chart.type as 'bar' | 'line' | 'pie'}
                    columns={chart.columns}
                    data={data}
                    onRemove={() => setCharts(charts.filter(c => c.id !== chart.id))}
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