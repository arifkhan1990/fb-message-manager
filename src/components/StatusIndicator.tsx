import React from 'react';

interface StatusIndicatorProps {
  type: 'loading' | 'success' | 'error' | 'info';
  message: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  type,
  message
}) => {
  const getIcon = () => {
    switch (type) {
      case 'loading':
        return '⌛';
      case 'success':
        return '✓';
      case 'error':
        return '⚠';
      case 'info':
        return 'ℹ';
    }
  };

  return (
    <div className={`status-indicator ${type}`}>
      <span className="status-icon">{getIcon()}</span>
      <span className="status-message">{message}</span>
    </div>
  );
}; 