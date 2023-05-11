import Image from "next/image";
import React from "react";
import type { TeamMenuItemProps } from "@/utils/chat";

export default function TeamMenuItem({
  avatarUrl,
  name,
  lastSender,
  lastMessage,
  lastMessageTime,
}: TeamMenuItemProps) {
  const [collapsed, setCollapsed] = React.useState(true);

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
          <div className="text-sm text-neutral-content">
            {lastSender + " " + lastMessage}
          </div>
        </div>
        <div className="ml-auto text-xs text-neutral-content">
          {lastMessageTime}
        </div>
      </div>
      {collapsed ? null : (
        <ul className="menu rounded-box w-full self-end bg-base-100 bg-secondary">
          <li>
            <a>Chat</a>
          </li>
          <li className="bordered">
            <a>Scrum</a>
          </li>
        </ul>
      )}
    </>
  );
}
