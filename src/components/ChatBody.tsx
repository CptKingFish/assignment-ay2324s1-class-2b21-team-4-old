import { formatTimeStampToDate, formatTimestampToTime } from "@/utils/helper";
import ChatBubbleMe from "@/components/ChatBubbleMe";
import ChatBubbleOther from "@/components/ChatBubbleOther";
import type { Message } from "@/utils/chat";
import { useGlobalContext } from "@/context";

interface ChatBodyProps {
  messages: Message[];
  setReplyTo: React.Dispatch<React.SetStateAction<Message | null>>;
}

export default function ChatBody({ messages, setReplyTo }: ChatBodyProps) {
  const { user } = useGlobalContext();
  return (
    <>
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
              avatarUrl="https://source.unsplash.com/random/?city,night"
            />
          );
        } else {
          return (
            <ChatBubbleOther
              key={message._id.toString()}
              message_id={message._id.toString()}
              setReplyTo={setReplyTo}
              senderId={message.sender._id.toString()}
              senderName={message.sender.username}
              text={message.text}
              time={formatTimestampToTime(message.timestamp)}
              date={formatTimeStampToDate(message.timestamp)}
              avatarUrl="https://source.unsplash.com/random/?city,night"
            />
          );
        }
      })}
    </>
  );
}
