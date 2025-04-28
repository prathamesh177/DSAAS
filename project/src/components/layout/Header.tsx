import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Button from '../ui/Button';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              DataSage
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="#features" className="text-gray-600 hover:text-gray-900">
              Features
            </Link>
            <Link to="#" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link to="#" className="text-gray-600 hover:text-gray-900">
              Documentation
            </Link>
            <Link to="#" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              as={Link}
              to="/login"
            >
              Log in
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              as={Link}
              to="/dashboard"
            >
              Get Started
            </Button>
          </div>

          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;