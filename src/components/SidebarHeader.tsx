import React from 'react';
import { IoCloseSharp } from 'react-icons/io5';

interface SidebarHeaderProps {
  title: string;
  onClose: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ title, onClose }) => {
  return (
    <div className="sidebar-header">
      <h3>{title}</h3>
      <button 
        className="close-sidebar" 
        onClick={onClose}
        aria-label="Close"
      >
        <IoCloseSharp size={20} />
      </button>
    </div>
  );
}; 