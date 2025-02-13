import React from 'react';
import { ChatInfo } from '../types';

interface ChatItemProps {
  chat: ChatInfo;
  isSelected: boolean;
  isSelectable: boolean;
  onSelect: (chatId: string) => void;
}

export const ChatItem: React.FC<ChatItemProps> = ({
  chat,
  isSelected,
  isSelectable,
  onSelect
}) => {
  return (
    <div
      className={`chat-item ${isSelectable ? 'selectable' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={() => isSelectable && onSelect(chat.id)}
    >
      <div className="checkbox" />
      {chat.avatar && (
        <img src={chat.avatar} className="chat-avatar" alt="" />
      )}
      <div className="chat-info">
        <div className="chat-title">{chat.title}</div>
        {chat.lastMessage && (
          <div className="chat-preview">{chat.lastMessage}</div>
        )}
      </div>
    </div>
  );
}; 