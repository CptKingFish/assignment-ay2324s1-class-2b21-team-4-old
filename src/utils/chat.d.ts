interface ChatMenuItemProps {
  id: string;
  avatarUrl: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
}

interface TeamMenuItemProps {
  id: string;
  avatarUrl: string;
  name: string;
  lastSender: string;
  lastMessage: string;
  lastMessageTime: string;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}
