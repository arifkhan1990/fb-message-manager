export interface ChatInfo {
  id: string;
  title: string;
  avatar?: string;
  lastMessage?: string;
  element?:  HTMLElement;
  selected?: boolean;
}

export interface Message {
  type: string;
  action?: string;
  stats?: {
    selectedCount: number;
    totalChats: number;
  };
} 