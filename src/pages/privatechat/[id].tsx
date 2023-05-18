import React, { useEffect } from "react";
import { useGlobalContext } from "@/context";
import { pusherClientConstructor } from "@/utils/pusherConfig";
import TopNav from "@/components/TopNav";
import ChatInput from "@/components/ChatInput";
import { useRouter } from "next/router";
import ChatBody from "@/components/ChatBody";
import { Message } from "@/utils/chat";
import { api } from "@/utils/api";
import UserSideBar from "@/components/UserSideBar";
import type { PusherMemberStatusProps } from "@/utils/chat";

export default function PrivateChat() {
  const router = useRouter();
  const { user, pusherClient } = useGlobalContext();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [users, setUsers] = React.useState<Object[]>([]);
  const [name, setName] = React.useState("");
  const [otherUserIsOnline, setOtherUserIsOnline] = React.useState(false);
  // const [showDownButton, setShowDownButton] = React.useState(false);
  const {
    data: chatroomData,
    refetch,
    isLoading,
  } = api.chat.getMessagesAndChatroomInfo.useQuery({
    chatroom_id: router.query.id as string,
  });

  const { data: userRaw } = api.chat.getUsernamesFromChatroom.useQuery({
    chatroom_id: router.query.id as string,
  });

  // get the other user's name

  React.useEffect(() => {
    if (!user || !userRaw) return;

    const otherUser = userRaw.find(
      (participant) => user._id !== participant._id
    );

    setName(otherUser?.username || "");
  }, [user, userRaw]);

  const [isOpen, setIsOpen] = React.useState(false);

  function handleDrawerToggle() {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    if (isLoading || !chatroomData) return;
    setMessages(chatroomData.messages);
    setUsers(
      (userRaw || []).map((user) => {
        return { key: user._id, username: user.username };
      })
    );
  }, [isLoading, chatroomData, userRaw]);

  const channelCode = React.useMemo(() => {
    return "presence-" + (router.query.id as string);
  }, [router.query.id]);

  React.useEffect(() => {
    if (!pusherClient) return;

    // const pusherClient = pusherClientConstructor(user?._id);

    const channel = pusherClient.subscribe(channelCode);

    const messageHandler = (message: Message) => {
      setMessages((prev) => [message, ...prev]);
    };

    const memberAddedHandler = (data: PusherMemberStatusProps) => {
      if (data.id === user?._id) return;
      setOtherUserIsOnline(true);
    };

    const memberRemovedHandler = (data: PusherMemberStatusProps) => {
      if (data.id === user?._id) return;
      setOtherUserIsOnline(false);
    };

    channel.bind("incoming-message", messageHandler);
    channel.bind("pusher:member_added", memberAddedHandler);
    channel.bind("pusher:member_removed", memberRemovedHandler);

    return () => {
      pusherClient.unsubscribe(channelCode);
      pusherClient.unbind("incoming-message", messageHandler);
    };
  }, [user, channelCode, pusherClient]);

  // const scrollDownRef = React.useRef<HTMLDivElement | null>(null);

  // const scrollToBottom = () => {
  //   scrollDownRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  return (
    <>
      <TopNav
        chatroom_name={name || ""}
        openSidebarDetails={handleDrawerToggle}
      />
      <div className="drawer-mobile drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

        <div className="flex-no-wrap drawer-content flex">
          {/* {showDownButton && (
            <div className="fixed bottom-10 right-4 z-50">
              <button
                onClick={handleDownButtonClick}
                className="rounded-full bg-blue-500 px-4 py-2 font-bold text-white shadow hover:bg-blue-700"
              >
                Scroll down
              </button>
            </div>
          )} */}

          <div className="relative flex h-full max-h-[calc(100vh-6rem)] flex-1 flex-col">
            <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex h-full flex-1 flex-col-reverse gap-4 overflow-y-auto p-3 pb-16">
              <ChatBody messages={messages} />
            </div>
            <ChatInput channelCode={channelCode} />
          </div>

          {/*
         <button
            className={` h-screen items-center justify-center bg-base-200 px-2 text-4xl text-white ${
              isOpen ? "hidden" : ""
            }`}
            onClick={handleDrawerToggle}
          >
            {"<"}
          </button> */}
        </div>
        <UserSideBar
          isOpen={isOpen}
          handleDrawerToggle={handleDrawerToggle}
          participants={users}
        />
      </div>
    </>
  );
}