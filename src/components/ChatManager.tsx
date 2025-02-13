import React, { useState, useEffect } from 'react';
import { ChatList } from './ChatList';
import { ActionBar } from './ActionBar';
import { Dialog } from './Dialog';
import { Toast } from './Toast';
import { LoadingSpinner } from './LoadingSpinner';
import { ChatInfo } from '../types';
import { useTranslation } from 'react-i18next';
import { SidebarHeader } from './SidebarHeader';
import { ChatActionHandler } from './ChatActionHandler';

interface ChatManagerProps {
  onClose: () => void;
}

export const ChatManager: React.FC<ChatManagerProps> = ({ onClose }) => {
  const [chats, setChats] = useState<ChatInfo[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action?: () => Promise<void>;
  }>({ isOpen: false, title: '', message: '' });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  const { t: getTranslation } = useTranslation();

  useEffect(() => {
    updateChatList();
  }, []);

  const updateChatList = async () => {
    // Implementation of chat list update logic
    // This would interact with the Facebook DOM to get chat information
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatIds(prev => 
      prev.includes(chatId) 
        ? prev.filter(id => id !== chatId)
        : [...prev, chatId]
    );
  };

  const handleToggleSelection = () => {
    setSelectionMode(prev => !prev);
    if (selectionMode) {
      setSelectedChatIds([]);
    }
  };

  const handleSelectAll = () => {
    if (!selectionMode) {
      setSelectionMode(true);
    }
    setSelectedChatIds(chats.map(chat => chat.id));
  };

  const handleArchiveSelected = () => {
    showConfirmDialog(
      getTranslation('Confirm archive'),
      getTranslation('Are you sure you want to archive selected chats?'),
      archiveSelectedChats
    );
  };

  const handleDeleteSelected = () => {
    showConfirmDialog(
      getTranslation('Confirm delete'),
      getTranslation('Are you sure you want to delete selected chats?'),
      deleteSelectedChats
    );
  };

  const showConfirmDialog = (title: string, message: string, action: () => Promise<void>) => {
    setDialog({ isOpen: true, title, message, action });
  };

  const archiveSelectedChats = async () => {
    // Implementation of archive logic
  };

  const deleteSelectedChats = async () => {
    // Implementation of delete logic
  };

  return (
    <div className="fb-chat-manager-sidebar">
      <SidebarHeader 
        title={getTranslation('Chat Manager')}
        onClose={onClose}
      />

      <ActionBar
        selectionMode={selectionMode}
        selectedCount={selectedChatIds.length}
        onToggleSelection={handleToggleSelection}
        onSelectAll={handleSelectAll}
        onArchiveSelected={handleArchiveSelected}
        onDeleteSelected={handleDeleteSelected}
        getTranslation={getTranslation}
      />

      <ChatList
        chats={chats}
        selectionMode={selectionMode}
        onChatSelect={handleChatSelect}
        selectedChatIds={selectedChatIds}
      />

      <ChatActionHandler
        isLoading={isLoading}
        loadingMessage={getTranslation('Processing...')}
        toast={toast}
        onToastClose={() => setToast(null)}
        dialog={dialog}
        onDialogConfirm={async () => {
          if (dialog.action) {
            await dialog.action();
          }
          setDialog({ isOpen: false, title: '', message: '' });
        }}
        onDialogCancel={() => setDialog({ isOpen: false, title: '', message: '' })}
      />
    </div>
  );
}; 