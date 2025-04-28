import React, { useCallback, useState } from 'react';
import { Upload, File, X, Loader2, Check } from 'lucide-react';

interface FileUploaderProps {
  onFilesSelected: (files: FileList | null) => void;
  status: 'idle' | 'uploading' | 'success' | 'error';
  acceptedFileTypes: string;
  maxFileSizeMB: number;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFilesSelected, 
  status, 
  acceptedFileTypes,
  maxFileSizeMB 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = (file: File) => {
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    const isValidType = acceptedFileTypes.includes(fileExtension);
    const isValidSize = file.size <= maxFileSizeMB * 1024 * 1024;

    if (!isValidType) {
      setError(`Invalid file type. Accepted types: ${acceptedFileTypes}`);
      return false;
    }

    if (!isValidSize) {
      setError(`File too large. Maximum size: ${maxFileSizeMB}MB`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFilesSelected(e.dataTransfer.files);
      } else {
        onFilesSelected(null);
      }
    }
  }, [onFilesSelected, acceptedFileTypes, maxFileSizeMB]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFilesSelected(e.target.files);
      } else {
        onFilesSelected(null);
      }
    }
  }, [onFilesSelected, acceptedFileTypes, maxFileSizeMB]);

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    onFilesSelected(null);
  }, [onFilesSelected]);

  const renderContent = () => {
    if (selectedFile) {
      return (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="mr-3 bg-white p-2 rounded-md">
              <File className="h-6 w-6 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <div className="ml-4 flex-shrink-0">
              {status === 'uploading' && (
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              )}
              {status === 'success' && (
                <Check className="h-5 w-5 text-green-500" />
              )}
              {(status === 'idle' || status === 'error') && (
                <button 
                  onClick={handleRemoveFile}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="text-center p-6">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <p className="text-lg font-medium text-gray-900">
              Drag and drop your file here
            </p>
            <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">
              Upload CSV, Excel, or other structured data files.
              Max size: {maxFileSizeMB}MB
            </p>
          </div>
          <label 
            htmlFor="file-upload"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
          >
            Browse Files
          </label>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept={acceptedFileTypes}
            onChange={handleFileChange}
          />
          <p className="mt-2 text-xs text-gray-500">
            Accepted file types: {acceptedFileTypes}
          </p>
        </div>
      </>
    );
  };

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-lg ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${error ? 'border-red-300' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {renderContent()}
      </div>
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUploader;