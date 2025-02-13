import React from 'react';
import { Button } from './Button';

interface NavigationPromptProps {
  title: string;
  message: string;
  buttonText: string;
  onNavigate: () => void;
}

export const NavigationPrompt: React.FC<NavigationPromptProps> = ({
  title,
  message,
  buttonText,
  onNavigate
}) => {
  return (
    <div className="chat-manager-prompt">
      <div className="prompt-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <Button 
          variant="primary" 
          onClick={onNavigate}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}; 