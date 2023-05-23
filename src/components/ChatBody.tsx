import React from "react";
import { formatTimeStampToDate, formatTimestampToTime } from "@/utils/helper";
import ChatBubbleMe from "@/components/ChatBubbleMe";
import ChatBubbleOther from "@/components/ChatBubbleOther";
import type { Message, PendingMessage } from "@/utils/chat";
import { useGlobalContext } from "@/context";
import IconButton from "./IconButton";
import PendingChatBubble from "./PendingChatBubble";
import { api } from "@/utils/api";

interface ChatBodyProps {
  messages: Message[];
  pendingMessages: PendingMessage[];
  setReplyTo: React.Dispatch<React.SetStateAction<Message | null>>;
  users: any[];
}

export default function ChatBody({
  messages,
  pendingMessages,
  setReplyTo,
  users,
}: ChatBodyProps) {
  const { user } = useGlobalContext();
  // const scrollableRef = React.useRef<HTMLDivElement>(null);
  // React.useEffect(() => {
  //   const scrollableElement = scrollableRef.current;

  //   const handleScroll = () => {
  //     if (!scrollableElement) return;
  //     console.log(scrollableElement.scrollTop);
  //     if (scrollableElement.scrollTop === 0) {
  //       // Scrolled to the top of the element
  //       console.log("Scrolled to the top!");
  //     }
  //   };

  //   if (!scrollableElement) return;

  //   scrollableElement.addEventListener("scroll", handleScroll);

  //   return () => {
  //     scrollableElement.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);
  return (
    <>
      <div className="relative">
        {messages?.map((message) => {
          if (message.sender._id.toString() === user?._id) {
            return (
              <ChatBubbleMe
                hasReplyTo={message.hasReplyTo}
                replyTo={message.replyTo}
                message_id={message._id.toString()}
                key={message._id.toString()}
                senderId={message.sender._id.toString()}
                senderName={message.sender.username}
                setReplyTo={setReplyTo}
                text={message.text}
                time={formatTimestampToTime(message.timestamp)}
                date={formatTimeStampToDate(message.timestamp)}
                avatarUrl={user?.avatar || "/Profile.png"}
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
                senderName={message.sender.username}
                text={message.text}
                time={formatTimestampToTime(message.timestamp)}
                date={formatTimeStampToDate(message.timestamp)}
                avatarUrl={
                  users.find(
                    (user) => user.key === message.sender._id.toString()
                  ).imageUrl || "/Profile.png"
                }
              />
            );
          }
        })}
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
