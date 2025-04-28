import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  iconComponent: LucideIcon;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface TemplateCardProps {
  template: Template;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  const getDifficultyBadge = () => {
    switch (template.difficulty) {
      case 'beginner':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Beginner</span>;
      case 'intermediate':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Intermediate</span>;
      case 'advanced':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Advanced</span>;
      default:
        return null;
    }
  };

  const IconComponent = template.iconComponent;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border border-gray-200">
      <div className="p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <IconComponent size={18} />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-900">{template.name}</h3>
              {getDifficultyBadge()}
            </div>
            <p className="text-sm text-gray-600 mt-1 mb-4">{template.description}</p>
            <Link 
              to={`/upload?template=${template.id}`} 
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Use Template <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TemplateCard;