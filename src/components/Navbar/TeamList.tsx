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
  searchValue: string;
}

export default function TeamList({
  teamChatrooms,
  display,
  searchValue,
}: TeamListProps) {
  if (teamChatrooms.length === 0) return null;
  return (
    <>
      {teamChatrooms.map((team) => {
        const matchesSearch = team.name
          ? team.name.toLowerCase().includes(searchValue.toLowerCase())
          : false;
        return (
          <li key={team._id.toString()} hidden={!display || !matchesSearch}>
            <TeamMenuItem
              id={team._id.toString()}
              avatarUrl={team.avatarUrl || "/GroupProfile.png"}
              name={team.name || ""}
              lastMessage={team.messages[0]}
              searchValue={searchValue}
            />
          </li>
        );
      })}
    </>
  );
}
