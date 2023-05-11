import TeamMenuItem from "./TeamMenuItem";
import type { TeamMenuItemProps } from "@/utils/chat";

interface TeamListProps {
  teamInfoArr: TeamMenuItemProps[];
}

export default function TeamList({ teamInfoArr }: TeamListProps) {
  if (teamInfoArr.length === 0) return null;
  return (
    <>
      {teamInfoArr.map((chatInfo) => (
        <li key={chatInfo.id}>
          <TeamMenuItem
            id={chatInfo.id}
            avatarUrl={chatInfo.avatarUrl}
            name={chatInfo.name}
            lastSender={chatInfo.lastSender}
            lastMessage={chatInfo.lastMessage}
            lastMessageTime={chatInfo.lastMessageTime}
          />
        </li>
      ))}
    </>
  );
}
