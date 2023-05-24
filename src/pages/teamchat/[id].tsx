import React, { useEffect } from "react";
import { useGlobalContext } from "@/context";
// import { pusherClientConstructor } from "@/utils/pusherConfig";
import TopNav from "@/components/TopNav";
import ChatInput from "@/components/ChatInput";
import { useRouter } from "next/router";
import ChatBody from "@/components/ChatBody";
import type { Message, PendingMessage } from "@/utils/chat";
import { api } from "@/utils/api";
import GroupSideBar from "@/components/GroupSideBar";
import { toast } from "react-hot-toast";

interface Admin {
  admins: string[];
}

const TeamChat = () => {
  const router = useRouter();
  const { user, pusherClient } = useGlobalContext();
  const [replyTo, setReplyTo] = React.useState<Message | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [users, setUsers] = React.useState<any[]>([]);
  const [pendingMessages, setPendingMessages] = React.useState<
    PendingMessage[]
  >([]);

  const { data: chatroomData, isLoading } =
    api.chat.getMessagesAndChatroomInfo.useQuery({
      chatroom_id: router.query.id as string,
    });

  const { data: userRaw } = api.chat.getUsernamesFromChatroom.useQuery({
    chatroom_id: router.query.id as string,
  });

  const { data: admin } = api.chat.getAdminFromChatroom.useQuery({
    chatroom_id: router.query.id as string,
  }) as { data: Admin };

  const [isOpen, setIsOpen] = React.useState(false);

  function handleDrawerToggle() {
    setIsOpen(!isOpen);
  }

  // add pending message

  const addPendingMessage = (message: PendingMessage) => {
    setPendingMessages((prev) => [...prev, message]);
  };

  // remove pending message

  const removePendingMessage = (message_id: string) => {
    setPendingMessages((prev) => {
      return prev.filter((message) => message._id !== message_id);
    });
  };

  const setPendingMessageHasFailed = (message_id: string) => {
    setPendingMessages((prev) => {
      return prev.map((message) => {
        if (message._id === message_id) {
          return { ...message, hasFailed: true };
        }
        return message;
      });
    });
  };

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
          friends: user.friends,
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
      console.log("this da msg", message);
      setMessages((prev) => [...prev, message]);
      removePendingMessage(message._id.toString());
    };

    channel.bind("incoming-message", messageHandler);

    return () => {
      pusherClient.unsubscribe(channelCode);
      channel.unbind("incoming-message", messageHandler);
    };
  }, [user, channelCode, pusherClient]);

  const chatroom_id = React.useMemo(() => {
    return router.query.id as string;
  }, [router.query.id]);

  const { mutate: getMoreMessages } = api.chat.getMoreMessages.useMutation();

  const scrollableRef = React.useRef<HTMLDivElement>(null);

  const [getMoreMessagesIsLoading, setGetMoreMessagesIsLoading] =
    React.useState(false);

  const messagesLength = React.useMemo(() => {
    return messages.length;
  }, [messages]);

  React.useEffect(() => {
    const scrollableElement = scrollableRef.current;

    const handleScroll = () => {
      if (!scrollableElement) return;
      const scrollTop = scrollableElement.scrollTop;
      const clientHeight = scrollableElement.clientHeight;
      const scrollHeight = scrollableElement.scrollHeight;

      if (-scrollTop + clientHeight >= scrollHeight - 200) {
        console.log("Scrolled to the top!");
        console.log(chatroom_id);

        if (!chatroom_id || getMoreMessagesIsLoading) return;

        setGetMoreMessagesIsLoading(true);

        getMoreMessages(
          {
            chatroom_id: chatroom_id,
            skipCount: messagesLength,
            limitValue: 50,
          },
          {
            onSuccess: (data) => {
              console.log(data);
              setMessages((prev) => [...data, ...prev]);
            },

            onError: (error) => {
              toast.error(error.message);
            },
            onSettled: () => {
              setGetMoreMessagesIsLoading(false);
            },
          }
        );
      }
    };

    if (!scrollableElement) return;

    scrollableElement.addEventListener("scroll", handleScroll);

    return () => {
      scrollableElement.removeEventListener("scroll", handleScroll);
    };
  }, [chatroom_id, getMoreMessages, getMoreMessagesIsLoading, messagesLength]);

  return (
    <>
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

          <div className="relative flex h-full max-h-[calc(100vh-1rem)] flex-1 flex-col">
            <TopNav
              avatar={chatroomData?.avatarUrl || "/GroupProfile.png"}
              chatroom_name={chatroomData?.name || ""}
              openSidebarDetails={handleDrawerToggle}
            />
            <div
              id="chat-body"
              ref={scrollableRef}
              className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex h-full flex-1 flex-col-reverse gap-4 overflow-y-auto scroll-smooth p-3 pb-16"
            >
              <ChatBody
                setReplyTo={setReplyTo}
                messages={messages}
                users={users}
                pendingMessages={pendingMessages}
              />
            </div>
            <ChatInput
              replyTo={replyTo}
              setReplyTo={setReplyTo}
              channelCode={channelCode}
              addPendingMessage={addPendingMessage}
              setPendingMessageHasFailed={setPendingMessageHasFailed}
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
        <GroupSideBar
          chatRoomId={router.query.id as string}
          chatRoomAvatar={chatroomData?.avatarUrl || "/GroupProfile.png"}
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
