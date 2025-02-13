import React from 'react';

interface ChatListHeaderProps {
  title: string;
  count: number;
}

export const ChatListHeader: React.FC<ChatListHeaderProps> = ({ title, count }) => {
  return (
    <div className="chat-list-header">
      <span>{title}</span>
      <span className="chat-count">{count}</span>
    </div>
  );
}; 