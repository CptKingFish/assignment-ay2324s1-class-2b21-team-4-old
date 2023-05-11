import ChatMenuItem from "./ChatMenuItem";
import type { ChatMenuItemProps } from "@/utils/chat";

interface ChatListProps {
  chatInfoArr: ChatMenuItemProps[];
}

export default function ChatList({ chatInfoArr }: ChatListProps) {
  if (chatInfoArr.length === 0) return null;
  return (
    <>
      {chatInfoArr.map((chatInfo) => (
        <li key={chatInfo.id}>
          <ChatMenuItem
            id={chatInfo.id}
            avatarUrl={chatInfo.avatarUrl}
            name={chatInfo.name}
            lastMessage={chatInfo.lastMessage}
            lastMessageTime={chatInfo.lastMessageTime}
          />
        </li>
      ))}
    </>
  );
}
