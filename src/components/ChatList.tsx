import React from 'react';
import { ChatItem } from './ChatItem';
import { ChatListHeader } from './ChatListHeader';
import { ChatInfo } from '../types';

interface ChatListProps {
  chats: ChatInfo[];
  selectionMode: boolean;
  onChatSelect: (chatId: string) => void;
  selectedChatIds: string[];
  getTranslation: (key: string) => string;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectionMode,
  onChatSelect,
  selectedChatIds,
  getTranslation
}) => {
  return (
    <div className="chat-list-container">
      <ChatListHeader 
        title={getTranslation('Available Chats')}
        count={chats.length}
      />
      <div className="chat-list">
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isSelected={selectedChatIds.includes(chat.id)}
            isSelectable={selectionMode}
            onSelect={onChatSelect}
          />
        ))}
      </div>
    </div>
  );
}; 