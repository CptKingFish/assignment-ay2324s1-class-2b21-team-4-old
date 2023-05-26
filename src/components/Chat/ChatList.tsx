import ChatMenuItem from "./ChatMenuItem";
import type { ChatMenuItemProps } from "@/utils/chat";
import type { IChatroom } from "@/models/Chatroom";
import { formatTimestampToTime } from "@/utils/helper";
import { ChatroomInfoWithParticipantNames } from "../Navbar/SideBarNav";
import { api } from "@/utils/api";
import { useGlobalContext } from "@/context";
interface ChatListProps {
  privateChatrooms: ChatroomInfoWithParticipantNames[];
  display: boolean;
}

export default function ChatList({ privateChatrooms, display }: ChatListProps) {
  const { user } = useGlobalContext();

  if (privateChatrooms.length === 0) return null;
  return (
    <>
      {privateChatrooms.map(
        (
          privateChatroom: ChatroomInfoWithParticipantNames // get username of the other person
        ) => {
          return (
            <ChatMenuItem
              key={privateChatroom._id.toString()}
              id={privateChatroom._id.toString()}
              // avatarUrl={avatar}
              participants={privateChatroom.participants}
              lastMessage={privateChatroom.messages[0]}
              display={display}
            />
          );
        }
      )}
    </>
  );
}
