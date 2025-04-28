import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'white';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  as?: React.ElementType;
  to?: string;
  href?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  as: Component = 'button',
  children,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
      case 'secondary':
        return 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500';
      case 'outline':
        return 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-blue-500';
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500';
      case 'white':
        return 'bg-white hover:bg-gray-100 text-blue-600 focus:ring-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-5 py-2.5 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const allClasses = `
    inline-flex items-center justify-center
    font-medium rounded-md
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-60 disabled:cursor-not-allowed
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${className}
  `;

  return <Component className={allClasses} {...props}>{children}</Component>;
};

export default Button;