import { IChatroom } from "@/models/Chatroom";
import TeamMenuItem from "./TeamMenuItem";
import type { TeamMenuItemProps } from "@/utils/chat";
import { formatTimestampToTime } from "@/utils/helper";
// interface TeamListProps {
//   teamInfoArr: TeamMenuItemProps[];
// }

export default function TeamList({
  teamChatrooms,
}: {
  teamChatrooms: IChatroom[];
}) {
  if (teamChatrooms.length === 0) return null;
  return (
    <>
      {teamChatrooms.map((team) => (
        <li key={team._id.toString()}>
          <TeamMenuItem
            id={team._id.toString()}
            avatarUrl={"https://i.pravatar.cc/300?img=1"}
            name={team.name}
            lastSender={team.messages[0]?.sender.username || ""}
            lastMessage={team.messages[0]?.text || ""}
            lastMessageTime={formatTimestampToTime(
              team.messages[0]?.timestamp || 0
            )}
          />
        </li>
      ))}
    </>
  );
}
