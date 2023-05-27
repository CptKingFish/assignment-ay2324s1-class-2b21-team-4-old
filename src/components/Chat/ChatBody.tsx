import React from "react";
import { formatTimeStampToDate, formatTimestampToTime } from "@/utils/helper";
import ChatBubbleMe from "@/components/Chat/ChatBubbleMe";
import ChatBubbleOther from "@/components/Chat/ChatBubbleOther";
import type { Message, PendingMessage } from "@/utils/chat";
import { useGlobalContext } from "@/context";
import IconButton from "../IconButton";
import PendingChatBubble from "./PendingChatBubble";
import { api } from "@/utils/api";
import StatusMessage from "./StatusMessage";

interface ChatBodyProps {
  messages: Message[];
  pendingMessages: PendingMessage[];
  setReplyTo: React.Dispatch<React.SetStateAction<Message | null>>;
  users: any[];
  chatroom_id: string;
}

export default function ChatBody({
  messages,
  pendingMessages,
  setReplyTo,
  users,
  chatroom_id,
}: ChatBodyProps) {
  const { user } = useGlobalContext();

  return (
    <>
      <div className="relative">
        {messages?.map((message) => {
          if (message.data_type === "status") {
            return (
              <StatusMessage
                message={message.text}
                key={message._id.toString()}
              />
            );
          } else if (message.sender._id.toString() === user?._id) {
            return (
              <ChatBubbleMe
                hasReplyTo={message.hasReplyTo}
                replyTo={message.replyTo}
                message_id={message._id.toString()}
                chatroom_id={chatroom_id}
                key={message._id.toString()}
                senderId={message.sender._id.toString()}
                senderName={message.sender.username}
                setReplyTo={setReplyTo}
                text={message.text}
                time={formatTimestampToTime(message.timestamp)}
                date={formatTimeStampToDate(message.timestamp)}
                avatarUrl={user?.avatar || "/Profile.png"}
                deleted={message?.deleted || false}
              />
            );
          } else {
            return (
              <ChatBubbleOther
                hasReplyTo={message.hasReplyTo}
                replyTo={message.replyTo}
                key={message._id.toString()}
                message_id={message._id.toString()}
                setReplyTo={setReplyTo}
                senderId={message.sender._id.toString()}
                senderName={
                  users.find(
                    (user) => user.key === message.sender._id.toString()
                  )?.username || "Removed User"
                }
                text={message.text}
                time={formatTimestampToTime(message.timestamp)}
                date={formatTimeStampToDate(message.timestamp)}
                avatarUrl={
                  users.find(
                    (user) => user.key === message.sender._id.toString()
                  )?.imageUrl || "/Profile.png"
                }
                deleted={message?.deleted || false}
              />
            );
          }
        })}
        {/* <StatusMessage
          message={
            "This is a status message. It is used to show when a user joins or leaves the chat."
          }
        /> */}

        {pendingMessages?.map((message) => {
          return (
            <PendingChatBubble
              key={message._id.toString()}
              _id={message._id.toString()}
              text={message.text}
              name={message.name}
              avatarUrl={user?.avatar || "/Profile.png"}
              hasFailed={message.hasFailed}
              hasReplyTo={message.hasReplyTo}
              replyTo={message.replyTo}
            />
          );
        })}

        <div
          className="fixed right-8"
          onClick={() => {
            // scroll to bottom
            const chatBody = document.getElementById("chat-body");
            if (chatBody) {
              chatBody.scrollTop = chatBody.scrollHeight;
            }
          }}
        >
          <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
