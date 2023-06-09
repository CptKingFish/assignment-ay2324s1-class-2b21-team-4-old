import React, { useEffect } from "react";
import { useGlobalContext } from "@/context";
// import { pusherClientConstructor } from "@/utils/pusherConfig";
import TopNav from "@/components/TopNav";
import ChatInput from "@/components/Chat/ChatInput";
import { useRouter } from "next/router";
import ChatBody from "@/components/Chat/ChatBody";
import type { Message, PendingMessage } from "@/utils/chat";
import { api } from "@/utils/api";
import GroupSideBar from "@/components/GroupSideBar";
import { toast } from "react-hot-toast";
import { PresenceChannel } from "pusher-js";

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
  const utils = api.useContext();
  const [hasLoadedAllMessages, setHasLoadedAllMessages] = React.useState(false);

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
          imageUrl: user.avatar || "/Profile.png",
          admin: admin.admins.includes(user._id),
          friends: user.friends,
        };
      })
    );
  }, [isLoading, chatroomData, userRaw, admin]);

  const channelCode = React.useMemo(() => {
    return "presence-" + (router.query.id as string);
  }, [router.query.id]);

  React.useEffect(() => {
    setPendingMessages([]);
    if (!router.query.id) {
      router
        .push("/chat")
        .catch((err) => console.log("error from private chat", err));
      return;
    }
  }, [router, router.query.id]);

  React.useEffect(() => {
    if (!pusherClient) return;

    const subscribedChannels = pusherClient.channels.channels;
    let channel: PresenceChannel | undefined;

    if (!subscribedChannels[channelCode]) {
      channel = pusherClient.subscribe(channelCode) as PresenceChannel;
    } else {
      console.log("triggered");
      channel = subscribedChannels[channelCode] as PresenceChannel;
    }

    const messageHandler = (message: Message) => {
      setMessages((prev) => [...prev, message]);
      removePendingMessage(message._id.toString());
    };

    const userJoinedHandler = (message: Message) => {
      // setUsers((prev) => [...prev, user]);
      setMessages((prev) => [...prev, message]);
      void utils.chat.getUsernamesFromChatroom.invalidate({
        chatroom_id: router.query.id as string,
      });
      void utils.chat.getAdminFromChatroom.invalidate({
        chatroom_id: router.query.id as string,
      });
      void utils.chat.getMessagesAndChatroomInfo.invalidate({
        chatroom_id: router.query.id as string,
      });
    };

    const userLeftHandler = (message: Message) => {
      setMessages((prev) => [...prev, message]);
      void utils.chat.getUsernamesFromChatroom.invalidate({
        chatroom_id: router.query.id as string,
      });
      void utils.chat.getAdminFromChatroom.invalidate({
        chatroom_id: router.query.id as string,
      });
      void utils.chat.getMessagesAndChatroomInfo.invalidate({
        chatroom_id: router.query.id as string,
      });
    };

    const messageDeletedHandler = (data: { message_id: string }) => {
      setMessages((prev) => {
        return prev.map((message) => {
          if (message._id.toString() === data.message_id) {
            return {
              ...message,
              deleted: true,
              text: "This message has been deleted",
            };
          }
          return message;
        });
      });
    };

    channel.bind("incoming-message", messageHandler);
    channel.bind("incoming-image", () => {
      utils.chat.getMessagesAndChatroomInfo.refetch().catch(console.error);
    });
    channel.bind("message-deleted", messageDeletedHandler);
    channel.bind("user-joined", userJoinedHandler);
    channel.bind("user-left", userLeftHandler);

    return () => {
      // pusherClient.unsubscribe(channelCode);
      channel?.unbind("incoming-message", messageHandler);
      channel?.unbind("user-joined", userJoinedHandler);
      channel?.unbind("user-left", userLeftHandler);
    };
  }, [
    user,
    channelCode,
    pusherClient,
    utils.chat.getUsernamesFromChatroom,
    utils.chat.getAdminFromChatroom,
    utils.chat.getMessagesAndChatroomInfo,
    router.query.id,
  ]);

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
      if (hasLoadedAllMessages) return;
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
              if (data.length === 0) setHasLoadedAllMessages(true);
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
              chatroom_type="team"
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
                chatroom_id={chatroom_id}
              />
            </div>
            <ChatInput
              replyTo={replyTo}
              messages={messages}
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
