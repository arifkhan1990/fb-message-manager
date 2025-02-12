import { useState, useEffect } from "react";
import "./App.css";

interface ChatStats {
  selectedCount: number;
  totalChats: number;
}

function App() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [stats, setStats] = useState<ChatStats>({
    selectedCount: 0,
    totalChats: 0,
  });
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null);

  useEffect(() => {
    // Check if we're on a valid Facebook Messages page
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const isMessengerPage = tab.url?.match(
        /(facebook\.com\/messages|messenger\.com)/
      );
      setCurrentTab(tab);
      setIsEnabled(!!isMessengerPage);
    });

    // Listen for updates from content script
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === "UPDATE_STATS") {
        setStats(message.stats);
      }
    });
  }, []);

  const sendMessageToContent = async (action: string) => {
    if (!currentTab?.id) return;

    try {
      await chrome.tabs.sendMessage(currentTab.id, { action });
    } catch (error) {
      console.error("Failed to send message to content script:", error);
    }
  };

  const navigateToMessages = async () => {
    try {
      // Try messenger.com first
      await chrome.tabs.update(currentTab?.id ?? -1, {
        url: "https://www.messenger.com",
      });
    } catch {
      // Fallback to facebook.com/messages
      await chrome.tabs.update(currentTab?.id ?? -1, {
        url: "https://www.facebook.com/messages",
      });
    }
  };

  if (!isEnabled) {
    return (
      <div className="app-container">
        <h2>Facebook Chat Manager</h2>
        <div className="error-container">
          <p className="error-message">
            This extension only works on Facebook Messages
          </p>
          <button
            className="action-button primary"
            onClick={navigateToMessages}
          >
            Go to Messages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h2>Facebook Chat Manager</h2>

      <div className="stats-container">
        <p>Total Chats: {stats.totalChats}</p>
        <p>Selected: {stats.selectedCount}</p>
      </div>

      <div className="actions-container">
        <button
          className="action-button"
          onClick={() => sendMessageToContent("TOGGLE_SELECTION")}
        >
          Select Chats
        </button>

        <button
          className="action-button"
          onClick={() => sendMessageToContent("SELECT_ALL")}
        >
          Select All
        </button>

        <button
          className="action-button warning"
          onClick={() => sendMessageToContent("ARCHIVE_SELECTED")}
          disabled={stats.selectedCount === 0}
        >
          Archive Selected ({stats.selectedCount})
        </button>

        <button
          className="action-button danger"
          onClick={() => sendMessageToContent("DELETE_SELECTED")}
          disabled={stats.selectedCount === 0}
        >
          Delete Selected ({stats.selectedCount})
        </button>
      </div>

      <div className="help-text">
        <p>💡 Tip: Click on chats to select them for bulk actions</p>
      </div>
    </div>
  );
}

export default App;
