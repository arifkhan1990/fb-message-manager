import React from 'react';

interface ChatMenuItemProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const ChatMenuItem: React.FC<ChatMenuItemProps> = ({
  label,
  onClick,
  icon,
  disabled = false
}) => {
  return (
    <button
      className="chat-menu-item"
      onClick={onClick}
      disabled={disabled}
      role="menuitem"
    >
      {icon && <span className="menu-item-icon">{icon}</span>}
      <span className="menu-item-label">{label}</span>
    </button>
  );
}; 