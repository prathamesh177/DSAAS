import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const PredictionTable: React.FC = () => {
  // Mock prediction data
  const predictions = [
    { id: 1, date: 'January 2025', actual: '$45,200', predicted: '$46,800', diff: '+$1,600', diffPercent: '+3.5%' },
    { id: 2, date: 'February 2025', actual: '$38,900', predicted: '$40,200', diff: '+$1,300', diffPercent: '+3.3%' },
    { id: 3, date: 'March 2025', actual: '$42,300', predicted: '$43,100', diff: '+$800', diffPercent: '+1.9%' },
    { id: 4, date: 'April 2025', actual: '—', predicted: '$47,500', diff: '—', diffPercent: '—' },
    { id: 5, date: 'May 2025', actual: '—', predicted: '$51,200', diff: '—', diffPercent: '—' },
    { id: 6, date: 'June 2025', actual: '—', predicted: '$54,800', diff: '—', diffPercent: '—' },
  ];

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actual Sales
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Predicted Sales
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Difference
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              % Difference
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {predictions.map((prediction) => (
            <tr key={prediction.id} className={prediction.actual === '—' ? 'bg-blue-50/30' : ''}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {prediction.date}
                {prediction.actual === '—' && <span className="ml-2 text-xs text-blue-600">(Forecast)</span>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {prediction.actual}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {prediction.predicted}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {prediction.diff !== '—' ? (
                  <span className={`font-medium ${prediction.diff.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {prediction.diff}
                  </span>
                ) : (
                  <span className="text-gray-500">—</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {prediction.diffPercent !== '—' ? (
                  <div className="flex items-center text-sm">
                    {prediction.diffPercent.startsWith('+') ? (
                      <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`font-medium ${prediction.diffPercent.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {prediction.diffPercent}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-500">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PredictionTable;