import React from 'react';
import { Button } from './Button';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';

interface SelectionButtonProps {
  isSelectionMode: boolean;
  onClick: () => void;
  getTranslation: (key: string) => string;
}

export const SelectionButton: React.FC<SelectionButtonProps> = ({
  isSelectionMode,
  onClick,
  getTranslation
}) => {
  return (
    <Button
      variant="primary"
      onClick={onClick}
      icon={<IoCheckmarkDoneSharp size={20} />}
    >
      {isSelectionMode 
        ? getTranslation('Cancel Selection')
        : getTranslation('Select Chats')
      }
    </Button>
  );
}; 