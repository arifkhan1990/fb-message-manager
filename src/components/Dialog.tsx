import React from 'react';
import { Button } from './Button';

interface DialogProps {
  title: string;
  message: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  title,
  message,
  isOpen,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  if (!isOpen) return null;

  return (
    <div className="chat-manager-dialog">
      <div className="dialog-content">
        <h4>{title}</h4>
        <p>{message}</p>
        <div className="dialog-actions">
          <Button 
            variant="secondary" 
            onClick={onCancel}
            className="cancel"
          >
            {cancelText}
          </Button>
          <Button 
            variant="primary" 
            onClick={onConfirm}
            className="confirm"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}; 