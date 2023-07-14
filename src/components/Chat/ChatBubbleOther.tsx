import { useGlobalContext } from "@/context";
import { type Message } from "@/utils/chat";
import { type ObjectId } from "mongoose";
import React from "react";

interface ChatBubbleOtherProps {
  senderId: string;
  text: string;
  setReplyTo: React.Dispatch<React.SetStateAction<Message | null>>;
  time: string;
  date: string;
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
  senderName: string;
  avatarUrl: string;
  message_id: string;
  deleted: boolean;
}

export default function ChatBubbleOther({
  senderId,
  text,
  message_id,
  replyTo,
  hasReplyTo,
  time,
  date,
  setReplyTo,
  senderName,
  avatarUrl,
  deleted,
}: ChatBubbleOtherProps) {
  const { watchlistStatus } = useGlobalContext();
  const isOnline = React.useMemo(() => {
    return watchlistStatus[senderId];
  }, [watchlistStatus, senderId]);
  return (
    <div
      className="chat chat-start"
      id={message_id}
      onClick={(e) => {
        console.log(e.detail);
        if (deleted) return;
        if (e.detail === 2) {
          const chatInputElement = document.querySelector(
            "#chat-input"
          ) as HTMLInputElement;
          chatInputElement.focus();
          setReplyTo({
            data_type: "message",
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
      <div className={`chat-image avatar ${isOnline ? "online" : "offline"}`}>
        <div className="w-10 rounded-full">
          <img src={avatarUrl} />
        </div>
      </div>
      <div
        className={`chat-bubble ${
          deleted ? "chat-bubble-secondary" : ""
        } flex flex-col gap-1`}
      >
        <div className="flex flex-row">
          <span
            className={`${deleted ? "text-slate-300" : "text-green-500"} mr-2`}
          >
            {senderName}
          </span>
          <div className="mx-1"></div>
          {!deleted ? (
            <div className="dropdown-end dropdown text-gray-500">
              <label tabIndex={0}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box w-20 bg-base-100 p-1 shadow"
              >
                <li>
                  <a>Hide</a>
                </li>
              </ul>
            </div>
          ) : null}
        </div>

        {hasReplyTo && !deleted && (
          <div
            onClick={() => {
              if (!replyTo) return;
              const replyElement = document.getElementById(
                replyTo._id.toString()
              ) as HTMLDivElement;
              replyElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest",
              });
              replyElement.classList.add("opacity-70");
              setTimeout(() => {
                replyElement.classList.remove("opacity-70");
              }, 600);
            }}
            className="cursor-pointer rounded-sm border-l-4 border-l-blue-500 bg-slate-700 p-2"
          >
            <div className="text-blue-400">{replyTo?.sender.username}</div>
            <div className="text-white">{replyTo?.text}</div>
          </div>
        )}

        <div className="flex items-end">
          <p className={`${deleted ? "text-slate-300" : ""} break-all`}>
            {text}
          </p>
          <div className="chat-footer ml-2 text-[0.8rem] opacity-50">
            {time}
          </div>
        </div>
      </div>
      <div className="chat-footer text-[0.8rem] opacity-50">{date}</div>
    </div>
  );
}
