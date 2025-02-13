import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'warning' | 'danger';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  disabled = false,
  onClick,
  children,
  className = '',
  icon
}) => {
  const baseClasses = 'action-button';
  const variantClass = variant !== 'primary' ? variant : '';
  
  return (
    <button
      className={`${baseClasses} ${variantClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="button-icon">{icon}</span>}
      {children}
    </button>
  );
}; 