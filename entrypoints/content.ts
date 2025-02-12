import { defineContentScript } from 'wxt/sandbox';
import { ChatManager } from '../src/ChatManager';
import '../src/styles/chat-manager.css';

export default defineContentScript({
  matches: ['*://*.facebook.com/messages/*', '*://*.messenger.com/*'],
  async main() {
    // Wait for the page to be ready
    await waitForElement('[role="navigation"]');

    // Create toggle button for sidebar
    const toggleButton = document.createElement('button');
    toggleButton.className = 'chat-manager-toggle';
    toggleButton.innerHTML = '✕'; // Start with X since sidebar will be visible
    toggleButton.title = 'Toggle Chat Manager';
    document.body.appendChild(toggleButton);

    // Initialize chat manager
    const chatManager = new ChatManager();
    await chatManager.initialize();

    // Toggle sidebar visibility
    toggleButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const sidebar = document.querySelector('.fb-chat-manager-sidebar');
      if (sidebar) {
        sidebar.classList.toggle('visible');
        toggleButton.innerHTML = sidebar.classList.contains('visible') ? '✕' : '📝';
      }
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      const sidebar = document.querySelector('.fb-chat-manager-sidebar');
      const target = e.target as HTMLElement;
      
      if (sidebar && 
          !sidebar.contains(target) && 
          !target.classList.contains('chat-manager-toggle')) {
        sidebar.classList.remove('visible');
        toggleButton.innerHTML = '📝';
      }
    });
  },
});

function waitForElement(selector: string): Promise<Element> {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector)!);
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector)!);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}
