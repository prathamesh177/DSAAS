import React from 'react';

interface DataPreviewProps {
  data: any[];
}

const DataPreview: React.FC<DataPreviewProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-gray-500">No data available to preview.</div>;
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.slice(0, 5).map((row, rowIndex) => (
            <tr key={rowIndex}>
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
      
      {data.length > 5 && (
        <div className="text-center py-3 bg-gray-50 text-sm text-gray-500 border-t border-gray-200">
          Showing 5 of {data.length} rows
        </div>
      )}
    </div>
  );
};

export default DataPreview;