import Image from "next/image";
import React from "react";
// import type { TeamMenuItemProps } from "@/utils/chat";
import { useRouter } from "next/router";
import { useGlobalContext } from "@/context";
import { pusherClientConstructor } from "@/utils/pusherConfig";
import type { Message } from "@/utils/chat";
import { formatTimestampToTime } from "@/utils/helper";

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

  const channelCode = React.useMemo(() => {
    return `presence-${id}`;
  }, [id]);

  React.useEffect(() => {
    if (!user || !pusherClient) return;

    // const pusherClient = pusherClientConstructor(user?._id);

    pusherClient.subscribe(channelCode);

    const messageHandler = (message: Message) => {
      console.log("incoming message", message);

      setLatestMessage(message);
    };

    pusherClient.bind("incoming-message", messageHandler);

    return () => {
      pusherClient.unsubscribe(channelCode);
      pusherClient.unbind("incoming-message", messageHandler);
    };
  }, [user, channelCode, pusherClient]);

  const handleChatBtnClick = () => {
    router.push(`/teamchat/${id}`).catch(console.error);
  };

  const isInChatroom = React.useMemo(() => {
    return router.query.id === id && router.pathname.includes("teamchat");
  }, [router.query.id, router.pathname, id]);

  const isInScrum = React.useMemo(() => {
    return router.query.id === id && router.pathname.includes("scrum");
  }, [router.query.id, router.pathname, id]);

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
          <div className="text-sm">{latestMessage?.text || ""}</div>
        </div>
        <div className="ml-auto text-xs">
          {formatTimestampToTime(latestMessage?.timestamp || 0)}
        </div>
      </div>
      {collapsed ? null : (
        <ul className="menu rounded-box w-full self-end bg-base-100 bg-primary-content">
          <li className={`${isInChatroom ? "bordered" : ""}`}>
            <a onClick={handleChatBtnClick}>Chat</a>
          </li>
          <li className={`${isInScrum ? "bordered" : ""}`}>
            <a>Scrum</a>
          </li>
        </ul>
      )}
    </>
  );
}
