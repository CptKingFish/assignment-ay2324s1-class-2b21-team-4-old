import ChatMenuItem from "./ChatMenuItem";
import type { ChatMenuItemProps } from "@/utils/chat";
import type { IChatroom } from "@/models/Chatroom";
import { formatTimestampToTime } from "@/utils/helper";

interface ChatListProps {
  privateChatrooms: IChatroom[];
}

export default function ChatList({ privateChatrooms }: ChatListProps) {
  if (privateChatrooms.length === 0) return null;
  return (
    // id={team._id.toString()}
    // avatarUrl={"https://i.pravatar.cc/300?img=1"}
    // name={team.name}
    // lastSender={team.messages[0]?.sender.username || ""}
    // lastMessage={team.messages[0]?.text || ""}
    // lastMessageTime={formatTimestampToTime(
    //   team.messages[0]?.timestamp || 0
    // )}
    <>
      {privateChatrooms.map((privateChatroom) => (
        <ChatMenuItem
          key={privateChatroom._id.toString()}
          id={privateChatroom._id.toString()}
          avatarUrl={"https://i.pravatar.cc/300?img=1"}
          name={"the other guy"}
          // lastSender={privateChatroom.messages[0]?.sender.username || ""}
          lastMessage={privateChatroom.messages[0]?.text || ""}
          lastMessageTime={formatTimestampToTime(
            privateChatroom.messages[0]?.timestamp || 0
          )}
          // key={chatInfo.id}
          // id={chatInfo.id}
          // avatarUrl={chatInfo.avatarUrl}
          // name={chatInfo.name}
          // lastMessage={chatInfo.lastMessage}
          // lastMessageTime={chatInfo.lastMessageTime}
        />
      ))}
    </>
  );
}
