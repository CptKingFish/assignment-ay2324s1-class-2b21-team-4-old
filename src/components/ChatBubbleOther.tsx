import { useGlobalContext } from "@/context";
import React from "react";

interface ChatBubbleOtherProps {
  senderId: string;
  text: string;
  time: string;
  date: string;
  senderName: string;
  avatarUrl: string;
}

export default function ChatBubbleOther({
  senderId,
  text,
  time,
  date,
  senderName,
  avatarUrl,
}: ChatBubbleOtherProps) {
  const { watchlistStatus } = useGlobalContext();
  const isOnline = React.useMemo(() => {
    return watchlistStatus[senderId];
  }, [watchlistStatus, senderId]);
  return (
    <div className="chat chat-start">
      <div className={`chat-image avatar ${isOnline ? "online" : "offline"}`}>
        <div className="w-10 rounded-full">
          <img src={avatarUrl} />
        </div>
      </div>
      <div className="chat-header">
        <span className="mr-2"> {senderName}</span>

        <time className="text-xs opacity-50">{time}</time>
      </div>
      <div className="chat-bubble">{text}</div>
      <div className="chat-footer opacity-50">{date}</div>
    </div>
  );
}
