import React from "react";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import { useGlobalContext } from "@/context";
import { useRouter } from "next/router";
import { formatTimestampToTime } from "@/utils/helper";

interface PendingChatBubbleProps {
  _id: string;
  name: string;
  avatarUrl: string;
  text: string;
  hasFailed: boolean;
  hasReplyTo: boolean;
  replyTo?: {
    username: string;
    text: string;
  };
}

export default function PendingChatBubble({
  _id,
  name,
  avatarUrl,
  text,
  hasFailed,
  hasReplyTo,
  replyTo,
}: PendingChatBubbleProps) {
  const router = useRouter();
  const { mutateAsync: sendMessageMutation } =
    api.chat.sendMessage.useMutation();

  const { user } = useGlobalContext();

  const channelCode = React.useMemo(() => {
    return "presence-" + (router.query.id as string);
  }, [router.query.id]);

  const [retrying, setRetrying] = React.useState(false);

  // const sendMessage = async () => {
  //   if (!text || !hasFailed || retrying) return;

  //   try {
  //     console.log("sending message");
  //     setRetrying(true);

  //     if (replyTo) {
  //       await sendMessageMutation({
  //         _id: _id.toString(),
  //         channel: channelCode,
  //         text: text,
  //         replyTo: {
  //           _id: replyTo._id as unknown as string,
  //           text: replyTo.text,
  //           sender: {
  //             _id: replyTo.sender._id as unknown as string,
  //             username: replyTo.sender.username,
  //           },
  //           timestamp: new Date().getTime(),
  //         },
  //       });
  //     } else {
  //       await sendMessageMutation(
  //         {
  //           _id: _id.toString(),
  //           channel: channelCode,
  //           text: text,
  //         },
  //         {
  //           onError: (err) => {
  //             console.log(err);
  //             setRetrying(false);
  //           },
  //         }
  //       );
  //     }

  //     //   setInput("");
  //     //   setReplyTo(null);
  //   } catch (e) {
  //     console.log(e);
  //     toast.error("Something went wrong. Please try again later.");
  //   } finally {
  //     //   setIsLoading(false);
  //   }
  // };

  return (
    <div
      className={`chat chat-end ${
        hasFailed && !retrying ? "opacity-25" : "animate-pulse"
      } transition-all duration-[400]`}
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img src={avatarUrl} alt="profile img" />
        </div>
      </div>
      <div className="chat-bubble flex cursor-pointer flex-col gap-1">
        <div className="flex justify-between">
          <span className="mr-2 text-green-500">{name}</span>
          {hasFailed && !retrying ? (
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
          ) : null}
        </div>
        {hasReplyTo && (
          <div className="cursor-pointer rounded-sm border-l-4 border-l-blue-500 bg-slate-700 p-2">
            <div className="text-blue-400">{replyTo?.username || ""}</div>
            <div className="text-white">{replyTo?.text || ""}</div>
          </div>
        )}

        <div className="flex items-end">
          <p>{text}</p>
          <div className="chat-footer ml-2 text-[0.8rem] opacity-50">
            {formatTimestampToTime(new Date().getTime())}
          </div>
        </div>
      </div>
      <div className="chat-footer text-[0.8rem] opacity-50">{"Sending..."}</div>
    </div>
  );
}
