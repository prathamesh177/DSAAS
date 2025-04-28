import React from 'react';
import { ExternalLink } from 'lucide-react';
import Button from '../ui/Button';

interface DataConnector {
  id: string;
  name: string;
  description: string;
  logo: string;
  status: 'available' | 'connected' | 'coming_soon';
}

interface DataConnectorItemProps {
  connector: DataConnector;
}

const DataConnectorItem: React.FC<DataConnectorItemProps> = ({ connector }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center">
        <div className="w-10 h-10 flex-shrink-0 mr-4">
          <img 
            src={connector.logo} 
            alt={connector.name} 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900">{connector.name}</h3>
          <p className="text-xs text-gray-500 mt-1">{connector.description}</p>
        </div>
      </div>
      <div className="mt-4">
        {connector.status === 'available' && (
          <Button variant="outline" size="sm" className="w-full">
            Connect <ExternalLink className="ml-2 h-3 w-3" />
          </Button>
        )}
        {connector.status === 'connected' && (
          <Button variant="ghost" size="sm" className="w-full text-green-600 border border-green-100 bg-green-50">
            Connected
          </Button>
        )}
        {connector.status === 'coming_soon' && (
          <Button variant="ghost" size="sm" className="w-full text-gray-400 cursor-not-allowed" disabled>
            Coming Soon
          </Button>
        )}
      </div>
    </div>
  );
};

export default DataConnectorItem;