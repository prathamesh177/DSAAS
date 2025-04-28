import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Card: React.FC<CardProps> = ({ className = '', children, ...props }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-sm ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;