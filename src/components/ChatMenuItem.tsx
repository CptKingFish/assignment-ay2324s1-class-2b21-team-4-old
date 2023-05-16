import Image from "next/image";
import React from "react";
import { useRouter } from "next/router";
import { useGlobalContext } from "@/context";
import { log } from "console";
import { pusherClientConstructor } from "@/utils/pusherConfig";
import { Message } from "@/utils/chat";
import { formatTimestampToTime } from "@/utils/helper";

interface ChatMenuItemProps {
  id: string;
  avatarUrl: string;
  participants: {
    _id: string;
    username: string;
  }[];
  lastMessage: Message | undefined;
}

export default function ChatMenuItem({
  id,
  avatarUrl,
  participants,
  lastMessage,
}: ChatMenuItemProps) {
  console.log("participants", participants);

  const { user } = useGlobalContext();
  const [name, setName] = React.useState("");
  const [latestMessage, setLatestMessage] = React.useState<Message | undefined>(
    lastMessage
  );
  const router = useRouter();

  const channelCode = React.useMemo(() => {
    return `presence-${id}`;
  }, [id]);

  React.useEffect(() => {
    if (!user) return;

    const pusherClient = pusherClientConstructor(user?._id);

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
  }, [user, channelCode]);

  React.useEffect(() => {
    if (!user || !participants) return;

    const otherUser = participants.find(
      (participant) => user._id !== participant._id
    );

    setName(otherUser?.username || "");
  }, [participants, user]);

  const isInChatroom = React.useMemo(() => {
    return router.query.id === id;
  }, [router.query.id, id]);

  const handleChatBtnClick = () => {
    router.push(`/privatechat/${id}`).catch(console.error);
  };
  return (
    <li
      className={`${isInChatroom ? "bordered" : ""}`}
      onClick={handleChatBtnClick}
    >
      <div className="mt-4 flex items-center">
        <div className="online avatar">
          <div className="w-16 rounded-full">
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
    </li>
  );
}

// lastMessageTime={formatTimestampToTime(
//   privateChatroom.messages[0]?.timestamp || 0
// )}
