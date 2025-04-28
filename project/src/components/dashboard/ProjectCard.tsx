import React from 'react';
import { Calendar, BarChart2, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';

interface Project {
  id: string;
  name: string;
  date: string;
  type: string;
  status: 'active' | 'completed' | 'draft';
  thumbnail?: string;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const getStatusBadge = () => {
    switch (project.status) {
      case 'active':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Completed</span>;
      case 'draft':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Draft</span>;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link to={`/results?id=${project.id}`}>
        <div className="relative h-36 bg-gray-100">
          {project.thumbnail ? (
            <img 
              src={project.thumbnail} 
              alt={project.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BarChart2 className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <Link to={`/results?id=${project.id}`} className="hover:text-blue-600">
            <h3 className="font-medium text-gray-900 mb-1">{project.name}</h3>
          </Link>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical size={16} />
          </button>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Calendar size={14} className="mr-1" />
          <span>{project.date}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">{project.type}</span>
          {getStatusBadge()}
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;