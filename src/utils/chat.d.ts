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
  hasImage: boolean;
  image_url?: string;
  hasReplyTo: boolean;
  _id: ObjectId;
  sender: {
    _id: ObjectId;
    username: string;
  };
  text: string;
  timestamp: number;
  replyTo?: {
    _id: ObjectId;
    sender: {
      _id: ObjectId;
      username: string;
    };
    text: string;
    timestamp: number;
  };
}

interface ChatRoom {
  id: string;
  name: string;
  avatarUrl?: string;
  type: "personal" | "team";
  messages: Message[];
  participants: string[];
}

export interface PusherMemberStatusProps {
  id: string;
  info: {
    email: string;
    username: string;
  };
}

interface WatchListEventProps {
  name: "online" | "offline";
  user_ids: string[];
}

interface PendingMessage {
  _id: string;
  name: string;
  avatarUrl: string;
  text: string;
  hasFailed: boolean;
  hasReplyTo: boolean;
  replyTo?: {
    username: string;
    text: string;
  };
}
