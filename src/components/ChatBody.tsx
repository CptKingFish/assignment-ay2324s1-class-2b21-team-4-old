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
                senderName={users.find(
                  (user) => user.key === message.sender._id.toString()
                )?.username || "Removed User"}
                text={message.text}
                time={formatTimestampToTime(message.timestamp)}
                date={formatTimeStampToDate(message.timestamp)}
                avatarUrl={
                  users.find(
                    (user) => user.key === message.sender._id.toString()
                  )?.imageUrl || "/Profile.png"
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

        {/* <div className={`chat chat-end transition-all duration-[400]`}>
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                src={"https://source.unsplash.com/random/?city,night"}
                alt="profile img"
              />
            </div>
          </div>
          <div className="chat-bubble relative flex cursor-pointer flex-col gap-1 opacity-25">
            <div className="flex justify-between">
              <span className="mr-2 text-green-500">{"sithulol"}</span>
              <button className="opacity-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </button>
            </div>

            <div className="cursor-pointer rounded-sm border-l-4 border-l-blue-500 bg-slate-700 p-2">
              <div className="text-blue-400">{"nik"}</div>
              <div className="text-white">{"ha"}</div>
            </div>

            <div className="flex items-end">
              <p>{"has"}</p>

              <div className="chat-footer ml-2 text-[0.8rem] opacity-50"> </div>
            </div>
          </div>

          <div className="chat-footer text-[0.8rem] opacity-50">{"."}</div>
        </div> */}

        {/* fff */}
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
