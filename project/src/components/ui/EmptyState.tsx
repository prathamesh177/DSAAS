import React, { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="text-center bg-white rounded-lg border border-gray-200 p-10 py-16">
      <div className="mx-auto w-12 h-12 flex items-center justify-center text-gray-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;