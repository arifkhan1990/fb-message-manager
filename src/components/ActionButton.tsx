import React from 'react';
import { Button } from './Button';

interface ActionButtonProps {
  variant: 'primary' | 'secondary' | 'warning' | 'danger';
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
  count?: number;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  variant,
  onClick,
  disabled,
  icon,
  label,
  count
}) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      icon={icon}
    >
      {count !== undefined ? `${label} (${count})` : label}
    </Button>
  );
}; 