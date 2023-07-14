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
  data_type: string | undefined;
  hasReplyTo: boolean;
  sender: {
    _id: ObjectId;
    username: string;
  };
  deleted?: boolean;
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
  hiddenTo?: ObjectId[];
}

interface ChatRoom {
  _id: ObjectId;
  name?: string | null;
  avatarUrl?: string;
  type: "private" | "team";
  messages: Message[];
  participants: string[];
  admins: string[];
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
