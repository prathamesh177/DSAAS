import React from 'react';

const HeroImage: React.FC = () => {
  return (
    <div className="relative rounded-lg overflow-hidden shadow-xl">
      <img 
        src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" 
        alt="Data analysis dashboard" 
        className="w-full h-auto object-cover rounded-lg"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/40 to-purple-600/10 rounded-lg">
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 p-4 rounded-lg shadow-lg backdrop-blur-sm">
          <div className="flex items-center">
            <div className="h-8 w-2 bg-blue-500 rounded-full mr-3"></div>
            <div>
              <p className="text-sm font-semibold text-blue-600">Prediction Results</p>
              <p className="text-xs text-gray-600">Sales forecast confidence: 94%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroImage;