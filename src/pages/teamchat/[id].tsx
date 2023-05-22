import React, { useEffect } from "react";
import { useGlobalContext } from "@/context";
// import { pusherClientConstructor } from "@/utils/pusherConfig";
import TopNav from "@/components/TopNav";
import ChatInput from "@/components/ChatInput";
import { useRouter } from "next/router";
import ChatBody from "@/components/ChatBody";
import { type Message } from "@/utils/chat";
import { api } from "@/utils/api";
import UserSideBar from "@/components/UserSideBar";

const TeamChat = () => {
  const router = useRouter();
  const { user, pusherClient } = useGlobalContext();
  const [replyTo, setReplyTo] = React.useState<Message | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [users, setUsers] = React.useState<any[]>([]);
  // const [showDownButton, setShowDownButton] = React.useState(false);
  const { data: chatroomData, isLoading } =
    api.chat.getMessagesAndChatroomInfo.useQuery({
      chatroom_id: router.query.id as string,
    });

  const { data: userRaw } = api.chat.getUsernamesFromChatroom.useQuery({
    chatroom_id: router.query.id as string,
  });

  const {data:admin} = api.chat.getAdminFromChatroom.useQuery({
    chatroom_id: router.query.id as string,
  });

  const [isOpen, setIsOpen] = React.useState(false);

  function handleDrawerToggle() {
    setIsOpen(!isOpen);
  }

  // useEffect(() => {
  //   const handleScroll = () => {
  //     console.log("window.pageYOffset", window.pageYOffset);

  //     if (window.pageYOffset > 100) {
  //       setShowDownButton(true);
  //     } else {
  //       setShowDownButton(false);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  // const handleDownButtonClick = () => {
  //   window.scrollTo({
  //     top: document.body.scrollHeight,
  //     behavior: "smooth",
  //   });
  // };

  useEffect(() => {
    if (isLoading || !chatroomData) return;
    setMessages(chatroomData.messages);

    setUsers(
      (userRaw || []).map((user) => {
        return {
          key: user._id,
          username: user.username,
          imageUrl: user.avatar || "/profile.png",
          admin: admin.admins.includes(user._id),
        };
      })
    );
    

  }, [isLoading, chatroomData, userRaw]);

  const channelCode = React.useMemo(() => {
    return "presence-" + (router.query.id as string);
  }, [router.query.id]);

  React.useEffect(() => {
    if (!pusherClient) return;

    const channel = pusherClient.subscribe(channelCode);

    const messageHandler = (message: Message) => {
      console.log("incoming message", message);

      setMessages((prev) => [message, ...prev]);
    };

    channel.bind("incoming-message", messageHandler);

    return () => {
      pusherClient.unsubscribe(channelCode);
      channel.unbind("incoming-message", messageHandler);
    };
  }, [user, channelCode, pusherClient]);

  // const scrollDownRef = React.useRef<HTMLDivElement | null>(null);

  // const scrollToBottom = () => {
  //   scrollDownRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  return (
    <>
      <TopNav
        avatar={chatroomData?.avatarUrl || "/GroupProfile.png"}
        chatroom_name={chatroomData?.name || ""}
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
              <ChatBody setReplyTo={setReplyTo} messages={messages} />
            </div>
            <ChatInput
              replyTo={replyTo}
              setReplyTo={setReplyTo}
              channelCode={channelCode}
            />
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
          chatRoomAvatar={chatroomData?.avatarUrl ||"/GroupProfile.png"}
          chatRoomName={chatroomData?.name || ""}
          isOpen={isOpen}
          handleDrawerToggle={handleDrawerToggle}
          participants={users}
        />
      </div>
    </>
  );
};

export default TeamChat;
