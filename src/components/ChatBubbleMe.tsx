import { type Message } from "@/utils/chat";
import { type ObjectId } from "mongoose";

interface ChatBubbleMeProps {
  senderId: string;
  text: string;
  senderName: string;
  time: string;
  hasReplyTo: boolean;
  replyTo:
    | {
        _id: ObjectId;
        sender: {
          _id: ObjectId;
          username: string;
        };
        text: string;
        timestamp: number;
      }
    | undefined;
  date: string;
  avatarUrl: string;
  message_id: string;
  setReplyTo: React.Dispatch<React.SetStateAction<Message | null>>;
}

export default function ChatBubbleMe({
  senderId,
  setReplyTo,
  text,
  senderName,
  message_id,
  hasReplyTo,
  replyTo,
  time,
  date,
  avatarUrl,
}: ChatBubbleMeProps) {
  // id: uuidv4() as string,
  //   senderId: user_id,
  //   text: text,
  //   timestamp: timestamp,
  return (
    <div
      className="chat chat-end"
      onClick={(e) => {
        if (e.detail === 2) {
          document.querySelector("#chat-input").focus();
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
        }
      }}
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img src={avatarUrl} alt="profile img" />
        </div>
      </div>
      <div className="chat-bubble flex flex-col gap-1">
        <span className="mr-2 text-green-500">{senderName}</span>
        {hasReplyTo && (
          <div className="rounded-sm border-l-4 border-l-green-500 bg-slate-700 p-2">
            <div className="text-blue-400">{replyTo?.sender.username}</div>
            <div className="text-white">{replyTo?.text}</div>
          </div>
        )}
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
