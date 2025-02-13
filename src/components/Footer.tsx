import React from 'react';
import { IoHeartSharp } from 'react-icons/io5';

interface FooterProps {
  authorName: string;
  authorUrl: string;
}

export const Footer: React.FC<FooterProps> = ({ authorName, authorUrl }) => {
  return (
    <footer className="footer-container">
      Developed by <IoHeartSharp size={14} />
      <a href={authorUrl} target="_blank" rel="noopener noreferrer">
        {authorName}
      </a>
    </footer>
  );
}; 