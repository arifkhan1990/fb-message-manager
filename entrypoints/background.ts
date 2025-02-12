import { defineBackground } from 'wxt/sandbox';
import type { Message } from '../src/types';

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  // Listen for messages from content script
  browser.runtime.onMessage.addListener((message: Message) => {
    if (message.type === 'UPDATE_STATS') {
      // Forward stats to popup if it's open
      browser.runtime.sendMessage(message).catch(() => {
        // Popup might not be open, ignore error
      });
    }
  });
});
