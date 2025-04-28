import React, { useState } from 'react';
import { ArrowUpDown, Filter, Search } from 'lucide-react';

interface DataTableProps {
  data: any[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  if (!data || data.length === 0) {
    return <div className="text-gray-500">No data available.</div>;
  }

  const columns = Object.keys(data[0]);

  const handleSort = (column: string) => {
    if (sortField === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(column);
      setSortDirection('asc');
    }
  };

  // Simple filtering based on search term
  const filteredData = data.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Simple sorting
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    const strA = String(aValue).toLowerCase();
    const strB = String(bValue).toLowerCase();
    
    if (sortDirection === 'asc') {
      return strA.localeCompare(strB);
    } else {
      return strB.localeCompare(strA);
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search data..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center">
                    {column}
                    {sortField === column ? (
                      <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400" />
                    ) : (
                      <ArrowUpDown className="ml-1 h-4 w-4 text-gray-300" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {sortedData.length === 0 && (
          <div className="text-center py-4 text-gray-500">No matching results found</div>
        )}
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>
          Showing {sortedData.length} of {data.length} rows
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>
            Previous
          </button>
          <span className="px-3 py-1 border border-gray-300 rounded-md bg-blue-50 text-blue-600">1</span>
          <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;