import { IChatroom } from "@/models/Chatroom";
import TeamMenuItem from "./TeamMenuItem";
import type { TeamMenuItemProps } from "@/utils/chat";
import { formatTimestampToTime } from "@/utils/helper";
// interface TeamListProps {
//   teamInfoArr: TeamMenuItemProps[];
// }

interface TeamListProps {
  teamChatrooms: IChatroom[];
  display: boolean;
}

export default function TeamList({ teamChatrooms, display }: TeamListProps) {
  if (teamChatrooms.length === 0) return null;
  return (
    <>
      {teamChatrooms.map((team) => (
        <li key={team._id.toString()} hidden={!display}>
          <TeamMenuItem
            id={team._id.toString()}
            avatarUrl={team.avatarUrl || "/GroupProfile.png"}
            name={team.name || ""}
            lastMessage={team.messages[0]}
          />
        </li>
      ))}
    </>
  );
}
