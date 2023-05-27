import ChatMenuItem from "./ChatMenuItem";
import type { ChatMenuItemProps } from "@/utils/chat";
import type { IChatroom } from "@/models/Chatroom";
import { formatTimestampToTime } from "@/utils/helper";
import { ChatroomInfoWithParticipantNames } from "./SideBarNav";
import { api } from "@/utils/api";
import { useGlobalContext } from "@/context";
interface ChatListProps {
  privateChatrooms: ChatroomInfoWithParticipantNames[];
  display: boolean;
}

export default function ChatList({ privateChatrooms, display }: ChatListProps) {
  const { user } = useGlobalContext()
  if (privateChatrooms.length === 0) return null;

  return (
    <>
      {privateChatrooms.map(
        (
          privateChatroom: ChatroomInfoWithParticipantNames // get username of the other person
        ) => {
          
          const otherParticipantIndex = privateChatroom.participants.findIndex(participant => participant?._id === user?._id) === 0 ? 1 : 0;
          const otherParticipantId = privateChatroom.participants[otherParticipantIndex]?._id || "";
          return (
            <ChatMenuItem
              key={privateChatroom._id.toString()}
              id={privateChatroom._id.toString()}
              avatarUrl={privateChatroom?.participants?.find(
                (participant) => user?._id !== participant._id
              )?.avatar || "/Profile.png"}
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
