import React from 'react';
import { ChatMenuItem } from './ChatMenuItem';
import { IoArchiveSharp, IoTrashSharp, IoEllipsisVertical } from 'react-icons/io5';

interface ChatContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onArchive: () => void;
  onDelete: () => void;
  position: { x: number; y: number };
}

export const ChatContextMenu: React.FC<ChatContextMenuProps> = ({
  isOpen,
  onClose,
  onArchive,
  onDelete,
  position
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="chat-context-menu"
      style={{ 
        position: 'absolute',
        top: position.y,
        left: position.x 
      }}
    >
      <ChatMenuItem
        label="Archive"
        onClick={onArchive}
        icon={<IoArchiveSharp />}
      />
      <ChatMenuItem
        label="Delete"
        onClick={onDelete}
        icon={<IoTrashSharp />}
      />
    </div>
  );
}; 