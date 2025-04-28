// Mock data for the application
import { BarChart2, Users, TrendingUp, AlertTriangle, ShoppingCart, Heart } from 'lucide-react';

// Mock projects
export const mockProjects = [
  {
    id: 'proj-001',
    name: 'Sales Forecasting',
    date: 'April 2, 2025',
    type: 'Regression',
    status: 'active',
    thumbnail: 'https://images.pexels.com/photos/7567460/pexels-photo-7567460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'proj-002',
    name: 'Customer Segmentation',
    date: 'March 29, 2025',
    type: 'Clustering',
    status: 'completed',
    thumbnail: 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'proj-003',
    name: 'Churn Prediction',
    date: 'March 24, 2025',
    type: 'Classification',
    status: 'draft',
  }
];

// Mock templates
export const mockTemplates = [
  {
    id: 'templ-001',
    name: 'Sales Forecasting',
    description: 'Predict future sales based on historical data and external factors',
    iconComponent: TrendingUp,
    difficulty: 'beginner'
  },
  {
    id: 'templ-002',
    name: 'Customer Segmentation',
    description: 'Group customers based on behavior, demographics, and purchasing patterns',
    iconComponent: Users,
    difficulty: 'intermediate'
  },
  {
    id: 'templ-003',
    name: 'Churn Prediction',
    description: 'Identify customers likely to cancel or not renew their subscription',
    iconComponent: AlertTriangle,
    difficulty: 'intermediate'
  },
  {
    id: 'templ-004',
    name: 'Product Recommendations',
    description: 'Suggest products based on purchase history and browsing behavior',
    iconComponent: ShoppingCart,
    difficulty: 'advanced'
  },
  {
    id: 'templ-005',
    name: 'Customer Lifetime Value',
    description: 'Predict the total revenue a customer will generate over their lifetime',
    iconComponent: Heart,
    difficulty: 'advanced'
  },
  {
    id: 'templ-006',
    name: 'Market Basket Analysis',
    description: 'Discover which products are frequently purchased together',
    iconComponent: BarChart2,
    difficulty: 'beginner'
  }
];

// Mock recent activity
export const mockRecentActivity = [
  {
    id: 'act-001',
    type: 'created',
    entityType: 'project',
    entityName: 'Sales Forecasting',
    timestamp: '2 hours ago',
    user: {
      name: 'John Doe',
    }
  },
  {
    id: 'act-002',
    type: 'updated',
    entityType: 'model',
    entityName: 'Customer Segmentation',
    timestamp: '1 day ago',
    user: {
      name: 'John Doe',
    }
  },
  {
    id: 'act-003',
    type: 'shared',
    entityType: 'dataset',
    entityName: 'Q1 2025 Sales Data',
    timestamp: '2 days ago',
    user: {
      name: 'John Doe',
    }
  }
];

// Mock data connectors
export const mockDataConnectors = [
  {
    id: 'conn-001',
    name: 'Google Sheets',
    description: 'Connect to your spreadsheets',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg',
    status: 'available'
  },
  {
    id: 'conn-002',
    name: 'Excel Online',
    description: 'Connect to Excel files in OneDrive',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Microsoft_Excel_2013_logo.svg',
    status: 'available'
  },
  {
    id: 'conn-003',
    name: 'Salesforce',
    description: 'Import your CRM data directly',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg',
    status: 'connected'
  },
  {
    id: 'conn-004',
    name: 'Google Analytics',
    description: 'Import your website analytics',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Google_Analytics_logo.svg',
    status: 'available'
  },
  {
    id: 'conn-005',
    name: 'PostgreSQL',
    description: 'Connect to your database',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg',
    status: 'coming_soon'
  },
  {
    id: 'conn-006',
    name: 'Shopify',
    description: 'Import your e-commerce data',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg',
    status: 'coming_soon'
  }
];

// Mock sample data
export const mockDataSample = [
  {
    Date: 'Jan 2024',
    'Marketing Spend': 12500,
    'Website Traffic': 34200,
    'Conversion Rate': 2.4,
    Sales: 45780
  },
  {
    Date: 'Feb 2024',
    'Marketing Spend': 14000,
    'Website Traffic': 38600,
    'Conversion Rate': 2.2,
    Sales: 42350
  },
  {
    Date: 'Mar 2024',
    'Marketing Spend': 16500,
    'Website Traffic': 42100,
    'Conversion Rate': 2.5,
    Sales: 50200
  },
  {
    Date: 'Apr 2024',
    'Marketing Spend': 18000,
    'Website Traffic': 45800,
    'Conversion Rate': 2.6,
    Sales: 56400
  },
  {
    Date: 'May 2024',
    'Marketing Spend': 20000,
    'Website Traffic': 51200,
    'Conversion Rate': 2.8,
    Sales: 62300
  },
  {
    Date: 'Jun 2024',
    'Marketing Spend': 22500,
    'Website Traffic': 58400,
    'Conversion Rate': 2.7,
    Sales: 68500
  },
  {
    Date: 'Jul 2024',
    'Marketing Spend': 25000,
    'Website Traffic': 63700,
    'Conversion Rate': 2.9,
    Sales: 75200
  },
  {
    Date: 'Aug 2024',
    'Marketing Spend': 27500,
    'Website Traffic': 68900,
    'Conversion Rate': 3.0,
    Sales: 82400
  },
  {
    Date: 'Sep 2024',
    'Marketing Spend': 30000,
    'Website Traffic': 72500,
    'Conversion Rate': 3.1,
    Sales: 88700
  },
  {
    Date: 'Oct 2024',
    'Marketing Spend': 35000,
    'Website Traffic': 78300,
    'Conversion Rate': 3.4,
    Sales: 98200
  },
];