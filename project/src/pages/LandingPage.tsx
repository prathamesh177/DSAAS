import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Database, LineChart, PieChart, MoveRight } from 'lucide-react';
import Button from '../components/ui/Button';
import FeatureCard from '../components/landing/FeatureCard';
import HeroImage from '../components/landing/HeroImage';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Data Science <span className="text-blue-600">Made Simple</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700">
                Transform your data into insights without writing a single line of code. 
                Our no-code platform makes data science accessible to everyone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  variant="primary" 
                  size="lg"
                  as={Link}
                  to="/dashboard"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  as="a"
                  href="#features"
                >
                  Explore Features
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
              <HeroImage />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features, Zero Coding
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform takes care of the complex data science, so you can focus on the insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Database className="h-10 w-10 text-blue-500" />}
              title="Easy Data Upload"
              description="Drag and drop your files or connect to popular data sources with a single click."
            />
            <FeatureCard 
              icon={<BarChart3 className="h-10 w-10 text-blue-500" />}
              title="Instant Visualizations"
              description="Create beautiful charts with one click. No coding or complex setup required."
            />
            <FeatureCard 
              icon={<LineChart className="h-10 w-10 text-blue-500" />}
              title="Automated Insights"
              description="Get AI-powered insights from your data in plain language you can understand."
            />
            <FeatureCard 
              icon={<PieChart className="h-10 w-10 text-blue-500" />}
              title="Interactive Dashboards"
              description="Build and share custom dashboards with drag-and-drop simplicity."
            />
            <FeatureCard 
              icon={<Database className="h-10 w-10 text-blue-500" />}
              title="Pre-built Templates"
              description="Start with ready-to-use templates for common business scenarios."
            />
            <FeatureCard 
              icon={<Database className="h-10 w-10 text-blue-500" />}
              title="Automated Machine Learning"
              description="Train predictive models automatically, no data science expertise needed."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to transform your data into actionable insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/3 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-blue-200">
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 rotate-90">
                <MoveRight className="h-6 w-6 text-blue-500" />
              </div>
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90">
                <MoveRight className="h-6 w-6 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 text-center relative">
              <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Upload Your Data</h3>
              <p className="text-gray-600">
                Drag and drop your files or connect to your favorite data sources.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 text-center relative">
              <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Choose a Template</h3>
              <p className="text-gray-600">
                Select from our pre-built templates or create a custom analysis.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 text-center relative">
              <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Get Results</h3>
              <p className="text-gray-600">
                Review your insights and share them with your team in minutes.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="primary" 
              size="lg"
              as={Link}
              to="/dashboard"
            >
              Start Your First Project <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to unlock the power of your data?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of companies using our platform to make better decisions with data.
            </p>
            <Button 
              variant="white" 
              size="lg"
              as={Link}
              to="/dashboard"
            >
              Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;