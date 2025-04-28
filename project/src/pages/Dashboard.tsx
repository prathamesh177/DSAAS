import React, { useState } from 'react';
import { Plus, Database, BarChart2, BrainCircuit, FileQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ProjectCard from '../components/dashboard/ProjectCard';
import RecentActivityList from '../components/dashboard/RecentActivityList';
import TemplateCard from '../components/dashboard/TemplateCard';
import EmptyState from '../components/ui/EmptyState';
import { mockProjects, mockRecentActivity, mockTemplates } from '../data/mockData';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'templates'>('projects');
  const hasProjects = mockProjects.length > 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
        <Button 
          variant="primary" 
          as={Link} 
          to="/upload"
        >
          <Plus className="w-4 h-4 mr-2" /> New Project
        </Button>
      </div>

      {!hasProjects && (
        <EmptyState
          icon={<FileQuestion className="h-12 w-12 text-blue-500" />}
          title="No projects yet"
          description="Start by creating a new project or exploring our templates"
          action={
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button 
                variant="primary" 
                as={Link} 
                to="/upload"
              >
                <Plus className="w-4 h-4 mr-2" /> New Project
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('templates')}
              >
                Explore Templates
              </Button>
            </div>
          }
        />
      )}

      {hasProjects && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="p-6">
                <Database className="h-8 w-8 mb-2 text-blue-100" />
                <h2 className="text-2xl font-bold mb-1">3</h2>
                <p className="text-blue-100">Data Sources</p>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
              <div className="p-6">
                <BarChart2 className="h-8 w-8 mb-2 text-indigo-100" />
                <h2 className="text-2xl font-bold mb-1">12</h2>
                <p className="text-indigo-100">Visualizations</p>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="p-6">
                <BrainCircuit className="h-8 w-8 mb-2 text-purple-100" />
                <h2 className="text-2xl font-bold mb-1">2</h2>
                <p className="text-purple-100">Models</p>
              </div>
            </Card>
          </div>

          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`px-4 py-2 font-medium text-sm border-b-2 ${
                activeTab === 'projects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('projects')}
            >
              My Projects
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm border-b-2 ${
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('templates')}
            >
              Templates
            </button>
          </div>
        </>
      )}

      {activeTab === 'projects' && hasProjects && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}

      {hasProjects && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <Card>
            <RecentActivityList activities={mockRecentActivity} />
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;