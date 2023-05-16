import ChatMenuItem from "./ChatMenuItem";
import type { ChatMenuItemProps } from "@/utils/chat";
import type { IChatroom } from "@/models/Chatroom";
import { formatTimestampToTime } from "@/utils/helper";
import { ChatroomInfoWithParticipantNames } from "./SideBarNav";
interface ChatListProps {
  privateChatrooms: ChatroomInfoWithParticipantNames[];
}

export default function ChatList({ privateChatrooms }: ChatListProps) {
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
              // name={otherUser?.username || ""}
              // lastSender={privateChatroom.messages[0]?.sender.username || ""}
              lastMessage={privateChatroom.messages[0]}
              // lastMessageTime={formatTimestampToTime(
              //   privateChatroom.messages[0]?.timestamp || 0
              // )}
            />
          );
        }
      )}
    </>
  );
}
