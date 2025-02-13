import { useState, useEffect } from 'react';
import { ChatInfo } from '../types';
import { ChatOperations } from '../services/ChatOperations';
import { ErrorMessages } from '../services/ErrorMessages';

export const useFacebookChat = () => {
  const [chats, setChats] = useState<ChatInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const performChatAction = async (
    chatId: string,
    action: 'archive' | 'delete'
  ): Promise<boolean> => {
    try {
      const element = document.getElementById(chatId);
      if (!element) {
        throw new Error(ErrorMessages.CHAT_NOT_FOUND.message);
      }

      const menuButton = await ChatOperations.findMenuButton(element);
      if (!menuButton) {
        throw new Error(ErrorMessages.MENU_NOT_FOUND.message);
      }

      menuButton.click();
      await ChatOperations.waitForAnimation(800);

      const menuItem = await ChatOperations.findMenuItem(action);
      if (!menuItem) {
        throw new Error(ErrorMessages.MENU_NOT_FOUND.message);
      }

      menuItem.click();
      await ChatOperations.waitForAnimation(800);

      return true;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(ErrorMessages.ACTION_FAILED.message);
      }
      return false;
    }
  };

  const updateChatList = async () => {
    try {
      const chatElements = document.querySelectorAll('[role="row"]');
      if (chatElements.length === 0) {
        await ChatOperations.waitForElement('[role="row"]');
      }

      const newChats: ChatInfo[] = Array.from(chatElements).map(element => ({
        id: element.id || `chat-${Math.random().toString(36).substr(2, 9)}`,
        title: element.querySelector('.chat-title')?.textContent || 'Unknown Chat',
        avatar: element.querySelector('img')?.src,
        lastMessage: element.querySelector('.chat-preview')?.textContent
      }));

      setChats(newChats);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(ErrorMessages.ACTION_FAILED.message);
      }
    }
  };

  useEffect(() => {
    updateChatList();
    const observer = new MutationObserver(updateChatList);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, []);

  return {
    chats,
    error,
    performChatAction,
    updateChatList,
    clearError: () => setError(null)
  };
}; 