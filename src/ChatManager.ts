import { browser } from 'wxt/browser';
import type { ChatInfo } from './types';
import { i18n } from './i18n';
import { LanguageDetector, FacebookLanguageDetector } from './services/LanguageService';
import { UIService, FacebookUIService } from './services/UIService';
import "../entrypoints/popup/App.css";
interface ChatElement {
  element: HTMLElement;
  title: string;
  selected: boolean;
}

interface Message {
  type: string;
  action?: string;
  stats?: {
    selectedCount: number;
    totalChats: number;
  }
  language?: string;
}

export class ChatManager {
  private chats: ChatInfo[] = [];
  private selectionMode = false;
  private sidebar: HTMLElement | null = null;
  private language: string = 'en';
  private readonly languageDetector: LanguageDetector;
  private readonly uiService: UIService;

  constructor(
    languageDetector: LanguageDetector = new FacebookLanguageDetector(),
    uiService: UIService = new FacebookUIService()
  ) {
    this.languageDetector = languageDetector;
    this.uiService = uiService;
  }

  async initialize() {
    try {
      // Detect initial language
      this.language = await this.languageDetector.detectLanguage();
      await i18n.changeLanguage(this.language);
      
      // Start monitoring language changes
      this.languageDetector.startLanguageMonitoring(async (newLang) => {
        this.language = newLang;
        await i18n.changeLanguage(newLang);
        
        // Notify popup about language change
        chrome.runtime.sendMessage({
          type: 'LANGUAGE_CHANGED',
          language: newLang
        });
      });
      
      if (!this.isMessagesPage()) {
        this.showNavigationPrompt();
        return;
      }

      // Add message listener
      chrome.runtime.onMessage.addListener(
        (message: Message, sender, sendResponse) => {
          // Now TypeScript knows 'message' has properties defined in the 'Message' interface
          if ("action" in message) {
            this.handleMessage(message);
          }
          
          return true; // Required if sendResponse is used asynchronously
        }
      );
      
      // Create and show sidebar
      this.createSidebar();
      this.showSidebar();
      this.observeChatList();
      await this.updateChatList();
      
    } catch (error) {
      console.error('Failed to initialize ChatManager:', error);
      this.uiService.showError(this.getTranslation('Failed to initialize'));
    }
  }

  private isMessagesPage(): boolean {
    return window.location.href.includes('/messages') || 
           window.location.hostname.includes('messenger.com');
  }

  private showNavigationPrompt() {
    const prompt = document.createElement('div');
    prompt.className = 'chat-manager-prompt';
    prompt.innerHTML = `
      <div class="prompt-content">
        <h3>${this.getTranslation('Wrong Page')}</h3>
        <p>${this.getTranslation('Please navigate to Facebook Messages to use this extension.')}</p>
        <button class="action-button primary" id="goto-messages">
          ${this.getTranslation('Go to Messages')}
        </button>
      </div>
    `;

    document.body.appendChild(prompt);
    
    prompt.querySelector('#goto-messages')?.addEventListener('click', () => {
      window.location.href = 'https://www.facebook.com/messages';
    });
  }

  private createSidebar() {
    // Create main sidebar container
    this.sidebar = document.createElement('div');
    this.sidebar.className = 'fb-chat-manager-sidebar';
    
    // Create sidebar content
    this.sidebar.innerHTML = `
      <div class="sidebar-header">
        <h3>${this.getTranslation('Chat Manager')}</h3>
        <button class="close-sidebar" title="${this.getTranslation('Close Sidebar')}">×</button>
      </div>
      
      <div class="sidebar-actions">
        <button class="action-button primary" id="toggle-selection">
          ${this.getTranslation('Select Chats')}
        </button>
        <button class="action-button secondary" id="select-all">
          ${this.getTranslation('Select All')}
        </button>
        <div class="action-group">
          <button class="action-button warning" id="archive-selected" disabled>
            ${this.getTranslation('Archive Selected')} (0)
          </button>
          <button class="action-button danger" id="delete-selected" disabled>
            ${this.getTranslation('Delete Selected')} (0)
          </button>
        </div>
      </div>

      <div class="chat-list-container">
        <div class="chat-list-header">
          <span>${this.getTranslation('Available Chats')}</span>
          <span class="chat-count">0</span>
        </div>
        <div class="chat-list"></div>
      </div>
    `;

    // Insert sidebar into the page
    document.body.appendChild(this.sidebar);
    this.attachEventListeners();
  }

  private showSidebar() {
    if (this.sidebar) {
      this.sidebar.classList.add('visible');
    }
  }

  private hideSidebar() {
    if (this.sidebar) {
      this.sidebar.classList.remove('visible');
    }
  }

  private attachEventListeners() {
    if (!this.sidebar) return;

    // Close button
    this.sidebar.querySelector('.close-sidebar')?.addEventListener('click', () => {
      this.hideSidebar();
    });

    // Action buttons
    this.sidebar.querySelector('#toggle-selection')?.addEventListener('click', () => {
      this.toggleSelectionMode();
    });

    this.sidebar.querySelector('#select-all')?.addEventListener('click', () => {
      this.selectAllChats();
    });

    this.sidebar.querySelector('#archive-selected')?.addEventListener('click', () => {
      this.confirmAction('archive');
    });

    this.sidebar.querySelector('#delete-selected')?.addEventListener('click', () => {
      this.confirmAction('delete');
    });

    // Handle escape key to close sidebar
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.sidebar?.classList.contains('visible')) {
        this.hideSidebar();
      }
    });
  }

  private toggleSelectionMode() {
    this.selectionMode = !this.selectionMode;
    
    if (!this.selectionMode) {
      // Clear selections when disabling selection mode
      this.clearSelections();
    }

    // Update UI
    if (this.sidebar) {
      const chatItems = this.sidebar.querySelectorAll('.chat-item');
      chatItems.forEach(item => {
        if (this.selectionMode) {
          item.classList.add('selectable');
        } else {
          item.classList.remove('selectable', 'selected');
        }
      });
    }
    
    this.updateSelectionUI();
  }

  private clearSelections() {
    if (!this.sidebar) return;
    const selectedItems = this.sidebar.querySelectorAll('.chat-item.selected');
    selectedItems.forEach(item => {
      item.classList.remove('selected');
    });
  }

  private updateSelectionUI() {
    if (!this.sidebar) return;

    const selectedCount = this.getSelectedChatIds().length;
    
    // Update selection mode UI
    if (this.selectionMode) {
      this.sidebar.classList.add('selection-mode');
    } else {
      this.sidebar.classList.remove('selection-mode');
    }

    // Update buttons state and text
    const archiveBtn = this.sidebar.querySelector('#archive-selected') as HTMLButtonElement;
    const deleteBtn = this.sidebar.querySelector('#delete-selected') as HTMLButtonElement;
    const selectBtn = this.sidebar.querySelector('#toggle-selection') as HTMLButtonElement;
    const chatCount = this.sidebar.querySelector('.chat-count');

    if (archiveBtn) {
      archiveBtn.disabled = selectedCount === 0;
      archiveBtn.textContent = `${this.getTranslation('Archive Selected')} (${selectedCount})`;
    }

    if (deleteBtn) {
      deleteBtn.disabled = selectedCount === 0;
      deleteBtn.textContent = `${this.getTranslation('Delete Selected')} (${selectedCount})`;
    }

    if (selectBtn) {
      selectBtn.textContent = this.selectionMode 
        ? this.getTranslation('Cancel Selection')
        : this.getTranslation('Select Chats');
    }

    if (chatCount) {
      chatCount.textContent = String(this.chats.length);
    }

    // Update popup stats
    this.updatePopupStats();
  }

  private getTranslation(key: string): string {
    return i18n.t(key);
  }

  private observeChatList() {
    const observer = new MutationObserver(() => {
      observer.disconnect(); // Disconnect to avoid multiple updates
      this.updateChatList();
    });

    const chatList = document.querySelector('[role="navigation"]');
    if (chatList) {
      observer.observe(chatList, { childList: true, subtree: true });
    }
  }

  private async updateChatList(): Promise<void> {
    try {
      // Clear existing chats
      this.chats = [];
      
      // Find all chat elements in Facebook's chat list
      const chatElements = document.querySelectorAll('[role="row"]');
      if (chatElements.length === 0) {
        console.warn('No chat elements found. Waiting for the chat list to load.');
        await this.waitForElement('[role="row"]');
        return this.updateChatList(); // Retry updating the chat list
      }
      
      const newChats: ChatInfo[] = [];

      chatElements.forEach((chat) => {
        if (chat instanceof HTMLElement) {
          // Extract chat information
          const titleElement = chat.querySelector('[role="gridcell"]');
          const title = titleElement?.textContent?.trim() || 'Unknown Chat';
          const lastMessageElement = chat.querySelector('[role="gridcell"]:nth-child(2)');
          const lastMessage = lastMessageElement?.textContent?.trim();
          const avatarElement = chat.querySelector('img');
          const avatar = avatarElement?.getAttribute('src');

          // Use a more reliable ID generation
          const id = chat.getAttribute('data-testid') || 
                    chat.getAttribute('id') || 
                    `chat-${title}-${Math.random().toString(36).substr(2, 9)}`; // Use random string for uniqueness

          newChats.push({ 
            id, 
            title, 
            avatar: avatar ?? undefined, 
            lastMessage,
            element: chat
          });

          // Maintain selection state when updating list
          if (this.selectionMode && this.isSelected(id)) {
            chat.classList.add('selected');
          }
        }
      });

      this.chats = newChats;
      this.updateSidebarChatList();
      this.updateSelectionUI();
      
    } catch (error) {
      console.error('Failed to update chat list:', error);
      this.uiService.showError(this.getTranslation('Failed to load chat list. Please try refreshing the page.'));
    }
  }

  private updateSidebarChatList() {
    if (!this.sidebar) return;

    const chatListContainer = this.sidebar.querySelector('.chat-list');
    if (!chatListContainer) return;

    // Clear existing content
    chatListContainer.innerHTML = '';

    // Create and append chat items
    this.chats.forEach(chat => {
      const chatItem = document.createElement('div');
      chatItem.className = 'chat-item';
      chatItem.dataset.chatId = chat.id;
      
      // Add selected class if in selection mode and chat was selected
      if (this.selectionMode && this.isSelected(chat.id)) {
        chatItem.classList.add('selected');
      }
      
      chatItem.innerHTML = `
        <div class="checkbox"></div>
        ${chat.avatar ? `<img src="${chat.avatar}" class="chat-avatar" alt="">` : ''}
        <div class="chat-info">
          <div class="chat-title">${chat.title}</div>
          ${chat.lastMessage ? `<div class="chat-preview">${chat.lastMessage}</div>` : ''}
        </div>
      `;

      // Add click handler
      chatItem.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.selectionMode) {
          chatItem.classList.toggle('selected');
          this.updateSelectionUI();
        }
      });

      chatListContainer.appendChild(chatItem);
    });

    // Update selection UI
    this.updateSelectionUI();
  }

  private initializeChatElement(chat: HTMLElement, id: string) {
    chat.dataset.chatManagerInitialized = 'true';
    chat.dataset.id = id;
  }

  private async archiveSelectedChats() {
    const loading = this.uiService.showLoading(this.getTranslation('Archiving chats...'));
    try {
      const selectedIds = this.getSelectedChatIds();
      let successCount = 0;

      for (const id of selectedIds) {
        const chat = this.chats.find(c => c.id === id);
        if (chat?.element) {
          try {
            // Find and click the menu button for this specific chat
            const menuButton = this.findMenuButton(chat.element);
            if (menuButton) {
              menuButton.click();
              await this.waitForAnimation(800);

              // Find and click the Archive option
              const archiveButton = this.findMenuItem('Archive');
              if (archiveButton) {
                archiveButton.click();
                successCount++;
                await this.waitForAnimation(800);
              }
            }
          } catch (error) {
            console.error('Failed to archive chat:', error);
          }
        }
      }

      if (successCount > 0) {
        this.uiService.showToast(this.getTranslation('Successfully archived', { count: successCount }));
        await this.waitForAnimation(800);
        this.updateChatList();
      }

      this.toggleSelectionMode();
    } catch (error) {
      this.uiService.showError(this.getTranslation('Failed to archive'));
    } finally {
      this.uiService.hideLoading(loading);
    }
  }

  private findMenuButton(chatElement: HTMLElement): HTMLElement | null {
    // Try different possible selectors for the menu button
    const selectors = [
      '[aria-label*="More actions"]',
      '[aria-label*="Menu"]',
      '[aria-label*="more"]',
      '[aria-label*="options"]',
      '[data-testid*="menu"]',
      '[data-testid*="more"]'
    ];

    for (const selector of selectors) {
      const button = chatElement.querySelector(selector);
      if (button instanceof HTMLElement) {
        return button;
      }
    }

    return null;
  }

  private findMenuItem(text: string): HTMLElement | null {
    const menuItems = document.querySelectorAll('[role="menuitem"] div:not([role])');
    return Array.from(menuItems)
      .find(item => item.textContent?.toLowerCase().includes(text.toLowerCase())) as HTMLElement || null;
  }

  private async deleteSelectedChats() {
    const loading = this.uiService.showLoading('Deleting chats...');
    try {
      const selectedIds = this.getSelectedChatIds();
      let successCount = 0;

      for (const id of selectedIds) {
        const chat = this.chats.find(c => c.id === id);
        if (chat?.element) {
          try {
            // Find the menu button using multiple possible selectors
            const menuButton = chat.element.querySelector(
              '[aria-label*="More actions"], [aria-label*="Menu"], [aria-label*="more"], [aria-label*="options"]'
            );

            if (menuButton instanceof HTMLElement) {
              // Click the menu button and wait for menu to appear
              menuButton.click();
              await this.waitForAnimation(800);

              // Try different possible menu item selectors
              const menuItems = document.querySelectorAll('[role="menuitem"] div:not([role])');
              const deleteButton = Array.from(menuItems)
                .find(item => item.textContent?.toLowerCase().includes('delete'));

              if (deleteButton instanceof HTMLElement) {
                deleteButton.click();
                await this.waitForAnimation(800);

                // Handle confirmation dialog with multiple possible selectors
                const confirmButton = document.querySelector(
                  '[role="dialog"] button[type="submit"], [role="dialog"] [aria-label*="Delete"]'
                );

                if (confirmButton instanceof HTMLElement) {
                  confirmButton.click();
                  successCount++;
                  await this.waitForAnimation(800);
                }
              }
            }
          } catch (error) {
            console.error('Failed to delete chat:', error);
          }
        }
      }

      if (successCount > 0) {
        this.uiService.showToast(this.getTranslation('Successfully deleted', { count: successCount }));
        await this.waitForAnimation(800);
        this.updateChatList();
      }

      this.toggleSelectionMode();
    } catch (error) {
      this.uiService.showError(this.getTranslation('Failed to delete'));
    } finally {
      this.uiService.hideLoading(loading);
    }
  }

  private getSelectedChatIds(): string[] {
    if (!this.sidebar) return [];
    
    const selectedItems = this.sidebar.querySelectorAll('.chat-item.selected');
    return Array.from(selectedItems)
      .map(item => item.getAttribute('data-chat-id'))
      .filter((id): id is string => id !== null);
  }

  private findFacebookChatElement(sidebarChatElement: Element): HTMLElement | null {
    const chatTitle = sidebarChatElement.querySelector('.chat-title')?.textContent;
    if (!chatTitle) return null;

    // Find the corresponding chat in Facebook's UI
    const allFbChats = document.querySelectorAll('[role="row"]');
    for (const chat of allFbChats) {
      if (chat instanceof HTMLElement) {
        const title = chat.querySelector('[role="gridcell"]')?.textContent;
        if (title === chatTitle) {
          return chat;
        }
      }
    }
    return null;
  }

  private async openChatMenu(chatElement: HTMLElement): Promise<boolean> {
    // Find the menu button (usually has an aria-label containing "More" or "Menu")
    const menuButton = chatElement.querySelector('[aria-label*="Menu"], [aria-label*="More"]');
    if (menuButton instanceof HTMLElement) {
      menuButton.click();
      // Wait for menu to appear
      await this.waitForElement('[role="menu"]');
      return true;
    }
    return false;
  }

  private async clickMenuOption(optionText: string): Promise<boolean> {
    // Wait a bit for the menu to be fully rendered
    await this.waitForAnimation(100);
    
    // Find the menu option by its text content
    const menuItems = document.querySelectorAll('[role="menuitem"]');
    for (const item of menuItems) {
      if (item.textContent?.includes(optionText)) {
        (item as HTMLElement).click();
        return true;
      }
    }
    return false;
  }

  private async handleDeleteConfirmation(): Promise<void> {
    // Wait for the confirmation dialog
    await this.waitForAnimation(100);
    
    // Look for the confirm delete button
    const confirmButton = document.querySelector(
      '[role="dialog"] button[type="submit"], [role="dialog"] [aria-label*="Delete"]'
    );
    
    if (confirmButton instanceof HTMLElement) {
      confirmButton.click();
      // Wait for the deletion to complete
      await this.waitForAnimation(500);
    }
  }

  private updatePopupStats() {
    const stats = {
      selectedCount: this.getSelectedChatIds().length,
      totalChats: this.chats.length
    };
    
    browser.runtime.sendMessage({
      type: 'UPDATE_STATS',
      stats
    });
  }

  private handleMessage(message: Message) {
    if (!message.action) return;

    switch (message.action) {
      case 'TOGGLE_SELECTION':
        this.toggleSelectionMode();
        break;
      case 'SELECT_ALL':
        this.selectAllChats();
        break;
      case 'ARCHIVE_SELECTED':
        this.confirmAction('archive');
        break;
      case 'DELETE_SELECTED':
        this.confirmAction('delete');
        break;
      case 'GET_LANGUAGE':
        chrome.runtime.sendMessage({
          type: 'LANGUAGE_CHANGED',
          language: this.language
        });
        break;
      case 'UPDATE_LANGUAGE':
        if (message.language) {
          this.updateLanguage(message.language);
        }
        break;
    }
    this.updatePopupStats();
  }

  private async updateLanguage(newLanguage: string) {
    try {
      this.language = newLanguage;
      await i18n.changeLanguage(newLanguage);
      
      // Notify popup about language change
      chrome.runtime.sendMessage({
        type: 'LANGUAGE_CHANGED',
        language: newLanguage
      });
    } catch (error) {
      console.error('Failed to update language:', error);
      this.uiService.showError(this.getTranslation('Failed to change language'));
    }
  }

  private selectAllChats() {
    if (!this.sidebar) return;
    
    // Enable selection mode if not already enabled
    if (!this.selectionMode) {
      this.toggleSelectionMode();
    }

    // Select all chat items
    const chatItems = this.sidebar.querySelectorAll('.chat-item');
    chatItems.forEach(item => {
      item.classList.add('selected');
    });

    this.updateSelectionUI();
  }

  private async confirmAction(action: 'archive' | 'delete') {
    const selectedCount = this.getSelectedChatIds().length;
    
    if (selectedCount === 0) {
      this.uiService.showToast(this.getTranslation('Please select at least one chat first'));
      return;
    }

    const actionText = action === 'archive' ? 'archive' : 'delete';
    
    const confirmed = await this.showConfirmDialog(
      this.getTranslation(`Confirm ${actionText}`),
      this.getTranslation(`Are you sure you want to ${actionText} ${selectedCount} chat${selectedCount > 1 ? 's' : ''}?`)
    );

    if (confirmed) {
      if (action === 'archive') {
        await this.archiveSelectedChats();
      } else {
        await this.deleteSelectedChats();
      }
    }
  }

  private showConfirmDialog(title: string, message: string): Promise<boolean> {
    return new Promise((resolve) => {
      const dialog = document.createElement('div');
      dialog.className = 'chat-manager-dialog';
      dialog.innerHTML = `
        <div class="dialog-content">
          <h4>${title}</h4>
          <p>${message}</p>
          <div class="dialog-actions">
            <button class="action-button cancel" id="dialog-cancel">
              <i class="fas fa-times"></i> ${this.getTranslation('Cancel')}
            </button>
            <button class="action-button confirm" id="dialog-confirm">
              <i class="fas fa-check"></i> ${this.getTranslation('Confirm')}
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(dialog);

      const handleResponse = (confirmed: boolean) => {
        document.body.removeChild(dialog);
        resolve(confirmed);
      };

      dialog.querySelector('#dialog-cancel')?.addEventListener('click', () => handleResponse(false));
      dialog.querySelector('#dialog-confirm')?.addEventListener('click', () => handleResponse(true));
    });
  }

  private waitForAnimation(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private isSelected(chatId: string): boolean {
    const chatItem = this.sidebar?.querySelector(`[data-chat-id="${chatId}"]`);
    return chatItem?.classList.contains('selected') || false;
  }

  private async waitForElement(selector: string): Promise<Element> {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        return resolve(element);
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Set a timeout to reject the promise if the element is not found within a reasonable time
      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element with selector "${selector}" not found within the timeout period.`));
      }, 10000); // Adjust the timeout as necessary
    });
  }
}
