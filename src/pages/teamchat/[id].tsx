import React from "react";
import { useGlobalContext } from "@/context";
// import { pusherClient } from "@/utils/pusherConfig";
import { pusherClientConstructor } from "@/utils/pusherConfig";
import TopNav from "@/components/TopNav";
import ChatBubbleMe from "@/components/ChatBubbleMe";
import ChatBubbleOther from "@/components/ChatBubbleOther";
import ChatInput from "@/components/ChatInput";
import { Router, useRouter } from "next/router";

const TeamChat = () => {
  const { user } = useGlobalContext();
  const [messages, setMessages] = React.useState<Message[]>([]);
  // const router = useRouter();
  // const query = router.query as unknown as Router;
  const channelCode = React.useMemo(() => {
    return "presence-" + "1";
  }, []);

  React.useEffect(() => {
    if (!user) return;
    const pusherClient = pusherClientConstructor(user?._id);
    console.log("pusherClient", pusherClient);

    pusherClient.subscribe(channelCode);

    const messageHandler = (message: Message) => {
      setMessages((prev) => [message, ...prev]);
    };

    pusherClient.bind("incoming-message", messageHandler);

    return () => {
      pusherClient.unsubscribe(channelCode);
      pusherClient.unbind("incoming-message", messageHandler);
    };
  }, [channelCode]);

  const scrollDownRef = React.useRef<HTMLDivElement | null>(null);
  // const formatTimestamp = (timestamp: number) => {
  //   return format(timestamp, "HH:mm");
  // };
  // id: uuidv4() as string,
  //   senderId: user_id,
  //   text: text,
  //   timestamp: timestamp,

  return (
    <div className="relative flex h-full max-h-[calc(107vh-6rem)] flex-1 flex-col justify-between justify-items-end">
      <TopNav />
      <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex h-full flex-1 flex-col-reverse gap-4 overflow-y-auto p-3 pb-16">
        {messages?.map((message) => {
          if (message.senderId === user?._id) {
            return (
              <ChatBubbleMe
                key={message.id}
                senderId={message.senderId}
                text={message.text}
                timestamp={message.timestamp.toString()}
              />
            );
          } else {
            return (
              <ChatBubbleOther
                key={message.id}
                senderId={message.senderId}
                text={message.text}
                timestamp={message.timestamp.toString()}
              />
            );
          }
        })}
        {/* <ChatBubbleOther senderId={"lol"} text={"lol"} timestamp={"fff"} />
        <ChatBubbleOther senderId={"lol"} text={"lol"} timestamp={"fff"} />
        <ChatBubbleOther senderId={"lof"} text={"lol"} timestamp={"fff"} /> */}
      </div>

      <ChatInput channelCode={channelCode} />
    </div>
  );
};

export default TeamChat;
