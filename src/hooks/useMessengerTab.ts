import { useState, useEffect } from 'react';

export function useMessengerTab() {
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      const isMessengerPage = tab.url?.match(
        /^(https?:\/\/)?(www\.)?(facebook\.com\/messages|messenger\.com)\/?/
      );
      setCurrentTab(tab);
      setIsEnabled(!!isMessengerPage);

      if (isMessengerPage && tab.id) {
        try {
          await chrome.tabs.sendMessage(tab.id, { action: "GET_LANGUAGE" });
        } catch (error) {
          console.error("Failed to request language:", error);
        }
      }
    });
  }, []);

  const navigateToMessages = async () => {
    if (!currentTab?.id) return;

    const urls = ["https://www.messenger.com", "https://www.facebook.com/messages"];
    let success = false;

    for (const url of urls) {
      try {
        await chrome.tabs.update(currentTab.id, { url });
        success = true;
        break;
      } catch (error) {
        console.error(`Failed to navigate to ${url}:`, error);
      }
    }

    if (success) {
      window.close();
    }
  };

  return {
    currentTab,
    isEnabled,
    navigateToMessages
  };
} 