import type { ObjectId } from "mongoose";

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
  _id: ObjectId;
  sender: {
    _id: ObjectId;
    username: string;
  };
  text: string;
  timestamp: number;
}

interface ChatRoom {
  id: string;
  name: string;
  avatarUrl?: string;
  type: "personal" | "team";
  messages: Message[];
  participants: string[];
}
