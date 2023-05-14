import Image from "next/image";
import React from "react";
import type { TeamMenuItemProps } from "@/utils/chat";
import { useRouter } from "next/router";

export default function TeamMenuItem({
  id,
  avatarUrl,
  name,
  lastSender,
  lastMessage,
  lastMessageTime,
}: TeamMenuItemProps) {
  const router = useRouter();
  const [collapsed, setCollapsed] = React.useState(true);

  const handleChatBtnClick = () => {
    router.push(`/teamchat/${id}`).catch(console.error);
  };

  return (
    <>
      <div
        className="mt-4 flex items-center"
        onClick={() => setCollapsed((prev) => !prev)}
      >
        <div className="online avatar">
          <div className="w-16 rounded-xl">
            {/* <Image src={avatarUrl} alt="chat menu item" width={32} height={32} /> */}
            <img src={avatarUrl} alt="chat menu item" />
          </div>
        </div>
        <div className="ml-2">
          <div className="text-lg font-semibold">{name}</div>
          <div className="text-sm">{lastMessage}</div>
        </div>
        <div className="ml-auto text-xs">{lastMessageTime}</div>
      </div>
      {collapsed ? null : (
        <ul className="menu rounded-box w-full self-end bg-base-100 bg-primary-content">
          <li>
            <a onClick={handleChatBtnClick}>Chat</a>
          </li>
          <li className="bordered">
            <a>Scrum</a>
          </li>
        </ul>
      )}
    </>
  );
}
