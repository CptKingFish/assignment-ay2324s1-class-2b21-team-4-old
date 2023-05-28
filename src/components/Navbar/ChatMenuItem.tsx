import Image from "next/image";
import React from "react";
import { useRouter } from "next/router";
import { useGlobalContext } from "@/context";
import { Message, WatchListEventProps } from "@/utils/chat";
import { formatTimestampToTime } from "@/utils/helper";
import { toast } from "react-hot-toast";
import ChatNotification from "../Chat/ChatNotification";
import { truncateString } from "@/utils/helper";
import { api } from "@/utils/api";

interface ChatMenuItemProps {
  id: string;
  participants: {
    _id: string;
    username: string;
  }[];
  lastMessage: Message | undefined;
  display: boolean;
  searchValue: string;
}

export default function ChatMenuItem({
  id,
  participants,
  lastMessage,
  display,
  searchValue,
}: ChatMenuItemProps) {
  const { user, pusherClient, watchlistStatus } = useGlobalContext();

  const otherParticipantId = React.useMemo(() => {
    return participants.find((participant) => participant._id !== user?._id)
      ?._id;
  }, [participants, user?._id]);

  const { data: avatarUrl } = api.user.getAvatarUrl.useQuery(
    {
      user_id: otherParticipantId || "",
    },
    {
      enabled: !!otherParticipantId,
    }
  );

  const [otherUser, setOtherUser] = React.useState(participants[0]);
  const [latestMessage, setLatestMessage] = React.useState<Message | undefined>(
    lastMessage
  );
  const [otherUserIsOnline, setOtherUserIsOnline] = React.useState(false);
  const router = useRouter();

  const queryId = React.useMemo(() => {
    return router.query.id as string;
  }, [router.query.id]);

  const channelCode = React.useMemo(() => {
    return `presence-${id}`;
  }, [id]);

  const matchesSearch = React.useMemo(() => {
    if (!searchValue) return true;
    return otherUser?.username
      .toLowerCase()
      .includes(searchValue.toLowerCase());
  }, [searchValue, otherUser?.username]);

  React.useEffect(() => {
    if (!pusherClient || !otherUser) return;
    const channel = pusherClient.subscribe(channelCode);

    const messageHandler = (message: Message) => {
      if (message.sender._id.toString() !== user?._id && queryId !== id) {
        toast.custom(
          (t) => (
            <div
              className={`${t.visible ? "animate-enter" : "animate-leave"
                } pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5`}
            >
              <ChatNotification
                type={"private"}
                avatarUrl={avatarUrl?.avatar || ""}
                text={message?.text || ""}
                team={null}
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
  }, [user, channelCode, pusherClient, otherUser, queryId, id, avatarUrl]);

  React.useEffect(() => {
    if (!pusherClient || !otherUser) return;
    setOtherUserIsOnline(watchlistStatus[otherUser?._id] || false);
  }, [watchlistStatus, otherUser, pusherClient]);

  React.useEffect(() => {
    if (!user || !participants) return;

    const otherUser = participants.find(
      (participant) => user._id !== participant._id
    );

    setOtherUser(otherUser);
  }, [participants, user]);

  const isInChatroom = React.useMemo(() => {
    return router.query.id === id;
  }, [router.query.id, id]);

  const handleChatBtnClick = () => {
    router.push(`/privatechat/${id}`).catch(console.error);
  };

  const truncatedText = React.useMemo(() => {
    if (!latestMessage) return "";
    return truncateString(latestMessage.text, 18);
  }, [latestMessage]);

  return (
    <li
      className={`${isInChatroom ? "bordered" : ""}`}
      onClick={handleChatBtnClick}
      hidden={!display || !matchesSearch}
    >
      <div className="mt-4 flex items-center">
        <div className={`${otherUserIsOnline ? "online" : "offline"} avatar`}>
          <div className="w-16 rounded-full">
            {/* <Image src={avatarUrl} alt="chat menu item" width={32} height={32} /> */}
            <img src={avatarUrl?.avatar || "/Profile.png"} alt="chat menu item" />
          </div>
        </div>
        <div className="ml-2">
          <div className="text-lg font-semibold">
            {otherUser?.username || ""}
          </div>
          <div className="text-sm">{truncatedText}</div>
        </div>
        <div className="ml-auto text-xs">
          {formatTimestampToTime(latestMessage?.timestamp || 0)}
        </div>
      </div>
    </li>
  );
}
