import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { Toast } from './Toast';
import { Dialog } from './Dialog';

interface ChatActionHandlerProps {
  isLoading: boolean;
  loadingMessage?: string;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  onToastClose: () => void;
  dialog: {
    isOpen: boolean;
    title: string;
    message: string;
    action?: () => Promise<void>;
  };
  onDialogConfirm: () => void;
  onDialogCancel: () => void;
}

export const ChatActionHandler: React.FC<ChatActionHandlerProps> = ({
  isLoading,
  loadingMessage,
  toast,
  onToastClose,
  dialog,
  onDialogConfirm,
  onDialogCancel
}) => {
  return (
    <>
      {isLoading && (
        <LoadingSpinner message={loadingMessage} />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={onToastClose}
        />
      )}

      {dialog.isOpen && (
        <Dialog
          isOpen={dialog.isOpen}
          title={dialog.title}
          message={dialog.message}
          onConfirm={onDialogConfirm}
          onCancel={onDialogCancel}
        />
      )}
    </>
  );
}; 