import { ErrorMessages } from './ErrorMessages';

export class ChatOperations {
  static async findMenuButton(chatElement: HTMLElement | null): Promise<HTMLElement | null> {
    if (!chatElement) {
      throw new Error(ErrorMessages.CHAT_NOT_FOUND.message);
    }
    
    const selectors = [
      '[aria-label*="More actions"]',
      '[aria-label*="Menu"]',
      '[aria-label*="more"]',
      '[aria-label*="options"]'
    ];

    for (const selector of selectors) {
      const button = chatElement.querySelector(selector);
      if (button instanceof HTMLElement) {
        return button;
      }
    }

    throw new Error(ErrorMessages.MENU_NOT_FOUND.message);
  }

  static async findMenuItem(text: string): Promise<HTMLElement | null> {
    try {
      const menuItems = document.querySelectorAll('[role="menuitem"] div:not([role])');
      const menuItem = Array.from(menuItems)
        .find(item => item.textContent?.toLowerCase().includes(text.toLowerCase()));
      
      if (!menuItem) {
        throw new Error(ErrorMessages.MENU_NOT_FOUND.message);
      }
      
      return menuItem as HTMLElement;
    } catch (error) {
      throw new Error(ErrorMessages.ACTION_FAILED.message);
    }
  }

  static async waitForElement(selector: string, timeout = 10000): Promise<Element> {
    return new Promise((resolve, reject) => {
      try {
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

        setTimeout(() => {
          observer.disconnect();
          reject(new Error(ErrorMessages.ELEMENT_TIMEOUT.message));
        }, timeout);
      } catch (error) {
        reject(new Error(ErrorMessages.ACTION_FAILED.message));
      }
    });
  }

  static waitForAnimation(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
} 