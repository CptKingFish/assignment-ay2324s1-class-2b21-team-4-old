export interface ChatMenuItemProps {
  id: string;
  avatarUrl: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
}

export interface TeamMenuItemProps {
  id: string;
  avatarUrl: string;
  name: string;
  lastSender: string;
  lastMessage: string;
  lastMessageTime: string;
}
