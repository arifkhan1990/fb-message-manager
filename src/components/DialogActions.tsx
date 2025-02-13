import React from 'react';
import { Button } from './Button';

interface DialogActionsProps {
  onConfirm: () => void;
  onCancel: () => void;
  confirmText: string;
  cancelText: string;
}

export const DialogActions: React.FC<DialogActionsProps> = ({
  onConfirm,
  onCancel,
  confirmText,
  cancelText
}) => {
  return (
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
  );
}; 