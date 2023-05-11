import Image from "next/image";
import type { ChatMenuItemProps } from "@/utils/chat";

export default function ChatMenuItem({
  avatarUrl,
  name,
  lastMessage,
  lastMessageTime,
}: ChatMenuItemProps) {
  return (
    <div className="mt-4 flex items-center ">
      <div className="online avatar">
        <div className="w-16 rounded-xl">
          {/* <Image src={avatarUrl} alt="chat menu item" width={32} height={32} /> */}
          <img src={avatarUrl} alt="chat menu item" />
        </div>
      </div>
      <div className="ml-2">
        <div className="text-lg font-semibold">{name}</div>
        <div className="text-sm text-neutral-content">{lastMessage}</div>
      </div>
      <div className="ml-auto text-xs text-neutral-content">
        {lastMessageTime}
      </div>
    </div>
  );
}
