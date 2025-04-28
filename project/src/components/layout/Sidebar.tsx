import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Database, BarChart2, BrainCircuit, LineChart, 
  Settings, HelpCircle, BrainCog, LogOut
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Database size={20} />, label: 'Data Sources', path: '/upload' },
    { icon: <BarChart2 size={20} />, label: 'Explore Data', path: '/explore' },
    { icon: <BrainCircuit size={20} />, label: 'Models', path: '/model-builder' },
    { icon: <LineChart size={20} />, label: 'Results', path: '/results' },
  ];
  
  const bottomNavItems = [
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
    { icon: <HelpCircle size={20} />, label: 'Help', path: '/help' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center gap-2 px-2">
          <div className="bg-blue-600 text-white p-1 rounded">
            <BrainCog size={24} />
          </div>
          <span className="font-bold text-xl">DataSage</span>
        </Link>
      </div>
      
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <ul className="space-y-1">
          {bottomNavItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;