import React, { useEffect } from "react";
import { useGlobalContext } from "@/context";
import { pusherClientConstructor } from "@/utils/pusherConfig";
import TopNav from "@/components/TopNav";
import ChatInput from "@/components/Chat/ChatInput";
import { useRouter } from "next/router";
import ChatBody from "@/components/Chat/ChatBody";
import { Message, PendingMessage } from "@/utils/chat";
import { api } from "@/utils/api";
import PrivateSideBar from "@/components/PrivateSideBar";
import type { PusherMemberStatusProps } from "@/utils/chat";
import { toast } from "react-hot-toast";

export default function PrivateChat() {
  const router = useRouter();
  const { user, pusherClient } = useGlobalContext();
  const [replyTo, setReplyTo] = React.useState<Message | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [users, setUsers] = React.useState<any[]>([]);
  const [name, setName] = React.useState("");
  const [otherUserId, setOtherUserId] = React.useState("");
  const [otherUserIsOnline, setOtherUserIsOnline] = React.useState(false);
  const [hasLoadedAllMessages, setHasLoadedAllMessages] = React.useState(false);
  // const [msgCounter, setMsgCounter] = React.useState(0);

  const [pendingMessages, setPendingMessages] = React.useState<
    PendingMessage[]
  >([]);

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

  const addPendingMessage = (message: PendingMessage) => {
    setPendingMessages((prev) => [...prev, message]);
  };

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

  React.useEffect(() => {
    if (!user || !userRaw) return;

    const otherUser = userRaw.find(
      (participant) => user._id !== participant._id
    );
    setName(otherUser?.username || "");
    setOtherUserId(otherUser?._id || "");
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
        return {
          key: user._id,
          username: user.username,
          imageUrl: user.avatar || "/profile.png",
        };
      })
    );
  }, [isLoading, chatroomData, userRaw]);

  const channelCode = React.useMemo(() => {
    return "presence-" + (router.query.id as string);
  }, [router.query.id]);

  React.useEffect(() => {
    // if router is null route to /
    if (!router.query.id) {
      router
        .push("/chat")
        .catch((err) => console.log("error from private chat", err));
      return;
    }
  }, [router, router.query.id]);

  React.useEffect(() => {
    if (!pusherClient || !router.isReady || !router.query.id) return;

    const channel = pusherClient.subscribe(channelCode);

    const messageHandler = (message: Message) => {
      setMessages((prev) => [...prev, message]);
      removePendingMessage(message._id.toString());
    };

    const memberAddedHandler = (data: PusherMemberStatusProps) => {
      if (data.id === user?._id) return;
      setOtherUserIsOnline(true);
    };

    const memberRemovedHandler = (data: PusherMemberStatusProps) => {
      if (data.id === user?._id) return;
      setOtherUserIsOnline(false);
    };

    // presence-646b6c35c61cbeca5a4c0460

    channel.bind("incoming-message", messageHandler);
    channel.bind("pusher:member_added", memberAddedHandler);
    channel.bind("pusher:member_removed", memberRemovedHandler);

    return () => {
      channel.unbind("incoming-message", messageHandler);
      channel.unbind("pusher:member_added", memberAddedHandler);
      channel.unbind("pusher:member_removed", memberRemovedHandler);
      pusherClient.unsubscribe(channelCode);
    };
  }, [user, pusherClient, router.query.id, router.isReady, channelCode]);

  // /// // / /

  const scrollDownRef = React.useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    scrollDownRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
              console.log(data);
              if (data.length === 0) setHasLoadedAllMessages(true);
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
  }, [
    chatroom_id,
    getMoreMessages,
    getMoreMessagesIsLoading,
    hasLoadedAllMessages,
    messagesLength,
  ]);

  return (
    <>
      <div className="drawer-mobile drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

        <div className="flex-no-wrap drawer-content flex">
          <div className="relative flex h-full max-h-[calc(100vh-1rem)] flex-1 flex-col">
            <TopNav
              avatar={
                api.user.getAvatarUrl.useQuery({ user_id: otherUserId })?.data
                  ?.avatar || "/Profile.png"
              }
              chatroom_name={name || ""}
              chatroom_type="private"
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
                pendingMessages={pendingMessages}
                users={users}
              />
            </div>
            <ChatInput
              channelCode={channelCode}
              replyTo={replyTo}
              setReplyTo={setReplyTo}
              addPendingMessage={addPendingMessage}
              setPendingMessageHasFailed={setPendingMessageHasFailed}
            />
          </div>
        </div>
        <PrivateSideBar
          chatRoomAvatar={
            api.user.getAvatarUrl.useQuery({ user_id: otherUserId })?.data
              ?.avatar || "/Profile.png"
          }
          chatRoomName={name}
          isOpen={isOpen}
          handleDrawerToggle={handleDrawerToggle}
          participants={users}
          otherUserId={otherUserId}
        />
      </div>
    </>
  );
}
