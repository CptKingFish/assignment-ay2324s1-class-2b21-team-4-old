import ChatMenuItem from "./ChatMenuItem";
import type { ChatMenuItemProps } from "@/utils/chat";
import type { IChatroom } from "@/models/Chatroom";
import { formatTimestampToTime } from "@/utils/helper";
import { ChatroomInfoWithParticipantNames } from "./SideBarNav";
interface ChatListProps {
  privateChatrooms: ChatroomInfoWithParticipantNames[];
  display: boolean;
}

export default function ChatList({ privateChatrooms, display }: ChatListProps) {
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
              avatarUrl={"https://i.pravatar.cc/300?img=1"}
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
