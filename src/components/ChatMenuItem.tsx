import Image from "next/image";
import React from "react";
import { useRouter } from "next/router";
import { useGlobalContext } from "@/context";
import { log } from "console";
import { pusherClientConstructor } from "@/utils/pusherConfig";
import { Message, WatchListEventProps } from "@/utils/chat";
import { formatTimestampToTime } from "@/utils/helper";
import type { PusherMemberStatusProps } from "@/utils/chat";
import { set } from "mongoose";

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

  const { user, pusherClient, watchlistEvent } = useGlobalContext();
  // const [name, setName] = React.useState("");
  const [otherUser, setOtherUser] = React.useState(participants[0]);
  const [latestMessage, setLatestMessage] = React.useState<Message | undefined>(
    lastMessage
  );
  const [otherUserIsOnline, setOtherUserIsOnline] = React.useState(false);
  const router = useRouter();

  const channelCode = React.useMemo(() => {
    return `presence-${id}`;
  }, [id]);

  React.useEffect(() => {
    if (!pusherClient) return;

    const channel = pusherClient.subscribe(channelCode);

    const messageHandler = (message: Message) => {
      console.log("incoming message", message);

      setLatestMessage(message);
    };

    // const watchlistEventHandler = (event: WatchListEventProps) => {
    //   console.log("otherUser", otherUser);

    //   console.log("event", event);
    // };

    if (watchlistEvent) {
      if (!otherUser) return;
      if (
        watchlistEvent.name === "online" &&
        watchlistEvent.user_ids.includes(otherUser._id.toString())
      ) {
        console.log("other user is online");
        setOtherUserIsOnline(true);
      }
      if (
        watchlistEvent.name === "offline" &&
        watchlistEvent.user_ids.includes(otherUser._id.toString())
      ) {
        console.log("other user is offline");
        setOtherUserIsOnline(false);
      }
    }

    // const memberAddedHandler = (data: PusherMemberStatusProps) => {
    //   if (data.id === user?._id) return;
    //   setOtherUserIsOnline(true);
    // };

    // const memberRemovedHandler = (data: PusherMemberStatusProps) => {
    //   if (data.id === user?._id) return;
    //   setOtherUserIsOnline(false);
    // };

    channel.bind("incoming-message", messageHandler);
    // pusherClient.user.watchlist.bind("online", watchlistEventHandler);
    // pusherClient.user.watchlist.bind("offline", watchlistEventHandler);
    // channel.bind("pusher:member_added", memberAddedHandler);
    // channel.bind("pusher:member_removed", memberRemovedHandler);

    return () => {
      pusherClient.unsubscribe(channelCode);
      pusherClient.unbind("incoming-message", messageHandler);
    };
  }, [user, channelCode, pusherClient, otherUser, watchlistEvent]);

  React.useEffect(() => {
    if (!user || !participants) return;

    const otherUser = participants.find(
      (participant) => user._id !== participant._id
    );

    setOtherUser(otherUser);

    // setName(otherUser?.username || "");
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
        <div className={`${otherUserIsOnline ? "online" : "offline"} avatar`}>
          <div className="w-16 rounded-full">
            {/* <Image src={avatarUrl} alt="chat menu item" width={32} height={32} /> */}
            <img src={avatarUrl} alt="chat menu item" />
          </div>
        </div>
        <div className="ml-2">
          <div className="text-lg font-semibold">
            {otherUser?.username || ""}
          </div>
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
