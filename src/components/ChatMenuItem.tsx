import Image from "next/image";
// key={privateChatroom._id.toString()}
// id={privateChatroom._id.toString()}
// avatarUrl={"https://i.pravatar.cc/300?img=1"}
// name={"the other guy"}
// // lastSender={privateChatroom.messages[0]?.sender.username || ""}
// lastMessage={privateChatroom.messages[0]?.text || ""}
// lastMessageTime={formatTimestampToTime(
//   privateChatroom.messages[0]?.timestamp || 0
// )}

// id,
// avatarUrl,
// name,
// lastSender,
// lastMessage,
// lastMessageTime,

interface ChatMenuItemProps {
  id: string;
  avatarUrl: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
}

export default function ChatMenuItem({
  avatarUrl,
  name,
  lastMessage,
  lastMessageTime,
}: ChatMenuItemProps) {
  return (
    <li className="bordered">
      <div className="mt-4 flex items-center">
        <div className="online avatar">
          <div className="w-16 rounded-full">
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
    </li>
  );
}
