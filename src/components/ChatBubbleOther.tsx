import { useGlobalContext } from "@/context";
import { type Message } from "@/utils/chat";
import { type ObjectId } from "mongoose";
import React from "react";
// interface Message {
//   _id: ObjectId;
//   sender: {
//     _id: ObjectId;
//     username: string;
//   };
//   text: string;
//   timestamp: number;
// }

interface ChatBubbleOtherProps {
  senderId: string;
  text: string;
  setReplyTo: React.Dispatch<React.SetStateAction<Message | null>>;
  time: string;
  date: string;
  senderName: string;
  avatarUrl: string;
  message_id: string;
}

export default function ChatBubbleOther({
  senderId,
  text,
  message_id,
  time,
  date,
  setReplyTo,
  senderName,
  avatarUrl,
}: ChatBubbleOtherProps) {
  const { watchlistStatus } = useGlobalContext();
  const isOnline = React.useMemo(() => {
    return watchlistStatus[senderId];
  }, [watchlistStatus, senderId]);
  return (
    <div
      className="chat chat-start"
      onClick={(e) => {
        console.log(e.detail);
        if (e.detail === 2) document.querySelector("#chat-input").focus();
        setReplyTo({
          hasReplyTo: true,
          _id: message_id as unknown as ObjectId,
          sender: {
            _id: senderId as unknown as ObjectId,
            username: senderName,
          },
          text: text,
          timestamp: new Date(time).getTime(),
        });
      }}
    >
      <div className={`chat-image avatar ${isOnline ? "online" : "offline"}`}>
        <div className="w-10 rounded-full">
          <img src={avatarUrl} />
        </div>
      </div>
      <div className="chat-bubble">
        <span className="mr-2 text-blue-500">{senderName}</span>
        <div className="flex items-end">
          <p>{text}</p>
          <div className="chat-footer ml-2 text-[0.8rem] opacity-50">
            {time}
          </div>
        </div>
      </div>
      <div className="chat-footer text-[0.8rem] opacity-50">{date}</div>
    </div>
  );
}
