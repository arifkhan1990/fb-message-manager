import { ChatManager } from '../ChatManager';
import { i18n } from '../i18n';

describe('ChatManager', () => {
  let chatManager: ChatManager;
  
  beforeEach(() => {
    document.body.innerHTML = '';
    chatManager = new ChatManager();
  });

  describe('Language Detection', () => {
    it('should detect language from HTML lang attribute', async () => {
      document.documentElement.lang = 'bn';
      await chatManager.initialize();
      expect(i18n.language).toBe('bn');
    });

    it('should detect language from meta tag', async () => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:locale');
      meta.setAttribute('content', 'es_ES');
      document.head.appendChild(meta);
      await chatManager.initialize();
      expect(i18n.language).toBe('es');
    });

    it('should fallback to English if no language detected', async () => {
      await chatManager.initialize();
      expect(i18n.language).toBe('en');
    });
  });

  describe('Chat Selection', () => {
    it('should correctly select and deselect chats', () => {
      const chatElement = document.createElement('div');
      chatElement.className = 'chat-item';
      chatElement.dataset.chatId = 'test-chat-1';
      
      chatManager['sidebar']?.querySelector('.chat-list')?.appendChild(chatElement);
      
      chatManager.toggleSelectionMode();
      chatElement.click();
      
      expect(chatElement.classList.contains('selected')).toBe(true);
      expect(chatManager.getSelectedChatIds()).toContain('test-chat-1');
    });
  });
}); 