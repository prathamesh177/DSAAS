import React from 'react';
import { Clock, User } from 'lucide-react';

interface Activity {
  id: string;
  type: 'created' | 'updated' | 'shared' | 'deleted';
  entityType: 'project' | 'model' | 'dataset';
  entityName: string;
  timestamp: string;
  user: {
    name: string;
    avatar?: string;
  };
}

interface RecentActivityListProps {
  activities: Activity[];
}

const RecentActivityList: React.FC<RecentActivityListProps> = ({ activities }) => {
  const getActivityIcon = (activity: Activity) => {
    switch (activity.type) {
      case 'created':
        return <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">+</span>;
      case 'updated':
        return <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">↻</span>;
      case 'shared':
        return <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">↗</span>;
      case 'deleted':
        return <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">×</span>;
      default:
        return <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">?</span>;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'created':
        return <span>Created a new {activity.entityType} <b>{activity.entityName}</b></span>;
      case 'updated':
        return <span>Updated {activity.entityType} <b>{activity.entityName}</b></span>;
      case 'shared':
        return <span>Shared {activity.entityType} <b>{activity.entityName}</b> with team</span>;
      case 'deleted':
        return <span>Deleted {activity.entityType} <b>{activity.entityName}</b></span>;
      default:
        return <span>Interacted with {activity.entityType} <b>{activity.entityName}</b></span>;
    }
  };

  return (
    <div className="divide-y divide-gray-200">
      {activities.map((activity) => (
        <div key={activity.id} className="py-4 px-6 flex items-start">
          <div className="mr-4 flex-shrink-0">
            {getActivityIcon(activity)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-900">
              {getActivityText(activity)}
            </div>
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <Clock size={12} className="mr-1" />
              <span className="mr-2">{activity.timestamp}</span>
              <User size={12} className="mr-1" />
              <span>{activity.user.name}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivityList;