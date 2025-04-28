import React, { useState } from 'react';
import { Database, FileSpreadsheet, Link as LinkIcon, Check, X } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import FileUploader from '../components/upload/FileUploader';
import DataPreview from '../components/upload/DataPreview';
import DataConnectorItem from '../components/upload/DataConnectorItem';
import { mockDataConnectors } from '../data/mockData';
import Papa from 'papaparse';

const DataUpload: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'connect'>('upload');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [showPreview, setShowPreview] = useState(false);
  const [uploadedData, setUploadedData] = useState<any[]>([]);

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
    setUploadStatus('uploading');
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<any>) => {
        setUploadedData(results.data);
        setUploadStatus('success');
        setShowPreview(true);
      },
      error: () => {
        setUploadStatus('error');
      }
    });
  };

  const handleContinue = () => {
    // Store uploaded data in localStorage for use in other pages
    localStorage.setItem('uploadedData', JSON.stringify(uploadedData));
    window.location.href = '/explore';
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add Your Data</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-4 font-medium flex items-center ${
              activeTab === 'upload'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('upload')}
          >
            <FileSpreadsheet className="h-5 w-5 mr-2" />
            Upload Files
          </button>
          <button
            className={`px-6 py-4 font-medium flex items-center ${
              activeTab === 'connect'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('connect')}
          >
            <LinkIcon className="h-5 w-5 mr-2" />
            Connect Data Sources
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'upload' && (
            <div className="space-y-6">
              {!showPreview ? (
                <FileUploader
                  onFilesSelected={handleFileUpload}
                  status={uploadStatus}
                  acceptedFileTypes=".csv,.xlsx,.xls"
                  maxFileSizeMB={10}
                />
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                    <Check className="h-5 w-5 mr-2" />
                    <span>File uploaded successfully. Preview your data below.</span>
                  </div>
                  
                  <DataPreview data={uploadedData} />
                  
                  <div className="flex justify-between mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowPreview(false);
                        setUploadStatus('idle');
                      }}
                    >
                      <X className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                    <Button variant="primary" onClick={handleContinue}>
                      Continue to Exploration <Check className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'connect' && (
            <div className="space-y-6">
              <p className="text-gray-600 mb-4">
                Connect directly to your data sources for seamless analysis.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockDataConnectors.map((connector) => (
                  <DataConnectorItem key={connector.id} connector={connector} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Card>
          <div className="p-6">
            <div className="flex items-start">
              <Database className="h-8 w-8 text-blue-500 mr-4 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Not sure where to start?
                </h3>
                <p className="text-gray-600 mb-4">
                  Try one of our sample datasets to explore the platform's capabilities.
                </p>
                <Button variant="outline" size="sm" as="a" href="/explore?sample=true">
                  Use Sample Dataset
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DataUpload;