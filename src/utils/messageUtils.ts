export async function sendMessageToContent(tabId: number, action: string): Promise<void> {
  try {
    await chrome.tabs.sendMessage(tabId, { action });
  } catch (error) {
    console.error("Failed to send message to content script:", error);
    throw new Error('Failed to send message to content script.');
  }
}

export function showAlert(message: string): void {
  alert(message);
} 