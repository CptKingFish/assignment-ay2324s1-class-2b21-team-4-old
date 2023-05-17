import React, { useEffect } from "react";
import { useGlobalContext } from "@/context";
// import { pusherClient } from "@/utils/pusherConfig";
import { pusherClientConstructor } from "@/utils/pusherConfig";
import TopNav from "@/components/TopNav";
import ChatBubbleMe from "@/components/ChatBubbleMe";
import ChatBubbleOther from "@/components/ChatBubbleOther";
import ChatInput from "@/components/ChatInput";
import { Router, useRouter } from "next/router";
import { Participant } from "@/utils/participant";
import { Message } from "@/utils/chat";
import { api } from "@/utils/api";
import { formatTimestampToTime } from "@/utils/helper";
import UserSideBar from "@/components/UserSideBar";

const TeamChat = () => {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [users, setUsers] = React.useState<Object[]>([]);
  // const [showDownButton, setShowDownButton] = React.useState(false);
  const {
    data: messageData,
    refetch,
    isLoading,
  } = api.chat.getMessages.useQuery({
    chatroom_id: router.query.id as string,
  });

  const { data: userRaw } = api.chat.getUsernamesFromChatroom.useQuery({
    chatroom_id: router.query.id as string,
  })

  const [isOpen, setIsOpen] = React.useState(true);

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
    if (isLoading || !messageData) return;
    setMessages(messageData.reverse());
    setUsers((userRaw || []).map((user) => { return { key: user._id, username: user.username } }))
  }, [isLoading, messageData]);

  const channelCode = React.useMemo(() => {
    return "presence-" + (router.query.id as string);
  }, [router.query.id]);

  React.useEffect(() => {
    if (!user) return;

    const pusherClient = pusherClientConstructor(user?._id);
    console.log("pusherClient", pusherClient);

    pusherClient.subscribe(channelCode);

    const messageHandler = (message: Message) => {
      console.log("incoming message", message);

      setMessages((prev) => [message, ...prev]);
    };

    pusherClient.bind("incoming-message", messageHandler);

    return () => {
      pusherClient.unsubscribe(channelCode);
      pusherClient.unbind("incoming-message", messageHandler);
    };
  }, [user, channelCode]);

  const scrollDownRef = React.useRef<HTMLDivElement | null>(null);

  const formatTimeStampToDate = (timestamp: number) => {
    const date = new Date(parseInt(timestamp.toString()));

    return date.toLocaleString("default", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // const scrollToBottom = () => {
  //   scrollDownRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  return (
    <>
      <div className="drawer drawer-end drawer-mobile">
        
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content ">
        <TopNav drawer = {handleDrawerToggle}/>

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
              <div ref={scrollDownRef} />
              {messages?.map((message) => {
                if (message.sender._id.toString() === user?._id) {
                  return (
                    <ChatBubbleMe
                      key={message._id.toString()}
                      senderId={message.sender._id.toString()}
                      senderName={message.sender.username}
                      text={message.text}
                      time={formatTimestampToTime(message.timestamp)}
                      date={formatTimeStampToDate(message.timestamp)}
                    />
                  );
                } else {
                  return (
                    <ChatBubbleOther
                      key={message._id.toString()}
                      senderId={message.sender._id.toString()}
                      senderName={message.sender.username}
                      text={message.text}
                      time={formatTimestampToTime(message.timestamp)}
                      date={formatTimeStampToDate(message.timestamp)}
                    />
                  );
                }
              })}
            </div>

            <ChatInput channelCode={channelCode} />
          </div>
        </div>
        <UserSideBar isOpen={isOpen} handleDrawerToggle={handleDrawerToggle} participants={users} />
      </div>
    </>
  );
};

export default TeamChat;
