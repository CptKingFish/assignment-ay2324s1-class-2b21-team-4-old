import { formatTimeStampToDate, formatTimestampToTime } from "@/utils/helper";
import ChatBubbleMe from "@/components/ChatBubbleMe";
import ChatBubbleOther from "@/components/ChatBubbleOther";
import type { Message } from "@/utils/chat";
import { useGlobalContext } from "@/context";

interface ChatBodyProps {
  messages: Message[];
}

export default function ChatBody({ messages }: ChatBodyProps) {
  const { user } = useGlobalContext();
  return (
    <>
      {messages?.map((message) => {
        if (message.sender._id.toString() === user?._id) {
          return (
            <ChatBubbleMe
              key={message._id.toString()}
              senderId={message.sender._id.toString()}
              senderName={message.sender.username}
              text={message.text}
              time={formatTimestampToTime(message.timestamp)}
              date={formatTimeStampToDate(message.timestamp)}
            />
          );
        } else {
          return (
            <ChatBubbleOther
              key={message._id.toString()}
              senderId={message.sender._id.toString()}
              senderName={message.sender.username}
              text={message.text}
              time={formatTimestampToTime(message.timestamp)}
              date={formatTimeStampToDate(message.timestamp)}
            />
          );
        }
      })}
    </>
  );
}
