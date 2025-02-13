import { defineBackground } from 'wxt/sandbox';
import type { Message } from '../src/types';

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  // Listen for messages from content script
  browser.runtime.onMessage.addListener((message: Message) => {
    if (message.type === 'UPDATE_STATS') {
      // Forward stats to popup if it's open
      forwardStatsToPopup(message);
    }
  });
});

/**
 * Function to forward stats to the popup.
 * @param message - The message containing the stats to be forwarded.
 */
async function forwardStatsToPopup(message: Message) {
  try {
    await browser.runtime.sendMessage(message);
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Failed to send message to popup:', error);
  }
}
