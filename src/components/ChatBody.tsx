import { formatTimeStampToDate, formatTimestampToTime } from "@/utils/helper";
import ChatBubbleMe from "@/components/ChatBubbleMe";
import ChatBubbleOther from "@/components/ChatBubbleOther";
import type { Message } from "@/utils/chat";
import { useGlobalContext } from "@/context";
import { api } from "@/utils/api";

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
              avatarUrl={user?.avatar || ""}
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
              avatarUrl={api.user.getAvatarUrl.useQuery({user_id:message.sender._id.toString()})?.data?.avatar || "/Profile.png"}
            />
          );
        }
      })}
    </>
  );
}
