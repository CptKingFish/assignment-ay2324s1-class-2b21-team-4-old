import Image from "next/image";
import React from "react";
import { useRouter } from "next/router";
import { useGlobalContext } from "@/context";
import type { Message } from "@/utils/chat";
import { formatTimestampToTime } from "@/utils/helper";
import { toast } from "react-hot-toast";
import ChatNotification from "../Chat/ChatNotification";
import { truncateString } from "@/utils/helper";
import Link from "next/link";

interface TeamMenuItemProps {
  id: string;
  avatarUrl: string;
  name: string;
  lastMessage: Message | undefined;
}

export default function TeamMenuItem({
  id,
  avatarUrl,
  name,
  lastMessage,
}: TeamMenuItemProps) {
  const { user, pusherClient } = useGlobalContext();
  const router = useRouter();
  const [collapsed, setCollapsed] = React.useState(true);
  const [latestMessage, setLatestMessage] = React.useState<Message | undefined>(
    lastMessage
  );

  const queryId = React.useMemo(() => {
    return router.query.id as string;
  }, [router.query.id]);

  const channelCode = React.useMemo(() => {
    return `presence-${id}`;
  }, [id]);

  React.useEffect(() => {
    if (!user || !pusherClient) return;

    const channel = pusherClient.subscribe(channelCode);

    const messageHandler = (message: Message) => {
      console.log("incoming message", message);

      if (message.sender._id.toString() !== user?._id && queryId !== id) {
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5`}
            >
              <ChatNotification
                type={"team"}
                avatarUrl={avatarUrl}
                text={message?.text || ""}
                team={name}
                username={message.sender.username || ""}
                chatroom_id={id}
              />
            </div>
          ),
          {
            id: "chat-notification",
            duration: 5000,
          }
        );
      }

      setLatestMessage(message);
    };

    channel.bind("incoming-message", messageHandler);

    return () => {
      channel.unbind("incoming-message", messageHandler);
      pusherClient.unsubscribe(channelCode);
    };
  }, [user, channelCode, pusherClient, queryId, id, avatarUrl]);

  const handleChatBtnClick = () => {
    router.push(`/teamchat/${id}`).catch(console.error);
  };

  const isInChatroom = React.useMemo(() => {
    return router.query.id === id && router.pathname.includes("teamchat");
  }, [router.query.id, router.pathname, id]);

  const isInScrum = React.useMemo(() => {
    return router.query.id === id && router.pathname.includes("scrum");
  }, [router.query.id, router.pathname, id]);

  const truncatedText = React.useMemo(() => {
    if (!latestMessage) return "";
    return truncateString(latestMessage?.text || "", 20);
  }, [latestMessage]);

  return (
    <>
      <div
        className="mt-4 flex items-center"
        onClick={() => setCollapsed((prev) => !prev)}
      >
        <div className="avatar">
          <div className="w-16 rounded-xl">
            {/* <Image src={avatarUrl} alt="chat menu item" width={32} height={32} /> */}
            <img src={avatarUrl} alt="chat menu item" />
          </div>
        </div>
        <div className="ml-2">
          <div className="text-lg font-semibold">{name}</div>
          <div className="pr-1 text-sm font-semibold">
            {(latestMessage?.sender.username || "") +
              (latestMessage ? ": " : "")}
          </div>
          <div className="text-sm">{truncatedText}</div>
        </div>
        <div className="ml-auto text-xs">
          {formatTimestampToTime(latestMessage?.timestamp || 0)}
        </div>
      </div>
      {collapsed ? null : (
        <ul className="menu rounded-box w-full self-end bg-base-100">
          <li className={`${isInChatroom ? "bordered" : ""}`}>
            <a onClick={handleChatBtnClick}>Chat</a>
          </li>
          <li className={`${isInScrum ? "bordered" : ""}`}>
            <Link href={`/scrum/${id}`}>Scrum</Link>
          </li>
        </ul>
      )}
    </>
  );
}
