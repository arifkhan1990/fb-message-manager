import { useState, useEffect } from 'react';

export interface ChatStats {
  selectedCount: number;
  totalChats: number;
}

export function useChatStats() {
  const [stats, setStats] = useState<ChatStats>({
    selectedCount: 0,
    totalChats: 0,
  });

  useEffect(() => {
    const handleStatsUpdate = (message: { type: string; stats?: ChatStats }) => {
      if (message.type === "UPDATE_STATS" && message.stats) {
        setStats(message.stats);
      }
    };

    chrome.runtime.onMessage.addListener(handleStatsUpdate);

    return () => {
      chrome.runtime.onMessage.removeListener(handleStatsUpdate);
    };
  }, []);

  return stats;
} 